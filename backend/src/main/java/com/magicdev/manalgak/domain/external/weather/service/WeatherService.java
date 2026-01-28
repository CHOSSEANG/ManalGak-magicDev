package com.magicdev.manalgak.domain.external.weather.service;

import com.magicdev.manalgak.common.exception.ExternalApiException;
import com.magicdev.manalgak.domain.external.weather.client.WeatherClient;
import com.magicdev.manalgak.domain.external.weather.dto.OpenWeatherResponse;
import com.magicdev.manalgak.domain.external.weather.dto.WeatherResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherService {

    private static final String ICON_BASE_URL = "https://openweathermap.org/img/wn/";

    private final WeatherClient weatherClient;

    public WeatherResponse getWeather(String city) {
        OpenWeatherResponse response = weatherClient.getCurrentWeather(city);

        if (response == null) {
            throw new ExternalApiException("OpenWeatherMap response is null");
        }

        String description = "";
        String iconUrl = "";

        if (response.getWeather() != null && !response.getWeather().isEmpty()) {
            OpenWeatherResponse.Weather weather = response.getWeather().get(0);
            description = weather.getDescription() != null ? weather.getDescription() : "";
            if (weather.getIcon() != null) {
                iconUrl = ICON_BASE_URL + weather.getIcon() + "@2x.png";
            }
        }

        Double temperature = null;
        if (response.getMain() != null && response.getMain().getTemp() != null) {
            temperature = Math.round(response.getMain().getTemp() * 10.0) / 10.0;
        }

        return WeatherResponse.builder()
                .city(response.getName() != null ? response.getName() : city)
                .temperature(temperature)
                .description(description)
                .iconUrl(iconUrl)
                .build();
    }
}
