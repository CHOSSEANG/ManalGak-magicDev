package com.magicdev.manalgak.domain.external.weather.client;

import com.magicdev.manalgak.common.exception.ExternalApiException;
import com.magicdev.manalgak.domain.external.weather.dto.OpenWeatherResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Component
@Slf4j
public class WeatherClient {

    private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(5);

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String apiUrl;

    @Autowired
    public WeatherClient(RestTemplateBuilder restTemplateBuilder,
                         @Value("${api.weather.key}") String apiKey,
                         @Value("${api.weather.url:https://api.openweathermap.org/data/2.5}") String apiUrl) {
        this(restTemplateBuilder
                .setConnectTimeout(DEFAULT_TIMEOUT)
                .setReadTimeout(DEFAULT_TIMEOUT)
                .build(), apiKey, apiUrl);
    }

    WeatherClient(RestTemplate restTemplate, String apiKey, String apiUrl) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }

    public OpenWeatherResponse getCurrentWeather(String city) {
        String url = buildWeatherUrl(city);

        try {
            log.debug("Calling OpenWeatherMap API: weather, URL: {}", url);
            ResponseEntity<OpenWeatherResponse> response =
                    restTemplate.getForEntity(URI.create(url), OpenWeatherResponse.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                OpenWeatherResponse body = response.getBody();
                log.debug("OpenWeatherMap API response received: {}", body);
                return body;
            }
            throw new ExternalApiException("OpenWeatherMap API request failed");
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            log.error("OpenWeatherMap API HTTP error: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ExternalApiException("OpenWeatherMap API HTTP error: " + e.getStatusCode(), e);
        } catch (ResourceAccessException e) {
            throw new ExternalApiException("OpenWeatherMap API timeout", e);
        }
    }

    private String buildWeatherUrl(String city) {
        String encodedCity = URLEncoder.encode(city, StandardCharsets.UTF_8);
        String encodedApiKey = URLEncoder.encode(apiKey, StandardCharsets.UTF_8);

        String baseUrl = apiUrl.endsWith("/") ? apiUrl.substring(0, apiUrl.length() - 1) : apiUrl;

        return baseUrl + "/weather" +
                "?q=" + encodedCity +
                "&appid=" + encodedApiKey +
                "&units=metric" +
                "&lang=kr";
    }
}
