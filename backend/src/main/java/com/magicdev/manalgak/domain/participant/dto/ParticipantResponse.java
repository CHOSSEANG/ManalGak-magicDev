package com.magicdev.manalgak.domain.participant.dto;

import com.magicdev.manalgak.domain.participant.entity.Location;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ParticipantResponse {
    private Long participantId;
    private Long meetingId;
    private Participant.ParticipationStatus status;
    private String nickName;
    private String profileImageUrl;
    private Location origin;
    private Location destination;
    private Participant.TransportType transportType;
    private Long userId;
    private boolean handicap;


    public static ParticipantResponse from(Participant participant){
        return ParticipantResponse.builder()
                .participantId(participant.getId())
                .meetingId(participant.getMeeting().getId())
                .status(participant.getStatus())
                .nickName(participant.getNickName())
                .profileImageUrl(participant.getUser().getProfileImageUrl())
                .origin(participant.getOrigin())
                .destination(participant.getDestination())
                .transportType(participant.getType())
                .userId(participant.getUser().getId())
                .handicap(participant.isHandicap())
                .build();
    }
}
