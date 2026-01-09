package com.magicdev.manalgak.domain.place.service;

import com.magicdev.manalgak.common.cache.CacheKeys;
import com.magicdev.manalgak.common.cache.CacheTTL;
import com.magicdev.manalgak.domain.place.dto.PlaceResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlaceService {

    private final RedisTemplate<String, Object> redisTemplate;

    public PlaceResponse getRecommendedPlaces(Long candidateId, String purpose, int limit) {
        String cacheKey = CacheKeys.placesKey(candidateId, purpose, limit);

        PlaceResponse cached = getCachedPlaces(cacheKey);
        if (cached != null) {
            log.info("Cache HIT: {}", cacheKey);
            cached.setFromCache(true);
            return cached;
        }

        log.info("Cache MISS: {}, calling Kakao API", cacheKey);
        PlaceResponse response = callKakaoApi(candidateId, purpose, limit);
        response.setFromCache(false);

        savePlacesToCache(cacheKey, response);

        return response;
    }

    private PlaceResponse getCachedPlaces(String cacheKey) {
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            return cached != null ? (PlaceResponse) cached : null;
        } catch (Exception e) {
            log.warn("Failed to get from cache: {}", e.getMessage());
            return null;
        }
    }

    private PlaceResponse callKakaoApi(Long candidateId, String purpose, int limit) {
        List<PlaceResponse.Place> places = generateDummyPlaces(purpose, limit);

        return PlaceResponse.builder()
                .places(places)
                .totalCount(places.size())
                .build();
    }

    private void savePlacesToCache(String cacheKey, PlaceResponse response) {
        try {
            redisTemplate.opsForValue().set(
                    cacheKey,
                    response,
                    CacheTTL.PLACES
            );
            log.info("Saved to cache: {}", cacheKey);
        } catch (Exception e) {
            log.error("Failed to save to cache: {}", e.getMessage());
        }
    }

    private List<PlaceResponse.Place> generateDummyPlaces(String purpose, int limit) {
        String category = getCategory(purpose);

        return IntStream.range(0, limit)
                .mapToObj(i -> PlaceResponse.Place.builder()
                        .placeName(String.format("%s 장소 %d", category, i + 1))
                        .categoryName(category)
                        .address(String.format("서울시 마포구 합정동 %d로 %d", 100 + i, i + 1))
                        .latitude(37.5547 + (i * 0.001))
                        .longitude(126.9707 + (i * 0.001))
                        .distance(300 + i * 100)
                        .rating(4.0 + (i * 0.2))
                        .build())
                .collect(Collectors.toList());
    }

    private String getCategory(String purpose) {
        if ("DINING".equals(purpose)) {
            return "식당";
        } else if ("CAFE".equals(purpose)) {
            return "카페";
        } else {
            return "기타";
        }
    }
}
