package com.magicdev.manalgak.domain.algorithm.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "meeting_candidate")
@Getter
@Setter
@ToString
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

    /**
     * ID 기반 equals 구현 (JPA 엔티티 Best Practice)
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MeetingCandidate that = (MeetingCandidate) o;
        return id != null && id.equals(that.id);
    }

    /**
     * 클래스 기반 hashCode 구현 (JPA 엔티티 Best Practice)
     */
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
