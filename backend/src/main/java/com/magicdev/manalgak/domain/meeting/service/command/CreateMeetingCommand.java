package com.magicdev.manalgak.domain.meeting.service.command;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class CreateMeetingCommand {
    private Long organizerId;
    private String meetingName;
    private LocalDateTime meetingTime;
    private LocalDateTime endTime;
    private Meeting.MeetingPurpose purpose;

    public Meeting toEntity() {
        Meeting meeting = new Meeting();
        meeting.setOrganizerId(this.organizerId);
        meeting.setMeetingName(this.meetingName);
        meeting.setMeetingTime(this.meetingTime);
        meeting.setPurpose(this.purpose);
        meeting.setEndTime(this.endTime);
        return meeting;
    }
}