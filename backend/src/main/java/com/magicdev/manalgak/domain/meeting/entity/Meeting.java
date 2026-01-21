package com.magicdev.manalgak.domain.meeting.entity;

import com.magicdev.manalgak.common.util.DateTimeUtil;
import com.magicdev.manalgak.domain.meeting.service.command.UpdateMeetingCommand;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Table(name = "meetings")
@Entity
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String meetingUuid;

    private String meetingName;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(20)")
    private MeetingStatus status;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(50)")
    private MeetingPurpose purpose;

    private LocalDateTime meetingTime;

    private LocalDateTime endTime;

    private Integer totalParticipants;

    private Long organizerId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime expiresAt;

    @PrePersist
    public void prePersist(){
        this.createdAt = DateTimeUtil.now();
        this.updatedAt = this.createdAt;
        this.expiresAt = this.createdAt.plusHours(24);
        if (this.status == null) this.status = MeetingStatus.PENDING;
    }

    @PreUpdate
    public void preUpdate(){
        this.updatedAt = DateTimeUtil.now();
    }

    public enum MeetingStatus {
        PENDING,      // 생성됨
        COMPLETED    // 완료
    }

    public enum MeetingPurpose {
        DINING,
        CAFE,
        CULTURE,
        TOUR
    }

    public void update(UpdateMeetingCommand command) {
        if (command.getMeetingName() != null) {
            this.meetingName = command.getMeetingName();
        }
        if (command.getMeetingTime() != null) {
            this.meetingTime = command.getMeetingTime();
        }
        if (command.getEndTime() != null) {
            this.endTime = command.getEndTime();
        }
        if (command.getPurpose() != null) {
            this.purpose = command.getPurpose();
        }
        if (command.getStatus() != null) {
            this.status = command.getStatus();
        }
        if (command.getTotalParticipants() != null) {
            this.totalParticipants = command.getTotalParticipants();
        }
    }
}
