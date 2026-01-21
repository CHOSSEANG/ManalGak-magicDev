package com.magicdev.manalgak.domain.participant.dto;

import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.service.command.UpdateParticipantCommand;
import lombok.Getter;

@Getter
public class ParticipantUpdateRequest {
    private String nickName;
    private Boolean handicap;
    private Participant.ParticipationStatus status;
    private Participant.TransportType type;
    private String originAddress;
    private String destinationAddress;

    public UpdateParticipantCommand toCommand() {
        return new UpdateParticipantCommand(
                nickName,
                originAddress,
                destinationAddress,
                type,
                handicap,
                status
        );
    }

}
