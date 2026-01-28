package com.magicdev.manalgak.domain.external.weather.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.external.weather.dto.WeatherResponse;
import com.magicdev.manalgak.domain.external.weather.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/weather")
@RequiredArgsConstructor
@Tag(name = "Weather", description = "날씨 API")
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/seoul")
    @Operation(summary = "서울 현재 날씨 조회", description = "서울의 현재 날씨 정보를 조회합니다.")
    public CommonResponse<WeatherResponse> getSeoulWeather() {
        return CommonResponse.success(weatherService.getWeather("Seoul"));
    }
}
