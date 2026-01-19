package com.magicdev.manalgak.common.cache;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Redis 캐시 통계 및 관리 API (Admin 전용)
 * - 캐시 통계 조회
 * - 캐시 무효화 (개발/디버깅용)
 * - 캐시 모니터링
 *
 * ⚠️ 주의: 이 API는 관리자 전용이므로 운영 환경에서는 접근 제한 필요
 *
 * @author Backend 3 (종태님)
 * @since 2026-01-09
 */
@RestController
@RequestMapping("/v1/admin/cache")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Cache Admin", description = "캐시 관리 API (Admin 전용)")
public class CacheStatsController {

    private final RedisTemplate<String, Object> redisTemplate;
    private final CacheInvalidationService cacheInvalidationService;

    // ========== 캐시 통계 조회 ==========

    /**
     * 전체 캐시 통계 조회
     *
     * GET /api/v1/admin/cache/stats
     *
     * @return 캐시 통계 정보
     */
    @GetMapping("/stats")
    @Operation(
            summary = "캐시 통계 조회",
            description = "Redis에 저장된 모든 캐시의 통계 정보를 조회합니다."
    )
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            // 전체 키 개수 (DBSIZE 사용 - 안전하고 빠름)
            long totalKeys = redisTemplate.getConnectionFactory()
                    .getConnection()
                    .dbSize();

            // 도메인별 키 개수 (SCAN 사용)
            int placesCount = cacheInvalidationService.countKeysByPattern(CacheKeys.allPlacesPattern());
            int routesCount = cacheInvalidationService.countKeysByPattern(CacheKeys.allRoutesPattern());
            int summaryCount = cacheInvalidationService.countKeysByPattern(CacheKeys.allSummaryPattern());
            int trainCount = cacheInvalidationService.countKeysByPattern(CacheKeys.allTrainPattern());

            stats.put("totalKeys", totalKeys);
            stats.put("cacheByDomain", Map.of(
                    "places", placesCount,
                    "routes", routesCount,
                    "summary", summaryCount,
                    "train", trainCount
            ));

            // 캐시 히트율 계산 (간단한 버전)
            stats.put("message", "Cache statistics retrieved successfully");

            log.info("📊 Cache stats requested - Total keys: {}", totalKeys);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            log.error("Failed to get cache stats", e);
            stats.put("error", "Failed to retrieve cache statistics");
            return ResponseEntity.internalServerError().body(stats);
        }
    }

    /**
     * 특정 도메인의 캐시 통계 조회
     *
     * GET /api/v1/admin/cache/stats/{domain}
     *
     * @param domain 도메인 (places, routes, summary, train)
     * @return 해당 도메인의 캐시 통계
     */
    @GetMapping("/stats/{domain}")
    @Operation(
            summary = "도메인별 캐시 통계",
            description = "특정 도메인(places, routes 등)의 캐시 통계를 조회합니다."
    )
    public ResponseEntity<Map<String, Object>> getDomainCacheStats(
            @PathVariable String domain
    ) {
        Map<String, Object> stats = new HashMap<>();

        try {
            String pattern = domain + ":*";

            // SCAN 사용하여 키 조회
            List<String> keys = new ArrayList<>();
            ScanOptions options = ScanOptions.scanOptions()
                    .match(pattern)
                    .count(100)
                    .build();

            Cursor<byte[]> cursor = redisTemplate.getConnectionFactory()
                    .getConnection()
                    .scan(options);

            while (cursor.hasNext() && keys.size() < 10) {  // 최대 10개만 샘플로
                keys.add(new String(cursor.next()));
            }

            // 전체 개수 세기
            int totalCount = keys.size();
            while (cursor.hasNext()) {
                cursor.next();
                totalCount++;
            }

            cursor.close();

            stats.put("domain", domain);
            stats.put("keyCount", totalCount);
            stats.put("pattern", pattern);

            if (!keys.isEmpty()) {
                // 처음 10개 키만 샘플로 보여주기
                stats.put("sampleKeys", keys);
            }

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            log.error("Failed to get domain cache stats: {}", domain, e);
            stats.put("error", "Failed to retrieve domain cache statistics");
            return ResponseEntity.internalServerError().body(stats);
        }
    }

    // ========== 캐시 무효화 API ==========

    /**
     * 전체 캐시 삭제 (개발 환경 전용)
     *
     * DELETE /api/v1/admin/cache/flush
     *
     * ⚠️ 위험: 모든 캐시가 삭제됩니다!
     */
    @DeleteMapping("/flush")
    @Operation(
            summary = "전체 캐시 삭제",
            description = "⚠️ 위험: Redis의 모든 캐시를 삭제합니다. 개발 환경에서만 사용하세요!"
    )
    public ResponseEntity<Map<String, String>> flushAllCache() {
        try {
            cacheInvalidationService.flushAll();

            log.warn("⚠️ ALL CACHE FLUSHED by admin API");

            return ResponseEntity.ok(Map.of(
                    "message", "All cache flushed successfully",
                    "warning", "This operation should only be used in development!"
            ));

        } catch (Exception e) {
            log.error("Failed to flush cache", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Failed to flush cache",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * 특정 도메인의 캐시 삭제
     *
     * DELETE /api/v1/admin/cache/{domain}
     *
     * @param domain 도메인 (places, routes, summary, train)
     */
    @DeleteMapping("/{domain}")
    @Operation(
            summary = "도메인별 캐시 삭제",
            description = "특정 도메인의 모든 캐시를 삭제합니다."
    )
    public ResponseEntity<Map<String, Object>> invalidateDomainCache(
            @PathVariable String domain
    ) {
        try {
            switch (domain.toLowerCase()) {
                case "places":
                    cacheInvalidationService.invalidateAllPlaces();
                    break;
                case "routes":
                    cacheInvalidationService.invalidateAllRoutes();
                    break;
                case "summary":
                    cacheInvalidationService.invalidateAllSummaries();
                    break;
                case "train":
                    cacheInvalidationService.invalidateAllTrains();
                    break;
                default:
                    return ResponseEntity.badRequest().body(Map.of(
                            "error", "Invalid domain",
                            "message", "Valid domains: places, routes, summary, train"
                    ));
            }

            // 삭제 후 남은 키 개수 확인
            int remainingCount = 0;
            switch (domain.toLowerCase()) {
                case "places":
                    remainingCount = cacheInvalidationService.countKeysByPattern(CacheKeys.allPlacesPattern());
                    break;
                case "routes":
                    remainingCount = cacheInvalidationService.countKeysByPattern(CacheKeys.allRoutesPattern());
                    break;
                case "summary":
                    remainingCount = cacheInvalidationService.countKeysByPattern(CacheKeys.allSummaryPattern());
                    break;
                case "train":
                    remainingCount = cacheInvalidationService.countKeysByPattern(CacheKeys.allTrainPattern());
                    break;
            }

            log.info("🗑️ Invalidated {} cache - remaining keys: {}", domain, remainingCount);

            return ResponseEntity.ok(Map.of(
                    "message", "Cache invalidated successfully",
                    "domain", domain,
                    "remainingKeys", remainingCount
            ));

        } catch (Exception e) {
            log.error("Failed to invalidate domain cache: {}", domain, e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Failed to invalidate cache",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * 특정 모임의 캐시 삭제
     *
     * DELETE /api/v1/admin/cache/meeting/{meetingUuid}
     *
     * @param meetingUuid 모임 UUID
     */
    @DeleteMapping("/meeting/{meetingUuid}")
    @Operation(
            summary = "모임 캐시 삭제",
            description = "특정 모임과 관련된 모든 캐시를 삭제합니다."
    )
    public ResponseEntity<Map<String, Object>> invalidateMeetingCache(
            @PathVariable String meetingUuid
    ) {
        try {
            cacheInvalidationService.invalidateMeetingCache(meetingUuid);

            return ResponseEntity.ok(Map.of(
                    "message", "Meeting cache invalidated successfully",
                    "meetingUuid", meetingUuid
            ));

        } catch (Exception e) {
            log.error("Failed to invalidate meeting cache: {}", meetingUuid, e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Failed to invalidate meeting cache",
                    "message", e.getMessage()
            ));
        }
    }

    /**
     * 특정 후보지의 캐시 삭제
     *
     * DELETE /api/v1/admin/cache/candidate/{candidateId}
     *
     * @param candidateId 후보 지점 ID
     */
    @DeleteMapping("/candidate/{candidateId}")
    @Operation(
            summary = "후보지 캐시 삭제",
            description = "특정 후보지와 관련된 모든 캐시를 삭제합니다."
    )
    public ResponseEntity<Map<String, Object>> invalidateCandidateCache(
            @PathVariable Long candidateId
    ) {
        try {
            cacheInvalidationService.invalidateCandidateCache(candidateId);

            return ResponseEntity.ok(Map.of(
                    "message", "Candidate cache invalidated successfully",
                    "candidateId", candidateId
            ));

        } catch (Exception e) {
            log.error("Failed to invalidate candidate cache: {}", candidateId, e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", "Failed to invalidate candidate cache",
                    "message", e.getMessage()
            ));
        }
    }

    // ========== 헬스체크 ==========

    /**
     * Redis 연결 상태 확인
     *
     * GET /api/v1/admin/cache/health
     */
    @GetMapping("/health")
    @Operation(
            summary = "Redis 헬스체크",
            description = "Redis 서버 연결 상태를 확인합니다."
    )
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();

        try {
            // PING 테스트
            String pong = redisTemplate.getConnectionFactory()
                    .getConnection()
                    .ping();

            health.put("status", "UP");
            health.put("redis", "Connected");
            health.put("ping", pong);

            return ResponseEntity.ok(health);

        } catch (Exception e) {
            log.error("Redis health check failed", e);
            health.put("status", "DOWN");
            health.put("redis", "Disconnected");
            health.put("error", e.getMessage());

            return ResponseEntity.status(503).body(health);
        }
    }

}