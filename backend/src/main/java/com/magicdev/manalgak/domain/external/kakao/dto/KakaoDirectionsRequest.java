package com.magicdev.manalgak.domain.external.kakao.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KakaoDirectionsRequest {
    private Double originLng;
    private Double originLat;
    private Double destinationLng;
    private Double destinationLat;
    private String priority;

    public String getOrigin() {
        return originLng + "," + originLat;
    }

    public String getDestination() {
        return destinationLng + "," + destinationLat;
    }
}
