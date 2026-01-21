package com.magicdev.manalgak.domain.participant.entity;


import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.participant.service.command.UpdateParticipantCommand;
import com.magicdev.manalgak.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name="participants",
        uniqueConstraints = {
                @UniqueConstraint(
                        name="uk_meeting_user",
                        columnNames = {"meeting_id","user_id"}
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="meeting_id",nullable = false)
    private Meeting meeting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name="nickname",nullable = false)
    private String nickName;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(20)")
    private ParticipationStatus status;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "latitude", column = @Column(name = "origin_latitude")),
            @AttributeOverride(name = "longitude", column = @Column(name = "origin_longitude")),
            @AttributeOverride(name = "address", column = @Column(name = "origin_address"))
    })
    private Location origin;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "latitude", column = @Column(name = "return_latitude")),
            @AttributeOverride(name = "longitude", column = @Column(name = "return_longitude")),
            @AttributeOverride(name = "address", column = @Column(name = "return_address"))
    })
    private Location destination;

    @Column(nullable = false)
    private LocalDateTime joinedAt;

    private boolean handicap;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "varchar(20)")
    private TransportType type;

    public enum ParticipationStatus {
        INVITED,    // 초대됨
        CONFIRMED,  // 확정
        DECLINED    // 불참
    }

    public enum TransportType {
        WALK,        // 도보
        PUBLIC,      // 대중교통
        CAR          // 자동차
    }

    public static Participant create(Meeting meeting, User user, String nickName) {
        Participant p = new Participant();
        p.meeting = meeting;
        p.nickName = nickName;
        p.user = user;
        p.status = ParticipationStatus.INVITED;
        p.joinedAt = LocalDateTime.now();
        return p;
    }

    public void update(UpdateParticipantCommand command){
        if(command.getNickName() != null){
            this.nickName = command.getNickName();
        }
        if(command.getType() != null){
            this.type = command.getType();
        }
        if(command.getHandicap() != null){
            this.handicap = command.getHandicap();
        }

    }

    public void changeStatus(ParticipationStatus status){
        this.status = status;
    }

    public void updateOrigin(Location origin) {
        this.origin = origin;
    }

    public void updateDestination(Location destination) {
        this.destination = destination;
    }

}
