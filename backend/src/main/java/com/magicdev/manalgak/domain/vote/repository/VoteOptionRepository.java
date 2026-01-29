package com.magicdev.manalgak.domain.vote.repository;

import com.magicdev.manalgak.domain.vote.entity.VoteOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VoteOptionRepository extends JpaRepository<VoteOption, Long> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from VoteOption vo where vo.vote.id = :voteId")
    void deleteByVoteId(@Param("voteId") Long voteId);
    List<VoteOption> findByVoteId(Long voteId);
}
