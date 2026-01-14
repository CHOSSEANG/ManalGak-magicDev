package com.magicdev.manalgak.domain.participant.service;


import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.participant.dto.ParticipantCreateRequest;
import com.magicdev.manalgak.domain.participant.dto.ParticipantUpdateRequest;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;

import java.util.List;

public interface ParticipantService {

    ParticipantResponse joinMeeting(String meetingUuid, Long userId, ParticipantCreateRequest request);

    ParticipantResponse updateParticipant(String meetingUuid, Long participantId, Long userId, ParticipantUpdateRequest request);

    List<ParticipantResponse> copyParticipant(Meeting oldMeeting, Meeting newMeeting);

    List<ParticipantResponse> getAllParticipants(String meetingUuid);

}
