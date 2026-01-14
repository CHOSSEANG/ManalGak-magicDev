package com.magicdev.manalgak.domain.meeting.service;

import com.magicdev.manalgak.domain.meeting.dto.*;

import java.util.List;

public interface MeetingService {

    MeetingCreateResponse createMeeting(MeetingCreateRequest request, Long userId);

    MeetingDetailResponse getMeeting(String meetingUuid);

    List<MeetingAllResponse> getAllMeetings(Long userId);

    MeetingResponse updateMeeting(MeetingUpdateRequest request, String meetingUuid, Long userId);

    void deleteMeeting(String meetingUuid,Long userId);

    MeetingCopyResponse copyMeeting(String meetingUuid, Long userId);

}
