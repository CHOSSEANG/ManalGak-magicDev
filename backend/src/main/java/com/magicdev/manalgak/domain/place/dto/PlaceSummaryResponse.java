package com.magicdev.manalgak.domain.place.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceSummaryResponse {
    private String summary;
    private List<PlaceRecommendation> recommendations;
    private int totalPlaces;
    private LocalDateTime generatedAt;
    private boolean fromCache;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlaceRecommendation {
        private String placeName;
        private String categoryName;
        private Integer distance;
        private Double rating;
    }
}
