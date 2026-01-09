package com.magicdev.manalgak.common.cache;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Redis 캐시 무효화 서비스
 * - 데이터 변경 시 관련 캐시 삭제
 * - 패턴 매칭을 통한 일괄 삭제
 * - 트랜잭션과 함께 사용하여 데이터 일관성 유지
 *
 * 사용 시나리오:
 * 1. 참여자 추가/삭제 → 모임 관련 캐시 삭제
 * 2. 후보지 변경 → 장소/경로 캐시 삭제
 * 3. 모임 삭제 → 모든 관련 캐시 삭제
 *
 * @author Backend 3 (종태님)
 * @since 2026-01-09
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CacheInvalidationService {

    private final RedisTemplate<String, Object> redisTemplate;

    // ========== 모임 단위 무효화 ==========

    /**
     * 모임 관련 모든 캐시 삭제
     * 사용 시점: 모임 삭제, 대규모 변경 시
     *
     * @param meetingUuid 모임 UUID
     */
    public void invalidateMeetingCache(String meetingUuid) {
        String pattern = CacheKeys.meetingPattern(meetingUuid);
        int deletedCount = deleteCacheByPattern(pattern);

        log.info("🗑️ Invalidated meeting cache: {} (deleted {} keys)",
                meetingUuid, deletedCount);
    }

    // ========== 후보지 단위 무효화 ==========

    /**
     * 후보지 관련 모든 캐시 삭제
     * - 장소 캐시
     * - 경로 캐시
     * - AI 요약 캐시
     *
     * 사용 시점: 후보지 변경, 삭제 시
     *
     * @param candidateId 후보 지점 ID
     */
    public void invalidateCandidateCache(Long candidateId) {
        int totalDeleted = 0;

        // 1. 장소 캐시 삭제
        String placesPattern = CacheKeys.placesPattern(candidateId);
        totalDeleted += deleteCacheByPattern(placesPattern);

        // 2. 경로 캐시 삭제
        String routesKey = CacheKeys.routesKey(candidateId);
        if (Boolean.TRUE.equals(redisTemplate.delete(routesKey))) {
            totalDeleted++;
        }

        // 3. 장소 요약 캐시 삭제
        String summaryPattern = CacheKeys.placeSummaryPattern(candidateId);
        totalDeleted += deleteCacheByPattern(summaryPattern);

        log.info("🗑️ Invalidated candidate cache: {} (deleted {} keys)",
                candidateId, totalDeleted);
    }

    // ========== 참여자 단위 무효화 ==========

    /**
     * 참여자 관련 모든 캐시 삭제
     * - 막차 정보 캐시
     * - 경로 캐시 (참여자가 포함된)
     *
     * 사용 시점: 참여자 추가/삭제/위치 변경 시
     *
     * @param participantId 참여자 ID
     */
    public void invalidateParticipantCache(Long participantId) {
        // 막차 캐시 삭제
        String trainPattern = CacheKeys.lastTrainPattern(participantId);
        int deletedCount = deleteCacheByPattern(trainPattern);

        log.info("🗑️ Invalidated participant cache: {} (deleted {} keys)",
                participantId, deletedCount);
    }

    // ========== 도메인별 전체 무효화 ==========

    /**
     * 모든 장소 캐시 삭제
     * 사용 시점: 장소 데이터 대량 변경, 시스템 점검 시
     */
    public void invalidateAllPlaces() {
        String pattern = CacheKeys.allPlacesPattern();
        int deletedCount = deleteCacheByPattern(pattern);

        log.warn("⚠️ Invalidated ALL places cache (deleted {} keys)", deletedCount);
    }

    /**
     * 모든 경로 캐시 삭제
     * 사용 시점: 교통 정보 대량 변경, 시스템 점검 시
     */
    public void invalidateAllRoutes() {
        String pattern = CacheKeys.allRoutesPattern();
        int deletedCount = deleteCacheByPattern(pattern);

        log.warn("⚠️ Invalidated ALL routes cache (deleted {} keys)", deletedCount);
    }

    /**
     * 모든 AI 요약 캐시 삭제
     * 사용 시점: AI 프롬프트 변경, 시스템 점검 시
     */
    public void invalidateAllSummaries() {
        String pattern = CacheKeys.allSummaryPattern();
        int deletedCount = deleteCacheByPattern(pattern);

        log.warn("⚠️ Invalidated ALL summary cache (deleted {} keys)", deletedCount);
    }

    /**
     * 모든 막차 캐시 삭제
     * 사용 시점: 막차 시간표 변경, 시스템 점검 시
     */
    public void invalidateAllTrains() {
        String pattern = CacheKeys.allTrainPattern();
        int deletedCount = deleteCacheByPattern(pattern);

        log.warn("⚠️ Invalidated ALL train cache (deleted {} keys)", deletedCount);
    }

    // ========== 특정 키 삭제 ==========

    /**
     * 특정 캐시 키 삭제
     *
     * @param key 캐시 키
     * @return 삭제 성공 여부
     */
    public boolean invalidateKey(String key) {
        try {
            Boolean deleted = redisTemplate.delete(key);
            if (Boolean.TRUE.equals(deleted)) {
                log.debug("🗑️ Deleted cache key: {}", key);
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("Failed to delete cache key: {}", key, e);
            return false;
        }
    }

    // ========== 전체 캐시 삭제 (개발용) ==========

    /**
     * 모든 캐시 삭제 (개발 환경 전용)
     * ⚠️ 주의: 운영 환경에서는 절대 사용하지 말 것!
     */
    public void flushAll() {
        try {
            redisTemplate.getConnectionFactory()
                    .getConnection()
                    .flushAll();

            log.warn("⚠️⚠️⚠️ FLUSHED ALL CACHE! This should ONLY be used in development! ⚠️⚠️⚠️");
        } catch (Exception e) {
            log.error("Failed to flush all cache", e);
            throw new RuntimeException("Failed to flush all cache", e);
        }
    }

    // ========== 내부 유틸리티 메서드 ==========

    /**
     * 패턴에 맞는 모든 캐시 키 삭제
     *
     * @param pattern 키 패턴 (예: places:candidate:123:*)
     * @return 삭제된 키 개수
     */
    private int deleteCacheByPattern(String pattern) {
        try {
            Set<String> keys = redisTemplate.keys(pattern);

            if (keys == null || keys.isEmpty()) {
                log.debug("No cache keys found for pattern: {}", pattern);
                return 0;
            }

            Long deletedCount = redisTemplate.delete(keys);
            int count = deletedCount != null ? deletedCount.intValue() : 0;

            log.debug("Deleted {} cache keys with pattern: {}", count, pattern);
            return count;

        } catch (Exception e) {
            log.error("Failed to delete cache by pattern: {}", pattern, e);
            return 0;
        }
    }

    /**
     * 캐시 통계 조회 (디버깅용)
     *
     * @param pattern 키 패턴
     * @return 해당 패턴의 키 개수
     */
    public int countKeysByPattern(String pattern) {
        try {
            Set<String> keys = redisTemplate.keys(pattern);
            return keys != null ? keys.size() : 0;
        } catch (Exception e) {
            log.error("Failed to count keys by pattern: {}", pattern, e);
            return 0;
        }
    }

    /**
     * 특정 키가 존재하는지 확인
     *
     * @param key 캐시 키
     * @return 존재 여부
     */
    public boolean exists(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.error("Failed to check key existence: {}", key, e);
            return false;
        }
    }
}