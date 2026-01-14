package com.magicdev.manalgak.domain.meeting.dto;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MeetingCopyResponse {

    private MeetingCreateResponse meeting;
    private List<ParticipantResponse> participants;

    public static MeetingCopyResponse from (Meeting meeting, List<ParticipantResponse> participants, String shareUrl){
        return MeetingCopyResponse.builder()
                .meeting(MeetingCreateResponse.from(meeting, shareUrl))
                .participants(participants)
                .build();

    }
}
