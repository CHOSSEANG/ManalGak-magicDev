package com.magicdev.manalgak.domain.participant.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.common.util.DateTimeUtil;
import com.magicdev.manalgak.domain.geocoding.dto.GeoPoint;
import com.magicdev.manalgak.domain.geocoding.service.GeocodingService;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;
import com.magicdev.manalgak.domain.participant.entity.Location;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.repository.ParticipantRepository;
import com.magicdev.manalgak.domain.participant.service.command.UpdateParticipantCommand;
import com.magicdev.manalgak.domain.place.service.PlaceService;
import com.magicdev.manalgak.domain.user.entity.User;
import com.magicdev.manalgak.domain.user.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ParticipantServiceImpl implements ParticipantService {

    private final ParticipantRepository participantRepository;
    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;
    private final GeocodingService geoCodingService;
    private final SimpMessagingTemplate messagingTemplate;
    private final PlaceService placeService;

    private static final int MAX_COUNT = 10;

    public ParticipantServiceImpl(ParticipantRepository participantRepository, MeetingRepository meetingRepository, UserRepository userRepository, GeocodingService geoCodingService, SimpMessagingTemplate messagingTemplate, @Lazy PlaceService placeService) {
        this.participantRepository = participantRepository;
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
        this.geoCodingService = geoCodingService;
        this.messagingTemplate = messagingTemplate;
        this.placeService = placeService;
    }

    @Override
    @Transactional
    public ParticipantResponse joinMeeting(String meetingUuid, Long userId) {

        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Participant existing = participantRepository
                .findByMeeting_IdAndUser_Id(meeting.getId(), userId)
                .orElse(null);

        if (existing != null) {
            return ParticipantResponse.from(existing);
        }

        if (participantRepository.countByMeetingId(meeting.getId()) >= MAX_COUNT) {
            throw new BusinessException(ErrorCode.MAX_PARTICIPANTS_EXCEEDED);
        }

        if (meeting.getExpiresAt().isBefore(DateTimeUtil.now())) {
            throw new BusinessException(ErrorCode.MEETING_EXPIRED);
        }

        Participant participant = Participant.create(meeting, user, user.getNickname());
        participantRepository.save(participant);

        messagingTemplate.convertAndSend(
                "/topic/meeting/" + meeting.getMeetingUuid() + "/participants",
                ParticipantResponse.from(participant)
        );

        return ParticipantResponse.from(participant);
    }

    @Override
    public ParticipantResponse updateParticipant(
            String meetingUuid,
            Long participantId,
            Long userId,
            UpdateParticipantCommand command
    ) {

        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PARTICIPANT_NOT_FOUND));

        if (!participant.getMeeting().getMeetingUuid().equals(meetingUuid)) {
            throw new BusinessException(ErrorCode.MEETING_NOT_FOUND);
        }

        boolean isSelf = participant.getUser().getId().equals(userId);
        boolean isOrganizer = participant.getMeeting().getOrganizerId().equals(userId);

        if (!isSelf && !isOrganizer) {
            throw new BusinessException(ErrorCode.NO_AUTHORITY);
        }

        if (command.getOriginAddress() != null) {
            GeoPoint geoPoint = geoCodingService.geocode(command.getOriginAddress());
            if (geoPoint == null) {
                throw new BusinessException(ErrorCode.ADDRESS_NOT_FOUND);
            }
            participant.updateOrigin(
                    new Location(
                            geoPoint.getLatitude(),
                            geoPoint.getLongitude(),
                            command.getOriginAddress()
                    )
            );

            // 출발지 변경 시 추천 장소 캐시 무효화
            placeService.invalidatePlaceCache(meetingUuid);
        }

        if (command.getDestinationAddress() != null) {
            GeoPoint geoPoint = geoCodingService.geocode(command.getDestinationAddress());
            if (geoPoint == null) {
                throw new BusinessException(ErrorCode.ADDRESS_NOT_FOUND);
            }
            participant.updateDestination(
                    new Location(
                            geoPoint.getLatitude(),
                            geoPoint.getLongitude(),
                            command.getDestinationAddress()
                    )
            );
        }

        participant.update(command);
        if (command.getStatus() != null) {
            participant.changeStatus(command.getStatus());
        }

        ParticipantResponse response = ParticipantResponse.from(participant);

        messagingTemplate.convertAndSend(
                "/topic/meeting/" + participant.getMeeting().getMeetingUuid() + "/participants",
                response
        );

        return response;
    }


    @Override
    public List<ParticipantResponse> copyParticipant(Meeting oldMeeting, Meeting newMeeting) {

        List<Participant> oldParticipants = participantRepository.findByMeetingId(oldMeeting.getId());
        List<ParticipantResponse> responses = new ArrayList<>();
        for (Participant old : oldParticipants) {

            Participant copyParticipant = Participant.create(
                    newMeeting,
                    old.getUser(),
                    old.getNickName()
            );
            participantRepository.save(copyParticipant);
            responses.add(ParticipantResponse.from(copyParticipant));
        }

        return responses;
    }

    @Override
    public List<ParticipantResponse> getAllParticipants(String meetingUuid) {

        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid).orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        List<Participant> participants = participantRepository.findByMeetingId(meeting.getId());

        return participants.stream()
                .map(ParticipantResponse::from)
                .collect(Collectors.toList());
    }


}
