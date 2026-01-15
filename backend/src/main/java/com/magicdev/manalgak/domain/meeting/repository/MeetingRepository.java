package com.magicdev.manalgak.domain.meeting.repository;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MeetingRepository extends JpaRepository<Meeting,Long> {

    Optional<Meeting> findByMeetingUuid(String meetingUuid);

    Page<Meeting> findByIdIn(List<Long> meetingIds, Pageable pageable);

}
