package com.magicdev.manalgak.domain.place.service;

import com.magicdev.manalgak.common.cache.CacheKeys;
import com.magicdev.manalgak.common.cache.CacheTTL;
import com.magicdev.manalgak.domain.place.dto.PlaceSummaryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlaceSummaryService {

    private final RedisTemplate<String, Object> redisTemplate;

    public PlaceSummaryResponse summarizePlaces(Long candidateId, String tone) {
        String cacheKey = CacheKeys.placeSummaryKey(candidateId, tone);
        log.debug("Cache key: {}", cacheKey);

        PlaceSummaryResponse cached = getCachedSummary(cacheKey);
        if (cached != null) {
            log.info("Cache HIT: {}", cacheKey);
            cached.setFromCache(true);
            return cached;
        }

        log.info("Cache MISS: {}, calling AI API", cacheKey);
        PlaceSummaryResponse response = callAiApi(candidateId, tone);
        response.setFromCache(false);

        saveSummaryToCache(cacheKey, response);

        return response;
    }

    private PlaceSummaryResponse getCachedSummary(String cacheKey) {
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            return cached != null ? (PlaceSummaryResponse) cached : null;
        } catch (Exception e) {
            log.warn("Failed to get from cache: {}", e.getMessage());
            return null;
        }
    }

    private PlaceSummaryResponse callAiApi(Long candidateId, String tone) {
        String summary = generateSummary(candidateId, tone);
        List<PlaceSummaryResponse.PlaceRecommendation> recommendations = generateRecommendations(candidateId);

        return PlaceSummaryResponse.builder()
                .summary(summary)
                .recommendations(recommendations)
                .totalPlaces(recommendations.size())
                .generatedAt(LocalDateTime.now())
                .build();
    }

    private void saveSummaryToCache(String cacheKey, PlaceSummaryResponse response) {
        try {
            redisTemplate.opsForValue().set(
                    cacheKey,
                    response,
                    CacheTTL.AI_PLACE_SUMMARY
            );
            log.info("Saved to cache: {}", cacheKey);
        } catch (Exception e) {
            log.error("Failed to save to cache: {}", e.getMessage());
        }
    }

    private String generateSummary(Long candidateId, String tone) {
        String toneInstruction = getToneInstruction(tone);
        StringBuilder sb = new StringBuilder(toneInstruction);
        sb.append("\n\n");
        sb.append(String.format("후보지 ID %d에 대한 추천 장소 요약입니다.\n", candidateId));
        sb.append("상위 3개 장소를 추천합니다.\n");
        sb.append("카톡으로 공유하기 좋게 작성했습니다.");
        return sb.toString();
    }

    private String getToneInstruction(String tone) {
        if ("professional".equals(tone)) {
            return "전문적이고 격식있는 말투로 장소를 추천합니다.";
        } else if ("casual".equals(tone)) {
            return "편하고 일상적인 말투로 장소를 추천합니다.";
        } else {
            return "친근하고 따뜻한 말투로 장소를 추천합니다.";
        }
    }

    private List<PlaceSummaryResponse.PlaceRecommendation> generateRecommendations(Long candidateId) {
        return IntStream.range(0, 3)
                .mapToObj(i -> PlaceSummaryResponse.PlaceRecommendation.builder()
                        .placeName(String.format("테스트 장소 %d", i + 1))
                        .categoryName("식당")
                        .distance(500 + i * 100)
                        .rating(4.0 + (i * 0.3))
                        .build())
                .collect(Collectors.toList());
    }
}
