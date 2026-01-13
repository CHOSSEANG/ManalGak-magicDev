package com.magicdev.manalgak.domain.algorithm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "meeting_candidate")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingCandidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_uuid", nullable = false)
    private String meetingUuid;

    @Column
    private String name;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column
    private String address;
}
