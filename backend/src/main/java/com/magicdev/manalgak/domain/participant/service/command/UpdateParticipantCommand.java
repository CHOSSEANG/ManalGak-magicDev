package com.magicdev.manalgak.domain.participant.service.command;

import com.magicdev.manalgak.domain.participant.entity.Participant;
import lombok.Getter;

@Getter
public class UpdateParticipantCommand {

    private final String nickName;
    private final String originAddress;
    private final String destinationAddress;
    private final Participant.TransportType type;
    private final Boolean handicap;
    private final Participant.ParticipationStatus status;

    public UpdateParticipantCommand(
            String nickName,
            String originAddress,
            String destinationAddress,
            Participant.TransportType type,
            Boolean handicap,
            Participant.ParticipationStatus status
    ) {
        this.nickName = nickName;
        this.originAddress = originAddress;
        this.destinationAddress = destinationAddress;
        this.type = type;
        this.handicap = handicap;
        this.status = status;
    }
}
