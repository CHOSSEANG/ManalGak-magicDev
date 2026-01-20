package com.magicdev.manalgak.domain.participant.repository;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    boolean existsByMeetingIdAndUser(Long meetingId, User user);

    boolean existsByMeetingIdAndNickName(Long meetingId, String nickName);

    @Query("SELECT p FROM Participant p JOIN FETCH p.user WHERE p.meeting.id = :meetingId")
    List<Participant> findByMeetingId(@Param("meetingId") Long meetingId);

    long countByMeetingId(Long meetingId);

    List<Participant> findByUser(User user);

    void deleteByMeeting(Meeting meeting);

    @Query("SELECT p FROM Participant p JOIN FETCH p.user WHERE p.meeting.id IN :meetingIds")
    List<Participant> findByMeetingIdIn(@Param("meetingIds") List<Long> meetingIds);

    Optional<Participant>  findByMeeting_IdAndUser_Id(Long meetingId, Long userId);
}
