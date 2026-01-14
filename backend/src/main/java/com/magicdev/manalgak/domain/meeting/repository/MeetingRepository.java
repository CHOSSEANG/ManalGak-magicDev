package com.magicdev.manalgak.domain.meeting.repository;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MeetingRepository extends JpaRepository<Meeting,Long> {

    Optional<Meeting> findByMeetingUuid(String meetingUuid);

}
