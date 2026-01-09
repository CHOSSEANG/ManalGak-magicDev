package com.magicdev.manalgak.domain.meeting.service;

import com.magicdev.manalgak.domain.meeting.dto.MeetingCreateRequest;
import com.magicdev.manalgak.domain.meeting.dto.MeetingCreateResponse;
import com.magicdev.manalgak.domain.meeting.dto.MeetingResponse;
import com.magicdev.manalgak.domain.meeting.dto.MeetingUpdateRequest;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;

import java.util.List;

public interface MeetingService {

    MeetingCreateResponse createMeeting(MeetingCreateRequest request, Long userId);

    Meeting getMeeting(Long id);

//    List<Meeting> getAllMeetings(Long userId);

    MeetingResponse updateMeeting(MeetingUpdateRequest request, Long id, Long userId);

    void deleteMeeting(Long id,Long userId);
}
