package com.magicdev.manalgak.domain.meeting.dto;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;
import com.magicdev.manalgak.domain.place.dto.PlaceResponse;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class MeetingDetailResponse {
    private String meetingName;
    private LocalDateTime meetingTime;
    private LocalDateTime endTime;
    private Meeting.MeetingPurpose purpose;
    private Meeting.MeetingStatus status;
    private Integer totalParticipants;
    private Long organizerId;
    private String meetingUuid;
    private PlaceResponse.Place selectedPlace;

    private List<ParticipantResponse> participants; // 참여자 리스트

    public static MeetingDetailResponse from(Meeting meeting,
                                             List<ParticipantResponse> participants,
                                             PlaceResponse.Place selectedPlace){
        return MeetingDetailResponse.builder()
                .meetingName(meeting.getMeetingName())
                .meetingTime(meeting.getMeetingTime())
                .endTime(meeting.getEndTime())
                .purpose(meeting.getPurpose())
                .status(meeting.getStatus())
                .totalParticipants(participants.size())
                .participants(participants)
                .organizerId(meeting.getOrganizerId())
                .meetingUuid(meeting.getMeetingUuid())
                .selectedPlace(selectedPlace)
                .build();
    }
}