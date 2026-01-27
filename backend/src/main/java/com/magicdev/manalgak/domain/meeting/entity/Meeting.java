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

    @Transient
    private String selectedPlaceId;
    @Transient
    private String selectedPlaceName;
    @Transient
    private String selectedPlaceCategory;
    @Transient
    private String selectedPlaceCategoryGroupCode;
    @Transient
    private String selectedPlaceCategoryGroupName;
    @Transient
    private String selectedPlaceCategoryName;
    @Transient
    private String selectedPlaceAddress;
    @Transient
    private String selectedPlaceRoadAddress;
    @Transient
    private Double selectedPlaceLatitude;
    @Transient
    private Double selectedPlaceLongitude;
    @Transient
    private Integer selectedPlaceDistance;
    @Transient
    private Integer selectedPlaceWalkingMinutes;
    @Transient
    private String selectedPlaceStationName;
    @Transient
    private String selectedPlacePhone;
    @Transient
    private String selectedPlaceUrl;

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

    public void updateSelectedPlace(
            String placeId,
            String placeName,
            String category,
            String categoryGroupCode,
            String categoryGroupName,
            String categoryName,
            String address,
            String roadAddress,
            Double latitude,
            Double longitude,
            Integer distance,
            Integer walkingMinutes,
            String stationName,
            String phone,
            String placeUrl
    ) {
        this.selectedPlaceId = placeId;
        this.selectedPlaceName = placeName;
        this.selectedPlaceCategory = category;
        this.selectedPlaceCategoryGroupCode = categoryGroupCode;
        this.selectedPlaceCategoryGroupName = categoryGroupName;
        this.selectedPlaceCategoryName = categoryName;
        this.selectedPlaceAddress = address;
        this.selectedPlaceRoadAddress = roadAddress;
        this.selectedPlaceLatitude = latitude;
        this.selectedPlaceLongitude = longitude;
        this.selectedPlaceDistance = distance;
        this.selectedPlaceWalkingMinutes = walkingMinutes;
        this.selectedPlaceStationName = stationName;
        this.selectedPlacePhone = phone;
        this.selectedPlaceUrl = placeUrl;
    }
}