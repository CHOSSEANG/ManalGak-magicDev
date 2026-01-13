package com.magicdev.manalgak.domain.algorithm.repository;

import com.magicdev.manalgak.domain.algorithm.entity.MeetingCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeetingCandidateRepository extends JpaRepository<MeetingCandidate, Long> {
    // JpaRepository가 기본 CRUD 메서드 제공 (findById 포함)
}
