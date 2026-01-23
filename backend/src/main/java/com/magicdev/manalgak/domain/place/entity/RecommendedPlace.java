package com.magicdev.manalgak.domain.place.entity;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "recommended_places")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendedPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;

    @Column(nullable = false)
    private String placeId;  // 카카오 장소 ID

    @Column(nullable = false)
    private String placeName;

    private String category;

    private String categoryGroupCode;

    private String categoryGroupName;

    private String address;

    private String roadAddress;

    private Double latitude;

    private Double longitude;

    private Integer distance;

    private Integer walkingMinutes;

    private String phone;

    private String placeUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}