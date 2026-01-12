package com.magicdev.manalgak.domain.meeting.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.common.util.UuidGenerator;
import com.magicdev.manalgak.domain.meeting.dto.MeetingCreateRequest;
import com.magicdev.manalgak.domain.meeting.dto.MeetingCreateResponse;
import com.magicdev.manalgak.domain.meeting.dto.MeetingResponse;
import com.magicdev.manalgak.domain.meeting.dto.MeetingUpdateRequest;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class MeetingServiceImpl implements MeetingService {

    private final MeetingRepository meetingRepository;
    private final String frontendBaseUrl;


    public MeetingServiceImpl(MeetingRepository meetingRepository, @Value("${frontend.base-url}") String frontendBaseUrl) {
        this.meetingRepository = meetingRepository;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @Override
    public MeetingCreateResponse createMeeting(MeetingCreateRequest request, Long userId) {
        Meeting meeting = request.toEntity(userId);
        String uuid = UuidGenerator.generate();
        meeting.setMeetingUuid(uuid);

        Meeting save = meetingRepository.save(meeting);
        String shareUrl = frontendBaseUrl+"/m/"+save.getMeetingUuid();
        return MeetingCreateResponse.from(save,shareUrl);
    }

    @Override
    public Meeting getMeeting(Long id) {
        return meetingRepository.findById(id).orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));
    }

//    @Override
//    public List<Meeting> getAllMeetings(Long userId) {

//        List<MeetingParticipant> participants = participantRepository.findByUserId(userId);
//
//        List<Long> meetingIds = participants.stream()
//                .map(MeetingParticipant::getMeetingId)
//                .distinct()
//                .toList();
//
//        return meetingRepository.findAllById(meetingIds);
//    }

    @Override
    @Transactional
    public MeetingResponse updateMeeting(MeetingUpdateRequest updated, Long id, Long userId) {
        Meeting meeting = getMeeting(id);
        validateIsOrganizer(userId, meeting);
        meeting.update(updated);
        return MeetingResponse.from(meeting);
    }


    @Transactional
    @Override
    public void deleteMeeting(Long id, Long userId) {
        Meeting meeting = getMeeting(id);
        validateIsOrganizer(userId, meeting);
        meetingRepository.delete(meeting);
    }

    private static void validateIsOrganizer(Long userId, Meeting meeting) {
        if (!meeting.getOrganizerId().equals(userId)) {
            throw new BusinessException(ErrorCode.MEETING_NOT_ORGANIZER);
        }
    }
}
