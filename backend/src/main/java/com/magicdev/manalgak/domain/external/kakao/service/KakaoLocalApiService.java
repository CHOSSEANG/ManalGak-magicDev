package com.magicdev.manalgak.domain.external.kakao.service;

import com.magicdev.manalgak.domain.external.kakao.dto.KakaoPlaceSearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoLocalApiService {

    private final RestTemplate restTemplate;

    @Value("${api.kakao.key}")
    private String kakaoApiKey;

    private static final String KAKAO_CATEGORY_API_URL =
            "https://dapi.kakao.com/v2/local/search/category.json";

    /**
     * 카테고리로 장소 검색
     * @param categoryCode 카테고리 코드 (FD6, CE7, CT1, AT4)
     * @param longitude 경도 (x)
     * @param latitude 위도 (y)
     * @param radius 반경 (m)
     * @param size 결과 개수
     */
    public KakaoPlaceSearchResponse searchByCategory(
            String categoryCode,
            Double longitude,
            Double latitude,
            Integer radius,
            Integer size
    ) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromHttpUrl(KAKAO_CATEGORY_API_URL)
                .queryParam("category_group_code", categoryCode)
                .queryParam("x", longitude)
                .queryParam("y", latitude)
                .queryParam("radius", radius)
                .queryParam("sort", "accuracy")
                .queryParam("size", size);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<KakaoPlaceSearchResponse> response =
                    restTemplate.exchange(
                            builder.toUriString(),
                            HttpMethod.GET,
                            entity,
                            KakaoPlaceSearchResponse.class
                    );

            log.info("카카오 API 호출 성공: {}개 결과",
                    response.getBody().getDocuments().size());

            return response.getBody();
        } catch (Exception e) {
            log.error("카카오 API 호출 실패: {}", e.getMessage());
            throw new RuntimeException("카카오 API 호출 실패", e);
        }
    }
}
