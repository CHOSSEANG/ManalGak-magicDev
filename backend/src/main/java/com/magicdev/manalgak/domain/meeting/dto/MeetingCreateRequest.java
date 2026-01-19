package com.magicdev.manalgak.domain.meeting.dto;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.service.command.CreateMeetingCommand;
import lombok.Getter;

import java.time.LocalDateTime;


@Getter
public class MeetingCreateRequest {

    private String meetingName;
    private LocalDateTime meetingTime;
    private Meeting.MeetingPurpose purpose;

    public CreateMeetingCommand toCommand(Long organizerId) {
        return CreateMeetingCommand.builder()
                .meetingName(this.meetingName)
                .meetingTime(this.meetingTime)
                .purpose(this.purpose)
                .organizerId(organizerId)
                .build();
    }
}
