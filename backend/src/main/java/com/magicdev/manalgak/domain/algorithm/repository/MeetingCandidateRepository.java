package com.magicdev.manalgak.domain.algorithm.repository;

import com.magicdev.manalgak.domain.algorithm.entity.MeetingCandidate;

import java.util.Optional;

public interface MeetingCandidateRepository {
    Optional<MeetingCandidate> findById(Long id);
}
