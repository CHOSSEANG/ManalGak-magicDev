package com.magicdev.manalgak.domain.algorithm.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingCandidate {
    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;
    private String address;
}
