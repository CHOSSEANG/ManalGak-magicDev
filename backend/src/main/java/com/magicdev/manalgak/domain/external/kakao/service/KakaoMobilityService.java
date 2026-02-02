package com.magicdev.manalgak.domain.external.kakao.service;

import com.magicdev.manalgak.domain.external.kakao.dto.KakaoDirectionsResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

/**
 * 카카오 모빌리티 API 서비스
 * 출발지 → 목적지 간 도로 경로 좌표 조회
 */
@Slf4j
@Service
public class KakaoMobilityService {

    private final RestTemplate restTemplate;
    private final String kakaoApiKey;
    private final String mapsUrl;

    private static final String DIRECTIONS_PATH = "/v1/directions";

    public KakaoMobilityService(
            RestTemplate restTemplate,
            @Value("${api.kakao.key}") String kakaoApiKey,
            @Value("${api.kakao.maps-url}") String mapsUrl
    ) {
        this.restTemplate = restTemplate;
        this.kakaoApiKey = kakaoApiKey;
        this.mapsUrl = mapsUrl;
    }

    /**
     * 출발지에서 목적지까지의 도로 경로 좌표 조회
     *
     * @param originLat  출발지 위도
     * @param originLng  출발지 경도
     * @param destLat    목적지 위도
     * @param destLng    목적지 경도
     * @return 경로 좌표 리스트 [[lat, lng], [lat, lng], ...]
     */
    public List<double[]> getRouteCoordinates(
            double originLat, double originLng,
            double destLat, double destLng
    ) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);

        // 카카오 모빌리티 API는 경도,위도 순서
        String url = UriComponentsBuilder.fromHttpUrl(mapsUrl + DIRECTIONS_PATH)
                .queryParam("origin", originLng + "," + originLat)
                .queryParam("destination", destLng + "," + destLat)
                .queryParam("priority", "RECOMMEND")
                .toUriString();

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<KakaoDirectionsResponse> response =
                    restTemplate.exchange(url, HttpMethod.GET, entity, KakaoDirectionsResponse.class);

            return extractCoordinates(response.getBody());

        } catch (Exception e) {
            log.error("카카오 모빌리티 API 호출 실패: origin=({}, {}), dest=({}, {}), error={}",
                    originLat, originLng, destLat, destLng, e.getMessage());

            // 실패 시 직선 경로 반환 (fallback)
            return List.of(
                    new double[]{originLat, originLng},
                    new double[]{destLat, destLng}
            );
        }
    }

    /**
     * API 응답에서 경로 좌표 추출
     * vertexes 배열: [lng1, lat1, lng2, lat2, ...] → [[lat1, lng1], [lat2, lng2], ...]
     */
    private List<double[]> extractCoordinates(KakaoDirectionsResponse response) {
        List<double[]> coordinates = new ArrayList<>();

        if (response == null || response.getRoutes() == null || response.getRoutes().isEmpty()) {
            log.warn("카카오 모빌리티 API 응답이 비어있음");
            return coordinates;
        }

        KakaoDirectionsResponse.Route route = response.getRoutes().get(0);

        // result_code가 0이 아니면 에러
        if (route.getResult_code() != 0) {
            log.warn("카카오 모빌리티 API 에러: code={}, msg={}",
                    route.getResult_code(), route.getResult_msg());
            return coordinates;
        }

        if (route.getSections() == null) {
            return coordinates;
        }

        for (KakaoDirectionsResponse.Section section : route.getSections()) {
            if (section.getRoads() == null) continue;

            for (KakaoDirectionsResponse.Road road : section.getRoads()) {
                double[] vertexes = road.getVertexes();
                if (vertexes == null) continue;

                // vertexes: [lng1, lat1, lng2, lat2, ...]
                for (int i = 0; i < vertexes.length; i += 2) {
                    double lng = vertexes[i];
                    double lat = vertexes[i + 1];
                    coordinates.add(new double[]{lat, lng});
                }
            }
        }

        log.info("경로 좌표 추출 완료: {}개 포인트", coordinates.size());
        return coordinates;
    }
}