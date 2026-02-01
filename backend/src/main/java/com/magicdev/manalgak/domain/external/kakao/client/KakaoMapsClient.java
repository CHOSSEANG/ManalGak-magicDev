package com.magicdev.manalgak.domain.external.kakao.client;

import com.magicdev.manalgak.domain.external.kakao.dto.KakaoDirectionsRequest;
import com.magicdev.manalgak.domain.external.kakao.dto.KakaoDirectionsResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Component
public class KakaoMapsClient {

    private final String kakaoApiKey;
    private final String kakaoMapsUrl;
    private final RestTemplate restTemplate;

    public KakaoMapsClient(
            @Value("${api.kakao.key}") String kakaoApiKey,
            @Value("${api.kakao.maps-url}") String kakaoMapsUrl,
            RestTemplate restTemplate
    ) {
        this.kakaoApiKey = kakaoApiKey;
        this.kakaoMapsUrl = kakaoMapsUrl;
        this.restTemplate = restTemplate;
    }

    public KakaoDirectionsResponse getDirections(KakaoDirectionsRequest request) {
        String url = UriComponentsBuilder
                .fromHttpUrl(kakaoMapsUrl + "/v1/directions")
                .queryParam("origin", request.getOrigin())
                .queryParam("destination", request.getDestination())
                .queryParam("priority", request.getPriority() != null ? request.getPriority() : "RECOMMEND")
                .build()
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            log.debug("카카오 모빌리티 API 호출: {}", url);

            ResponseEntity<KakaoDirectionsResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    KakaoDirectionsResponse.class
            );

            KakaoDirectionsResponse body = response.getBody();

            if (body != null && body.isSuccess()) {
                log.info("카카오 모빌리티 성공: {}분, {}m",
                        body.getDurationInMinutes(),
                        body.getDistanceInMeters());
            }

            return body;

        } catch (Exception e) {
            log.error("카카오 모빌리티 API 호출 실패: {}", e.getMessage());
            return null;
        }
    }
}
