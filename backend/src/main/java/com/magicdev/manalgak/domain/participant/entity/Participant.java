package com.magicdev.manalgak.domain.participant.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "participant")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meeting_uuid", nullable = false)
    private String meetingUuid;

    @Column(nullable = false)
    private String name;

    @Column(name = "start_latitude", nullable = false)
    private Double startLatitude;

    @Column(name = "start_longitude", nullable = false)
    private Double startLongitude;

    @Column(name = "start_address")
    private String startAddress;

    /**
     * ID 기반 equals 구현 (JPA 엔티티 Best Practice)
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Participant that = (Participant) o;
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
