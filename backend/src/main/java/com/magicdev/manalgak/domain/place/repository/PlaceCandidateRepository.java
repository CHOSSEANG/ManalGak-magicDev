package com.magicdev.manalgak.domain.place.repository;

import com.magicdev.manalgak.domain.place.entity.PlaceCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceCandidateRepository extends JpaRepository<PlaceCandidate, Long> {

    List<PlaceCandidate> findByMeetingMeetingUuid(String meetingUuid);

    boolean existsByMeetingMeetingUuid(String meetingUuid);

    void deleteByMeetingMeetingUuid(String meetingUuid);
}