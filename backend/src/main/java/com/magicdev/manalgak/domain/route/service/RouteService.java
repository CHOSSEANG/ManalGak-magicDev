package com.magicdev.manalgak.domain.route.service;

import com.magicdev.manalgak.common.cache.CacheKeys;
import com.magicdev.manalgak.common.cache.CacheTTL;
import com.magicdev.manalgak.domain.route.dto.RouteResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

    private final RedisTemplate<String, Object> redisTemplate;

    public RouteResponse getRoutes(String meetingUuid, Long candidateId) {
        String cacheKey = CacheKeys.routesKey(candidateId);

        RouteResponse cached = getCachedRoutes(cacheKey);
        if (cached != null) {
            log.info("Cache HIT: {}", cacheKey);
            return cached;
        }

        log.info("Cache MISS: {}, calling ODsay API", cacheKey);
        RouteResponse response = callOdsayApi(meetingUuid, candidateId);

        saveRoutesToCache(cacheKey, response);

        return response;
    }

    private RouteResponse getCachedRoutes(String cacheKey) {
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            return cached != null ? (RouteResponse) cached : null;
        } catch (Exception e) {
            log.warn("Failed to get from cache: {}", e.getMessage());
            return null;
        }
    }

    private RouteResponse callOdsayApi(String meetingUuid, Long candidateId) {
        List<RouteResponse.RouteInfo> routes = generateDummyRoutes();
        RouteResponse.RouteStatistics statistics = calculateStatistics(routes);

        return RouteResponse.builder()
                .routes(routes)
                .statistics(statistics)
                .build();
    }

    private void saveRoutesToCache(String cacheKey, RouteResponse response) {
        try {
            redisTemplate.opsForValue().set(
                    cacheKey,
                    response,
                    CacheTTL.ROUTES
            );
            log.info("Saved to cache: {}", cacheKey);
        } catch (Exception e) {
            log.error("Failed to save to cache: {}", e.getMessage());
        }
    }

    private List<RouteResponse.RouteInfo> generateDummyRoutes() {
        return List.of(
                RouteResponse.RouteInfo.builder()
                        .participantName("홍길동")
                        .path("역A → 역B → 역C")
                        .travelTime(45)
                        .transferCount(2)
                        .transportType("지하철 2호선")
                        .build(),
                RouteResponse.RouteInfo.builder()
                        .participantName("김철수")
                        .path("역D → 역B")
                        .travelTime(30)
                        .transferCount(1)
                        .transportType("지하철 3호선")
                        .build(),
                RouteResponse.RouteInfo.builder()
                        .participantName("이영희")
                        .path("버스정류장E → 역B")
                        .travelTime(50)
                        .transferCount(3)
                        .transportType("버스+지하철")
                        .build()
        );
    }

    private RouteResponse.RouteStatistics calculateStatistics(List<RouteResponse.RouteInfo> routes) {
        if (routes.isEmpty()) {
            return RouteResponse.RouteStatistics.builder().build();
        }

        int avgTime = (int) routes.stream()
                .mapToInt(RouteResponse.RouteInfo::getTravelTime)
                .average()
                .orElse(0);

        int maxTime = routes.stream()
                .mapToInt(RouteResponse.RouteInfo::getTravelTime)
                .max()
                .orElse(0);

        int minTime = routes.stream()
                .mapToInt(RouteResponse.RouteInfo::getTravelTime)
                .min()
                .orElse(0);

        int totalTransfers = routes.stream()
                .mapToInt(RouteResponse.RouteInfo::getTransferCount)
                .sum();

        Map<String, Long> transportCounts = routes.stream()
                .collect(Collectors.groupingBy(
                        RouteResponse.RouteInfo::getTransportType,
                        Collectors.counting()
                ));

        String mostFrequentTransport = transportCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("");

        return RouteResponse.RouteStatistics.builder()
                .averageTravelTime(avgTime)
                .maxTravelTime(maxTime)
                .minTravelTime(minTime)
                .totalTransfers(totalTransfers)
                .mostFrequentTransport(mostFrequentTransport)
                .build();
    }
}
