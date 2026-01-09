package com.magicdev.manalgak.domain.odsay.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LastTrainResponse {
    private String stationName;
    private String lineName;
    private LocalDateTime lastTrainTime;
    private Integer taxiFare;
    private boolean fromCache;
}
