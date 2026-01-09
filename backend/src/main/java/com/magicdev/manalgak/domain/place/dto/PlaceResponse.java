package com.magicdev.manalgak.domain.place.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceResponse {
    private List<Place> places;
    private int totalCount;
    private boolean fromCache;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Place {
        private String placeName;
        private String categoryName;
        private String address;
        private Double latitude;
        private Double longitude;
        private Integer distance;
        private Double rating;
    }
}
