package com.magicdev.manalgak.domain.participant.dto;

import com.magicdev.manalgak.domain.participant.entity.Location;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import lombok.Getter;

@Getter
public class ParticipantUpdateRequest {
    private String nickName;
    private Boolean handicap;
    private Participant.ParticipationStatus status;
    private Participant.TransportType type;
    private Location origin;
    private Location destination;

}
