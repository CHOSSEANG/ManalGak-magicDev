package com.magicdev.manalgak.domain.route.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RouteSummaryRequest {
    private List<RouteInfo> routes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RouteInfo {
        private String participantName;
        private int travelTime;
        private int transferCount;
        private String transportType;
    }
}
