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
    private String status;
    private String shareUrl;
    private LocalDateTime expiresAt;

    public static MeetingCreateResponse from(Meeting meeting){
        return MeetingCreateResponse.builder()
                .meetingId(meeting.getId())
                .meetingUuid(meeting.getMeetingUuid())
                .meetingName(meeting.getMeetingName())
                .status(meeting.getStatus().name())
                .shareUrl("https://manalgak.com/m/" + meeting.getMeetingUuid())
                .expiresAt(meeting.getExpiresAt())
                .build();
    }
}