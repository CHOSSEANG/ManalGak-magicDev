package com.magicdev.manalgak.common.cache;

import java.time.Duration;

/**
 * Redis 캐시 TTL (Time To Live) 상수 클래스
 * - 각 API별로 적절한 캐시 유효 기간 정의
 * - Duration 타입 사용으로 가독성 향상
 *
 * TTL 설정 기준:
 * - 데이터 변경 빈도
 * - 실시간성 요구도
 * - API 호출 비용
 *
 * @author Backend 3 (종태님)
 * @since 2026-01-09
 */
public class CacheTTL {

    // ========== API #1: 장소 추천 ==========

    /**
     * 장소 목록 캐시 TTL: 1시간
     *
     * 이유:
     * - 장소 정보는 자주 변경되지 않음
     * - Kakao API 호출 횟수 절감 필요
     * - 하루에 한두 번 갱신으로 충분
     */
    public static final Duration PLACES = Duration.ofHours(1);

    // ========== API #2: 경로 조회 ==========

    /**
     * 경로 정보 캐시 TTL: 30분
     *
     * 이유:
     * - 교통 상황이 시간대별로 변동 가능
     * - ODsay API 호출 비용 절감
     * - 너무 오래된 경로 정보는 부정확할 수 있음
     */
    public static final Duration ROUTES = Duration.ofMinutes(30);

    // ========== API #3: 막차 조회 ==========

    /**
     * 막차 정보 캐시 TTL: 10분
     *
     * 이유:
     * - 실시간성이 중요 (막차 시간 체크용)
     * - 자주 갱신 필요
     * - 짧은 TTL로 최신 정보 유지
     */
    public static final Duration LAST_TRAIN = Duration.ofMinutes(10);

    // ========== API #4: AI 장소 요약 ==========

    /**
     * AI 장소 요약 캐시 TTL: 24시간
     *
     * 이유:
     * - 같은 입력이면 항상 비슷한 결과
     * - OpenAI API 비용이 비쌈 (토큰당 과금)
     * - 긴 TTL로 비용 절감
     */
    public static final Duration AI_PLACE_SUMMARY = Duration.ofHours(24);

    // ========== API #5: AI 경로 요약 ==========

    /**
     * AI 경로 요약 캐시 TTL: 24시간
     *
     * 이유:
     * - 같은 경로 입력이면 같은 요약 결과
     * - OpenAI API 비용 절감
     * - 경로 자체보다는 요약 텍스트라 변경 불필요
     */
    public static final Duration AI_ROUTE_SUMMARY = Duration.ofHours(24);

    // ========== 특수 목적 TTL ==========

    /**
     * 짧은 캐시 TTL: 5분
     * 용도: 임시 데이터, 빠른 만료가 필요한 경우
     */
    public static final Duration SHORT = Duration.ofMinutes(5);

    /**
     * 중간 캐시 TTL: 1시간
     * 용도: 일반적인 데이터, 기본값
     */
    public static final Duration MEDIUM = Duration.ofHours(1);

    /**
     * 긴 캐시 TTL: 6시간
     * 용도: 거의 변경되지 않는 데이터
     */
    public static final Duration LONG = Duration.ofHours(6);

    /**
     * 매우 긴 캐시 TTL: 24시간
     * 용도: 거의 변경되지 않고 비용이 큰 데이터
     */
    public static final Duration VERY_LONG = Duration.ofDays(1);

    // ========== TTL 정보 조회 ==========

    /**
     * 특정 캐시 키의 권장 TTL 반환
     * 키 패턴을 분석해서 적절한 TTL 반환
     *
     * @param cacheKey 캐시 키
     * @return 권장 TTL
     */
    public static Duration getRecommendedTTL(String cacheKey) {
        if (cacheKey.startsWith("places:")) {
            return PLACES;
        } else if (cacheKey.startsWith("routes:")) {
            return ROUTES;
        } else if (cacheKey.startsWith("train:")) {
            return LAST_TRAIN;
        } else if (cacheKey.startsWith("summary:")) {
            return AI_PLACE_SUMMARY;  // 모든 요약은 24시간
        }
        return MEDIUM;  // 기본값
    }

    /**
     * TTL을 초 단위로 반환
     * Redis 명령어에서 사용할 수 있는 형태
     *
     * @param duration Duration 객체
     * @return 초 단위 TTL
     */
    public static long toSeconds(Duration duration) {
        return duration.getSeconds();
    }

    /**
     * TTL을 밀리초 단위로 반환
     *
     * @param duration Duration 객체
     * @return 밀리초 단위 TTL
     */
    public static long toMillis(Duration duration) {
        return duration.toMillis();
    }

    /**
     * TTL 정보를 사람이 읽기 쉬운 형태로 반환
     *
     * @param duration Duration 객체
     * @return 설명 (예: "1시간", "30분", "24시간")
     */
    public static String toHumanReadable(Duration duration) {
        long hours = duration.toHours();
        long minutes = duration.toMinutes();
        long days = duration.toDays();

        if (days > 0) {
            return days + "일";
        } else if (hours > 0) {
            return hours + "시간";
        } else if (minutes > 0) {
            return minutes + "분";
        } else {
            return duration.getSeconds() + "초";
        }
    }
}
