package com.magicdev.manalgak.domain.external.odsay.client;

import com.magicdev.manalgak.common.exception.ExternalApiException;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayRouteRequest;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayRouteResponse;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayTimeTableRequest;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayTimeTableResponse;
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
public class OdsayClient {

    private static final Duration DEFAULT_TIMEOUT = Duration.ofSeconds(5);
    private static final String API_VERSION_PATH = "/v1/api";

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String apiUrl;

    @Autowired
    public OdsayClient(RestTemplateBuilder restTemplateBuilder,
                       @Value("${api.odsay.key}") String apiKey,
                       @Value("${api.odsay.url:https://api.odsay.com}") String apiUrl) {
        this(restTemplateBuilder
                .setConnectTimeout(DEFAULT_TIMEOUT)
                .setReadTimeout(DEFAULT_TIMEOUT)
                .build(), apiKey, apiUrl);
    }

    OdsayClient(RestTemplate restTemplate, String apiKey, String apiUrl) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }

    public OdsayRouteResponse searchRoute(OdsayRouteRequest request) {
        String url = buildRouteUrl(request);

        try {
            log.debug("Calling ODsay API: searchPubTransPathT, URL: {}", url);
            // URI.create()를 사용하여 이미 인코딩된 URL을 그대로 전달 (이중 인코딩 방지)
            ResponseEntity<OdsayRouteResponse> response =
                    restTemplate.getForEntity(URI.create(url), OdsayRouteResponse.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                OdsayRouteResponse body = response.getBody();
                log.debug("ODsay API response received: {}", body);

                // ODsay API는 HTTP 200으로 응답하지만 body에 error가 있을 수 있음
                if (body != null && body.getError() != null) {
                    String errorMessage = body.getError().toString();
                    log.error("ODsay API returned error in response body: {}", errorMessage);
                    throw new ExternalApiException("ODsay API error: " + errorMessage);
                }

                return body;
            }
            throw new ExternalApiException("ODsay API request failed");
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            log.error("ODsay API HTTP error: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ExternalApiException("ODsay API HTTP error: " + e.getStatusCode(), e);
        } catch (ResourceAccessException e) {
            throw new ExternalApiException("ODsay API timeout", e);
        }
    }

    public OdsayTimeTableResponse getTimeTable(OdsayTimeTableRequest request) {
        String url = buildTimeTableUrl(request);

        try {
            log.debug("Calling ODsay API: subwayTimeTable");
            // URI.create()를 사용하여 이미 인코딩된 URL을 그대로 전달 (이중 인코딩 방지)
            ResponseEntity<OdsayTimeTableResponse> response =
                    restTemplate.getForEntity(URI.create(url), OdsayTimeTableResponse.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
            throw new ExternalApiException("ODsay timetable request failed");
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            log.error("ODsay timetable HTTP error: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new ExternalApiException("ODsay timetable HTTP error: " + e.getStatusCode(), e);
        } catch (ResourceAccessException e) {
            throw new ExternalApiException("ODsay timetable timeout", e);
        }
    }

    private String buildRouteUrl(OdsayRouteRequest request) {
        Integer opt = request.getOpt() != null ? request.getOpt() : 0;

        // URLEncoder로 API 키를 명시적으로 한 번만 인코딩 (/, + 같은 특수문자 처리)
        String encodedApiKey = URLEncoder.encode(apiKey, StandardCharsets.UTF_8);

        // URL을 직접 String으로 조립 (UriComponentsBuilder는 이중 인코딩 발생)
        return resolveApiBaseUrl() + "/searchPubTransPathT" +
                "?SX=" + request.getStartX() +
                "&SY=" + request.getStartY() +
                "&EX=" + request.getEndX() +
                "&EY=" + request.getEndY() +
                "&OPT=" + opt +
                "&apiKey=" + encodedApiKey;
    }

    private String buildTimeTableUrl(OdsayTimeTableRequest request) {
        Integer wayCode = request.getWayCode() != null ? request.getWayCode() : 1;
        Integer showOff = request.getShowOff() != null ? request.getShowOff() : 1;

        // URLEncoder로 API 키를 명시적으로 한 번만 인코딩 (/, + 같은 특수문자 처리)
        String encodedApiKey = URLEncoder.encode(apiKey, StandardCharsets.UTF_8);

        // URL을 직접 String으로 조립 (UriComponentsBuilder는 이중 인코딩 발생)
        return resolveApiBaseUrl() + "/subwayTimeTable" +
                "?stationID=" + request.getStationID() +
                "&wayCode=" + wayCode +
                "&showOff=" + showOff +
                "&apiKey=" + encodedApiKey;
    }

    private String resolveApiBaseUrl() {
        if (apiUrl == null || apiUrl.isBlank()) {
            return "https://api.odsay.com" + API_VERSION_PATH;
        }

        String trimmed = apiUrl.endsWith("/") ? apiUrl.substring(0, apiUrl.length() - 1) : apiUrl;
        if (trimmed.endsWith(API_VERSION_PATH)) {
            return trimmed;
        }
        return trimmed + API_VERSION_PATH;
    }
}
