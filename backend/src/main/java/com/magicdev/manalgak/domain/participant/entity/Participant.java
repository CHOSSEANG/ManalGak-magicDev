package com.magicdev.manalgak.domain.participant.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Participant {
    private Long id;
    private String name;
    private Double startLatitude;
    private Double startLongitude;
}
