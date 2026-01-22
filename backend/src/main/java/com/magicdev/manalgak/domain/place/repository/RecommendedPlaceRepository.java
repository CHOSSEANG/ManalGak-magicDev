package com.magicdev.manalgak.domain.place.repository;

import com.magicdev.manalgak.domain.place.entity.RecommendedPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecommendedPlaceRepository extends JpaRepository<RecommendedPlace, Long> {

    Optional<RecommendedPlace> findByMeetingMeetingUuid(String meetingUuid);

    boolean existsByMeetingMeetingUuid(String meetingUuid);

    void deleteByMeetingMeetingUuid(String meetingUuid);
}