package com.magicdev.manalgak.domain.route.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {
    private List<RouteInfo> routes;
    private RouteStatistics statistics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RouteInfo {
        private String participantName;
        private String path;
        private int travelTime;
        private int transferCount;
        private String transportType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RouteStatistics {
        private int averageTravelTime;
        private int maxTravelTime;
        private int minTravelTime;
        private int totalTransfers;
        private String mostFrequentTransport;
    }
}
