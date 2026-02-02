package com.magicdev.manalgak.domain.external.kakao.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 카카오 모빌리티 길찾기 API 응답 DTO
 */
@Data
@NoArgsConstructor
public class KakaoDirectionsResponse {

    @JsonProperty("trans_id")
    private String transId;
    private List<Route> routes;

    @Data
    @NoArgsConstructor
    public static class Route {
        @JsonProperty("result_code")
        private int result_code;
        @JsonProperty("result_msg")
        private String result_msg;
        private Summary summary;
        private List<Section> sections;
    }

    @Data
    @NoArgsConstructor
    public static class Summary {
        private Origin origin;
        private Origin destination;
        private int distance;  // 총 거리 (미터)
        private int duration;  // 총 소요시간 (초)
    }

    @Data
    @NoArgsConstructor
    public static class Origin {
        private double x;  // 경도
        private double y;  // 위도
    }

    @Data
    @NoArgsConstructor
    public static class Section {
        private int distance;
        private int duration;
        private List<Road> roads;
    }

    @Data
    @NoArgsConstructor
    public static class Road {
        private String name;
        private int distance;
        private int duration;
        private double[] vertexes;  // [lng, lat, lng, lat, ...]
    }

    public int getDurationInMinutes() {
        if (routes == null || routes.isEmpty()) {
            return 0;
        }
        Route route = routes.get(0);
        if (route.getSummary() == null) {
            return 0;
        }
        return route.getSummary().getDuration() / 60;
    }

    public int getDistanceInMeters() {
        if (routes == null || routes.isEmpty()) {
            return 0;
        }
        Route route = routes.get(0);
        if (route.getSummary() == null) {
            return 0;
        }
        return route.getSummary().getDistance();
    }

    public boolean isSuccess() {
        return routes != null && !routes.isEmpty() && routes.get(0).getResult_code() == 0;
    }
}
