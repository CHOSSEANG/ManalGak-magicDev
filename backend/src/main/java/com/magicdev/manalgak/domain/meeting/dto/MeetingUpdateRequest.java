package com.magicdev.manalgak.domain.meeting.dto;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.service.command.UpdateMeetingCommand;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class MeetingUpdateRequest {

    private String meetingName;
    private LocalDateTime meetingTime;
    private LocalDateTime endTime;
    private Meeting.MeetingPurpose purpose;
    private Meeting.MeetingStatus status;
    private Integer totalParticipants;

    public UpdateMeetingCommand toCommand() {
        return UpdateMeetingCommand.builder()
                .meetingName(this.meetingName)
                .meetingTime(this.meetingTime)
                .endTime(this.endTime)
                .purpose(this.purpose)
                .status(this.status)
                .totalParticipants(this.totalParticipants)
                .build();
    }

}
