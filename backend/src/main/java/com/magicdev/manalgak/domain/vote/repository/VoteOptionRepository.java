package com.magicdev.manalgak.domain.vote.repository;

import com.magicdev.manalgak.domain.vote.entity.VoteOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoteOptionRepository extends JpaRepository<VoteOption, Long> {

    List<VoteOption> findByVoteId(Long voteId);
}
