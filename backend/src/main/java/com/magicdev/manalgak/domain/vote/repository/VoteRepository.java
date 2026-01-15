package com.magicdev.manalgak.domain.vote.repository;

import com.magicdev.manalgak.domain.vote.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {

    List<Vote> findByMeetingId(Long meetingId);
}
