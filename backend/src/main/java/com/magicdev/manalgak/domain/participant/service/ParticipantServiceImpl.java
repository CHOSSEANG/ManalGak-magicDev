package com.magicdev.manalgak.domain.participant.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.common.util.DateTimeUtil;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import com.magicdev.manalgak.domain.participant.dto.ParticipantCreateRequest;
import com.magicdev.manalgak.domain.participant.dto.ParticipantUpdateRequest;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.repository.ParticipantRepository;
import com.magicdev.manalgak.domain.user.dto.User;
import com.magicdev.manalgak.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ParticipantServiceImpl implements ParticipantService {

    private final ParticipantRepository participantRepository;
    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private static final int MAX_COUNT = 10;

    @Override
    public ParticipantResponse joinMeeting(String meetingUuid, Long userId) {

        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        long count = participantRepository.countByMeetingId(meeting.getId());

        if (count > MAX_COUNT) {
            throw new BusinessException(ErrorCode.MAX_PARTICIPANTS_EXCEEDED);
        }

        if (participantRepository.existsByMeetingIdAndUser(meeting.getId(), user)) {
            throw new BusinessException(ErrorCode.ALREADY_PARTICIPANT);
        }


        if (meeting.getExpiresAt().isBefore(DateTimeUtil.now())) {
            throw new BusinessException(ErrorCode.MEETING_EXPIRED);
        }

        Participant participant = Participant.create(meeting, user, user.getNickname());

        participantRepository.save(participant);

        messagingTemplate.convertAndSend("/topic/meeting/"+meeting.getMeetingUuid()+"/participants",
                ParticipantResponse.from(participant));

        return ParticipantResponse.from(participant);
    }


    @Override
    @Transactional
    public ParticipantResponse updateParticipant(String meetingUuid, Long participantId, Long userId, ParticipantUpdateRequest request) {

        Participant participant = participantRepository.findById(participantId).orElseThrow(() -> new BusinessException(ErrorCode.PARTICIPANT_NOT_FOUND));

        if (!participant.getMeeting().getMeetingUuid().equals(meetingUuid)) {
            throw new BusinessException(ErrorCode.MEETING_NOT_FOUND);
        }

        boolean isSelf = participant.getUser().getId().equals(userId);
        boolean isOrganizer = participant.getMeeting().getOrganizerId().equals(userId);

        if (request.getNickName() != null
                || request.getOrigin() != null
                || request.getDestination() != null
                || request.getType() != null
                || request.getHandicap() != null
        ) {
            if (!isSelf) {
                throw new BusinessException(ErrorCode.NO_AUTHORITY);
            }
            if (request.getNickName() != null &&
                    !request.getNickName().equals(participant.getNickName()) &&
                    participantRepository.existsByMeetingIdAndNickName(participant.getMeeting().getId(), request.getNickName())) {
                throw new BusinessException(ErrorCode.DUPLICATE_PARTICIPANT_NAME);
            }
            participant.update(request);
        }

        if (request.getStatus() != null) {
            if (!isSelf && !isOrganizer) {
                throw new BusinessException(ErrorCode.NO_AUTHORITY);
            }
            participant.changeStatus(request.getStatus());
        }

        ParticipantResponse response = ParticipantResponse.from(participant);

        // WebSocket 알림 전송
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
