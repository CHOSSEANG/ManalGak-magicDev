package com.magicdev.manalgak.domain.route.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Step4 지도 경로 시각화 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MapRouteResponse {

    private Midpoint midpoint;
    private List<ParticipantRoute> participants;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Midpoint {
        private double lat;
        private double lng;
        private String stationName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantRoute {
        private Long participantId;
        private String nickName;
        private String profileImageUrl;
        private Origin origin;
        private List<double[]> path;  // 도로 경로 좌표 [[lat, lng], ...]
        private String color;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Origin {
        private double lat;
        private double lng;
        private String address;
    }
}