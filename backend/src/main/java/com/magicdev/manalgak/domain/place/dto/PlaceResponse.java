package com.magicdev.manalgak.domain.place.dto;

import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;
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
    private Integer totalCount;
    private Coordinate midpoint;
    private boolean fromCache;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Place {
        private String placeId;
        private String placeName;

        // 프론트엔드 카테고리 (cafe, restaurant, culture, tour)
        private String category;

        // 카카오 API 원본 카테고리
        private String categoryGroupCode;
        private String categoryGroupName;
        private String categoryName;

        // 주소
        private String address;
        private String roadAddress;

        // 좌표
        private Double latitude;
        private Double longitude;

        // 거리 및 도보 시간
        private Integer distance;
        private Integer walkingMinutes;

        // 기준 위치명
        private String stationName;

        // 기타 정보
        private String phone;
        private String placeUrl;
    }
}