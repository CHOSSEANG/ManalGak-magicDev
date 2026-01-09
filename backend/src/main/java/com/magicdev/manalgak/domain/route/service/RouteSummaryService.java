package com.magicdev.manalgak.domain.route.service;

import com.magicdev.manalgak.common.cache.CacheKeys;
import com.magicdev.manalgak.common.cache.CacheTTL;
import com.magicdev.manalgak.domain.route.dto.RouteSummaryRequest;
import com.magicdev.manalgak.domain.route.dto.RouteSummaryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteSummaryService {

    private final RedisTemplate<String, Object> redisTemplate;

    public RouteSummaryResponse summarizeRoutes(RouteSummaryRequest request) {
        String routeHash = generateHash(request);
        String cacheKey = CacheKeys.routeSummaryKey(routeHash);

        log.debug("Cache key: {}", cacheKey);

        RouteSummaryResponse cached = getCachedSummary(cacheKey);
        if (cached != null) {
            log.info("Cache HIT: {}", cacheKey);
            cached.setFromCache(true);
            return cached;
        }

        log.info("Cache MISS: {}, calling AI API", cacheKey);
        RouteSummaryResponse response = callAiApi(request);
        response.setFromCache(false);

        saveSummaryToCache(cacheKey, response);

        return response;
    }

    private RouteSummaryResponse getCachedSummary(String cacheKey) {
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return (RouteSummaryResponse) cached;
            }
        } catch (Exception e) {
            log.warn("Failed to get from cache: {}", e.getMessage());
        }
        return null;
    }

    private RouteSummaryResponse callAiApi(RouteSummaryRequest request) {
        String summary = generateSummary(request);
        String tips = generateTips(request);

        return RouteSummaryResponse.builder()
                .summary(summary)
                .tips(tips)
                .generatedAt(LocalDateTime.now())
                .build();
    }

    private void saveSummaryToCache(String cacheKey, RouteSummaryResponse response) {
        try {
            redisTemplate.opsForValue().set(
                    cacheKey,
                    response,
                    CacheTTL.AI_ROUTE_SUMMARY
            );
            log.info("Saved to cache: {}", cacheKey);
        } catch (Exception e) {
            log.error("Failed to save to cache: {}", e.getMessage());
        }
    }

    private String generateHash(RouteSummaryRequest request) {
        try {
            String json = request.getRoutes().toString();
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(json.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(digest);
        } catch (Exception e) {
            log.error("Failed to generate hash", e);
            return UUID.randomUUID().toString();
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    private String generateSummary(RouteSummaryRequest request) {
        StringBuilder sb = new StringBuilder();
        sb.append("참여자별 이동 정보 요약입니다.\n\n");

        for (RouteSummaryRequest.RouteInfo route : request.getRoutes()) {
            sb.append(String.format("- %s: %s (%d분, 환승 %d회)\n",
                    route.getParticipantName(),
                    route.getTransportType(),
                    route.getTravelTime(),
                    route.getTransferCount()
            ));
        }

        int avgTime = request.getRoutes().stream()
                .mapToInt(RouteSummaryRequest.RouteInfo::getTravelTime)
                .sum() / request.getRoutes().size();

        sb.append(String.format("\n평균 이동시간은 약 %d분입니다.", avgTime));

        return sb.toString();
    }

    private String generateTips(RouteSummaryRequest request) {
        int maxTime = request.getRoutes().stream()
                .mapToInt(RouteSummaryRequest.RouteInfo::getTravelTime)
                .max()
                .orElse(0);

        if (maxTime > 60) {
            return "이동 시간이 긴 분들은 출발 시간을 여유있게 잡으세요!";
        } else if (hasMultipleTransfers(request)) {
            return "환승이 많으니 환승 시간을 충분히 고려하세요!";
        } else {
            return "모두 30분 내로 도착 가능하니 편하게 오세요!";
        }
    }

    private boolean hasMultipleTransfers(RouteSummaryRequest request) {
        return request.getRoutes().stream()
                .anyMatch(r -> r.getTransferCount() >= 2);
    }
}
