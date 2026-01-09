package com.magicdev.manalgak.domain.meeting.entity;

import com.magicdev.manalgak.common.util.DateTimeUtil;
import com.magicdev.manalgak.domain.meeting.dto.MeetingUpdateRequest;
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
        STUDY_CAFE,
        CAFE,
        ROOM_CAFE,
        MOVIE,
        SHOPPING,
        KARAOKE,
        RESTAURANT,
        BRUNCH,
        DRINK
    }

    public void update(MeetingUpdateRequest request) {
        if (request.getMeetingName() != null) {
            this.meetingName = request.getMeetingName();
        }
        if (request.getMeetingTime() != null) {
            this.meetingTime = request.getMeetingTime();
        }
        if (request.getPurpose() != null) {
            this.purpose = request.getPurpose();
        }
        if (request.getStatus() != null) {
            this.status = request.getStatus();
        }

        if (request.getTotalParticipants() != null) {
            this.totalParticipants = request.getTotalParticipants();
        }
    }
}
