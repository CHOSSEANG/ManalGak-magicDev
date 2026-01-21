package com.magicdev.manalgak.domain.geocoding.service;

import com.magicdev.manalgak.domain.geocoding.dto.GeoPoint;
import com.magicdev.manalgak.domain.geocoding.dto.KakaoGeoResponse;
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

import java.net.URI;

@Slf4j
@Service
public class GeocodingServiceImpl implements GeocodingService {

    private final String kakaoApiKey;
    private final String kakaoAddressUrl;
    private final RestTemplate restTemplate;

    public GeocodingServiceImpl(
            @Value("${api.kakao.key}") String kakaoApiKey,
            @Value("${api.kakao.address-url}") String kakaoAddressUrl, RestTemplate restTemplate

    ) {
        this.kakaoApiKey = kakaoApiKey;
        this.kakaoAddressUrl = kakaoAddressUrl;
        this.restTemplate = restTemplate;
    }

    @Override
    public GeoPoint geocode(String address) {

        URI url = UriComponentsBuilder
                .fromHttpUrl(kakaoAddressUrl)
                .queryParam("query", address)
                .build()
                .encode()  // 한번만 인코딩
                .toUri();


        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<KakaoGeoResponse> response =
                    restTemplate.exchange(url, HttpMethod.GET, entity, KakaoGeoResponse.class);

            KakaoGeoResponse responseBody = response.getBody();
            if (responseBody == null || responseBody.getDocuments().isEmpty()) {
                log.warn("주소 검색 결과 없음: {}", address);
                return null;
            }

            KakaoGeoResponse.Document doc = responseBody.getDocuments().get(0);
            GeoPoint geoPoint = new GeoPoint(
                    Double.parseDouble(doc.getY()),
                    Double.parseDouble(doc.getX())
            );

            log.info("Geocoding 성공: {} -> ({}, {})", address, geoPoint.getLatitude(), geoPoint.getLongitude());
            return geoPoint;

        } catch (Exception e) {
            log.error("Geocoding 실패: {}", address, e);
            return null;
        }
    }
}