package com.magicdev.manalgak.domain.meeting.dto;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import lombok.Getter;


@Getter
public class MeetingCreateRequest {

    private String meetingName;

    public Meeting toEntity(Long organizerId){
        Meeting meeting = new Meeting();
        meeting.setMeetingName(this.meetingName);
        meeting.setOrganizerId(organizerId);
        return meeting;
    }
}
