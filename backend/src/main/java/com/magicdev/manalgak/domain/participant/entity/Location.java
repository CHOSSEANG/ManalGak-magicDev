package com.magicdev.manalgak.domain.participant.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Location {

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(length = 255)
    private String address;
}
