package com.magicdev.manalgak.domain.meeting.dto;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class MeetingResponse {

    private String meetingName;
    private LocalDateTime meetingTime;
    private Meeting.MeetingPurpose purpose;
    private Meeting.MeetingStatus status;
    private Integer totalParticipants;

    public static MeetingResponse from(Meeting meeting) {
        return MeetingResponse.builder()
                .meetingName(meeting.getMeetingName())
                .meetingTime(meeting.getMeetingTime())
                .purpose(meeting.getPurpose())
                .status(meeting.getStatus())
                .totalParticipants(meeting.getTotalParticipants())
                .build();
    }
}
