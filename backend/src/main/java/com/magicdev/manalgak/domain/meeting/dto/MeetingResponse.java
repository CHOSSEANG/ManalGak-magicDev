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
    private LocalDateTime endTime;
    private Meeting.MeetingPurpose purpose;
    private Meeting.MeetingStatus status;
    private Integer totalParticipants;
    private Long organizerId;

    public static MeetingResponse from(Meeting meeting) {
        return MeetingResponse.builder()
                .meetingName(meeting.getMeetingName())
                .meetingTime(meeting.getMeetingTime())
                .endTime(meeting.getEndTime())
                .purpose(meeting.getPurpose())
                .status(meeting.getStatus())
                .totalParticipants(meeting.getTotalParticipants())
                .organizerId(meeting.getOrganizerId())
                .build();
    }
}
