package com.magicdev.manalgak.domain.participant.repository;

import com.magicdev.manalgak.domain.participant.entity.Participant;

import java.util.List;

public interface ParticipantRepository {
    List<Participant> findByMeetingUuid(String meetingUuid);
}
