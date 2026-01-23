package com.magicdev.manalgak.domain.place.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceSelectRequest {
    private String placeId;
    private String placeName;
    private String category;
    private String categoryGroupCode;
    private String categoryGroupName;
    private String address;
    private String roadAddress;
    private Double latitude;
    private Double longitude;
    private Integer distance;
    private Integer walkingMinutes;
    private String phone;
    private String placeUrl;
}