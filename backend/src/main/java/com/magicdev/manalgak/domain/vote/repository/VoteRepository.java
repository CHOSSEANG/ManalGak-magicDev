package com.magicdev.manalgak.domain.vote.repository;

import com.magicdev.manalgak.domain.vote.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    Optional<Vote> findFirstByMeeting_MeetingUuid(String meetingUuid);
}
