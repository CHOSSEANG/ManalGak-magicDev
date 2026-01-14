package com.magicdev.manalgak.domain.meeting.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.common.util.UuidGenerator;
import com.magicdev.manalgak.domain.meeting.dto.*;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import com.magicdev.manalgak.domain.participant.dto.ParticipantCreateRequest;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.repository.ParticipantRepository;
import com.magicdev.manalgak.domain.participant.service.ParticipantService;
import com.magicdev.manalgak.domain.user.dto.User;
import com.magicdev.manalgak.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class MeetingServiceImpl implements MeetingService {

    private final MeetingRepository meetingRepository;
    private final String frontendBaseUrl;
    private final ParticipantService participantService;
    private final ParticipantRepository participantRepository;
    private final UserRepository userRepository;

    public MeetingServiceImpl(MeetingRepository meetingRepository, @Value("${frontend.base-url}") String frontendBaseUrl, ParticipantService participantService, ParticipantRepository participantRepository, UserRepository userRepository) {
        this.meetingRepository = meetingRepository;
        this.frontendBaseUrl = frontendBaseUrl;
        this.participantService = participantService;
        this.participantRepository = participantRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public MeetingCreateResponse createMeeting(MeetingCreateRequest request, Long userId) {
        Meeting meeting = request.toEntity(userId);
        String uuid = UuidGenerator.generate();
        meeting.setMeetingUuid(uuid);

        Meeting save = meetingRepository.save(meeting);
        String shareUrl = frontendBaseUrl+"/m/"+save.getMeetingUuid();

        ParticipantCreateRequest participantCreateRequest = new ParticipantCreateRequest();
        participantCreateRequest.setNickName(request.getMeetingNickName());
        participantService.joinMeeting(uuid,userId,participantCreateRequest);
        return MeetingCreateResponse.from(save,shareUrl);
    }

    @Override
    public MeetingDetailResponse getMeeting(String meetingUuid) {
        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid).orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        List<ParticipantResponse> participants = participantRepository.findByMeetingId(meeting.getId())
                .stream()
                .map(ParticipantResponse::from)
                .toList();

        return MeetingDetailResponse.from(meeting,participants);
    }


    @Override
    public List<MeetingAllResponse> getAllMeetings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        List<Participant> userParticipants  = participantRepository.findByUser(user);

        List<Long> meetingIds = userParticipants.stream()
                .map(p->p.getMeeting().getId())
                .distinct()
                .toList();

        if (meetingIds.isEmpty()) {
            return List.of();
        }

        List<Participant> allParticipants =
                participantRepository.findByMeetingIdIn(meetingIds);

        Map<Long, List<ParticipantResponse>> participantMap =
                allParticipants.stream()
                        .map(ParticipantResponse::from)
                        .collect(Collectors.groupingBy(
                                ParticipantResponse::getMeetingId
                        ));

        return userParticipants.stream()
                .map(p->{
                    Meeting meeting = p.getMeeting();
                    List<ParticipantResponse> participants =
                            participantMap.getOrDefault(meeting.getId(), List.of());
                    return MeetingAllResponse.from(meeting,participants);
                })
                .distinct()
                .toList();
    }

    public Meeting getMeetingByMeetingUuid (String meetingUuid) {
        return meetingRepository.findByMeetingUuid(meetingUuid).orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));
    }


    @Override
    @Transactional
    public MeetingResponse updateMeeting(MeetingUpdateRequest updated, String meetingUuid, Long userId) {
        Meeting meeting = getMeetingByMeetingUuid(meetingUuid);
        validateIsOrganizer(userId, meeting);
        meeting.update(updated);
        return MeetingResponse.from(meeting);
    }


    @Transactional
    @Override
    public void deleteMeeting(String meetingUuid, Long userId) {
        Meeting meeting = getMeetingByMeetingUuid(meetingUuid);
        validateIsOrganizer(userId, meeting);
        participantRepository.deleteByMeeting(meeting);
        meetingRepository.delete(meeting);
    }

    private static void validateIsOrganizer(Long userId, Meeting meeting) {
        if (!meeting.getOrganizerId().equals(userId)) {
            throw new BusinessException(ErrorCode.MEETING_NOT_ORGANIZER);
        }
    }

    @Override
    public MeetingCopyResponse copyMeeting(String meetingUuid, Long userId) {

        Meeting oldMeeting = meetingRepository.findByMeetingUuid(meetingUuid).orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));
        String uuid = UuidGenerator.generate();

        Meeting newMeeting = new Meeting();
        newMeeting.setMeetingName(oldMeeting.getMeetingName());
        newMeeting.setOrganizerId(userId);
        newMeeting.setStatus(Meeting.MeetingStatus.PENDING);
        newMeeting.setTotalParticipants(oldMeeting.getTotalParticipants());
        newMeeting.setMeetingUuid(uuid);

        Meeting savedMeeting = meetingRepository.save(newMeeting);

        List<ParticipantResponse> participantResponses = participantService.copyParticipant(oldMeeting, savedMeeting);

        String shareUrl = frontendBaseUrl+"/m/"+savedMeeting.getMeetingUuid();
        return MeetingCopyResponse.from(savedMeeting,participantResponses,shareUrl);
    }
}
