package com.magicdev.manalgak.domain.meeting.service;

import com.magicdev.manalgak.domain.meeting.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MeetingService {

    MeetingCreateResponse createMeeting(MeetingCreateRequest request, Long userId);

    MeetingDetailResponse getMeeting(String meetingUuid);

    Page<MeetingAllResponse> getAllMeetings(Long userId, Pageable pageable);

    MeetingResponse updateMeeting(MeetingUpdateRequest request, String meetingUuid, Long userId);

    void deleteMeeting(String meetingUuid,Long userId);

    MeetingCopyResponse copyMeeting(String meetingUuid, Long userId);

}
