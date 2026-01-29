package com.magicdev.manalgak.domain.vote.repository;

import com.magicdev.manalgak.domain.vote.entity.VoteRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VoteRecordRepository extends JpaRepository<VoteRecord, Long> {
    Optional<VoteRecord> findByVoteIdAndParticipantId(Long voteId, Long participantId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from VoteRecord vr where vr.vote.id = :voteId")
    void deleteByVoteId(@Param("voteId") Long voteId);
    List<VoteRecord> findByVoteId(Long voteId);

}
