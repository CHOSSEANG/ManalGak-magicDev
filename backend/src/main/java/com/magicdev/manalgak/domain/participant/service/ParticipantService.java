package com.magicdev.manalgak.domain.participant.service;


import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.participant.dto.ParticipantUpdateRequest;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;
import com.magicdev.manalgak.domain.participant.service.command.UpdateParticipantCommand;

import java.util.List;

public interface ParticipantService {

    ParticipantResponse joinMeeting(String meetingUuid, Long userId);

    ParticipantResponse updateParticipant(String meetingUuid, Long participantId, Long userId, UpdateParticipantCommand command);

    List<ParticipantResponse> copyParticipant(Meeting oldMeeting, Meeting newMeeting);

    List<ParticipantResponse> getAllParticipants(String meetingUuid);

}
