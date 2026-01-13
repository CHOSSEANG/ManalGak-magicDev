package com.magicdev.manalgak.domain.external.odsay.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 막차 정보 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LastTrainInfo implements Serializable {

    /**
     * 지하철역 이름
     */
    private String stationName;

    /**
     * 노선명 (예: 수도권 2호선)
     */
    private String lineName;

    /**
     * 막차 시간 (HH:mm 형식)
     */
    private String lastTrainTime;

    /**
     * 남은 시간 (분)
     */
    private Integer remainingMinutes;

    /**
     * 막차가 임박했는지 여부 (60분 이내)
     */
    private Boolean isLastTrainSoon;

    /**
     * 방향 (상행/하행)
     */
    private String direction;

    /**
     * 종착역
     */
    private String terminalStation;
}
