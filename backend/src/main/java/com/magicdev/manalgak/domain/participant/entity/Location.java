package com.magicdev.manalgak.domain.participant.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Location {

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11,scale = 8)
    private BigDecimal longitude;

    @Column(length = 255)
    private String address;
}
