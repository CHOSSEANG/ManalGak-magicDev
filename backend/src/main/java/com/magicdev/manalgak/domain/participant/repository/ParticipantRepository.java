package com.magicdev.manalgak.domain.participant.repository;

import com.magicdev.manalgak.domain.participant.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    List<Participant> findByMeetingUuid(String meetingUuid);
}
