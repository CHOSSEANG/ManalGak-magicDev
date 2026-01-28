package com.magicdev.manalgak.domain.external.weather.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WeatherResponse {

    private String city;
    private Double temperature;
    private String description;
    private String iconUrl;
}
