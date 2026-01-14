package com.magicdev.manalgak.domain.participant.dto;

import com.magicdev.manalgak.domain.participant.entity.Location;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.socket.sockjs.transport.TransportType;

@Getter
@Builder
public class ParticipantResponse {
    private Long participantId;
    private String status;
    private String nickName;
    private String profileImageUrl;
    private Location origin;
    private Location destination;
    private TransportType transportType;


    public static ParticipantResponse from(Participant participant){
        return ParticipantResponse.builder()
                .participantId(participant.getId())
                .status(participant.getStatus().name())
                .nickName(participant.getNickName())
                .profileImageUrl(participant.getUser().getProfileImageUrl())
                .origin(participant.getOrigin())
                .destination(participant.getDestination())
                .build();
    }
}
