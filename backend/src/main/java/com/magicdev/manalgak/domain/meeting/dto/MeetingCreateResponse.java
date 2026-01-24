package com.magicdev.manalgak.domain.meeting.dto;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MeetingCreateResponse {

    private Long meetingId;
    private String meetingUuid;
    private String meetingName;
    private LocalDateTime meetingTime;
    private LocalDateTime endTime;
    private String status;
    private String shareUrl;
    private LocalDateTime expiresAt;
    private Long organizerId;

    public static MeetingCreateResponse from(Meeting meeting,String shareUrl){
        return MeetingCreateResponse.builder()
                .meetingId(meeting.getId())
                .meetingUuid(meeting.getMeetingUuid())
                .meetingName(meeting.getMeetingName())
                .meetingTime(meeting.getMeetingTime())
                .endTime(meeting.getEndTime())
                .status(meeting.getStatus().name())
                .shareUrl(shareUrl)
                .expiresAt(meeting.getExpiresAt())
                .organizerId(meeting.getOrganizerId())
                .build();
    }
}