package com.magicdev.manalgak.domain.participant.repository;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.user.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    boolean existsByMeetingIdAndUser(Long meetingId, User user);

    boolean existsByMeetingIdAndNickName(Long meetingId, String nickName);

    List<Participant> findByMeetingId(Long meetingId);

    long countByMeetingId(Long meetingId);

    List<Participant> findByUser(User user);

    void deleteByMeeting(Meeting meeting);
}
