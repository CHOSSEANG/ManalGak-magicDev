package com.magicdev.manalgak.domain.meeting.dto;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;
import com.magicdev.manalgak.domain.place.dto.PlaceResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class MeetingAllResponse {

    private MeetingDetailResponse meeting;

    public static MeetingAllResponse from(Meeting meeting, List<ParticipantResponse> participants, PlaceResponse.Place selectedPlace){
        MeetingDetailResponse from = MeetingDetailResponse.from(meeting, participants,selectedPlace);
        return MeetingAllResponse.builder()
                .meeting(from)
                .build();
    }
}
