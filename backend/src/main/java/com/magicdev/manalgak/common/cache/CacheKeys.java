package com.magicdev.manalgak.common.cache;

/**
 * Redis 캐시 키 생성 유틸리티 클래스
 * - 일관된 캐시 키 네이밍 규칙 적용
 * - 형식: {도메인}:{엔티티}:{식별자}:{추가정보}
 * - 예시: places:candidate:123:DINING:10
 *
 * @author Backend 3 (종태님)
 * @since 2026-01-09
 */
public class CacheKeys {

    // ========== API #1: 장소 추천 ==========

    /**
     * 장소 목록 캐시 키 생성
     * 형식: places:candidate:{candidateId}:{purpose}:{limit}
     *
     * @param candidateId 후보 지점 ID
     * @param purpose     모임 목적 (DINING, DATE, STUDY, GENERAL)
     * @param limit       반환할 장소 수
     * @return 캐시 키 (예: places:candidate:123:DINING:10)
     */
    public static String placesKey(Long candidateId, String purpose, int limit) {
        return String.format("places:candidate:%d:%s:%d", candidateId, purpose, limit);
    }

    /**
     * 특정 후보지의 모든 장소 캐시 패턴
     * 형식: places:candidate:{candidateId}:*
     *
     * @param candidateId 후보 지점 ID
     * @return 패턴 (예: places:candidate:123:*)
     */
    public static String placesPattern(Long candidateId) {
        return String.format("places:candidate:%d:*", candidateId);
    }

    // ========== API #2: 경로 조회 ==========

    /**
     * 경로 정보 캐시 키 생성
     * 형식: routes:candidate:{candidateId}
     *
     * @param candidateId 후보 지점 ID
     * @return 캐시 키 (예: routes:candidate:456)
     */
    public static String routesKey(Long candidateId) {
        return String.format("routes:candidate:%d", candidateId);
    }

    // ========== API #3: 막차 조회 ==========

    /**
     * 막차 정보 캐시 키 생성
     * 형식: train:participant:{participantId}:candidate:{candidateId}
     *
     * @param participantId 참여자 ID
     * @param candidateId   후보 지점 ID
     * @return 캐시 키 (예: train:participant:789:candidate:456)
     */
    public static String lastTrainKey(Long participantId, Long candidateId) {
        return String.format("train:participant:%d:candidate:%d",
                participantId, candidateId);
    }

    /**
     * 특정 참여자의 모든 막차 캐시 패턴
     * 형식: train:participant:{participantId}:*
     *
     * @param participantId 참여자 ID
     * @return 패턴 (예: train:participant:789:*)
     */
    public static String lastTrainPattern(Long participantId) {
        return String.format("train:participant:%d:*", participantId);
    }

    // ========== API #4: AI 장소 요약 ==========

    /**
     * AI 장소 요약 캐시 키 생성
     * 형식: summary:place:candidate:{candidateId}:{tone}
     *
     * @param candidateId 후보 지점 ID
     * @param tone        톤 (friendly, professional, casual)
     * @return 캐시 키 (예: summary:place:candidate:123:friendly)
     */
    public static String placeSummaryKey(Long candidateId, String tone) {
        return String.format("summary:place:candidate:%d:%s", candidateId, tone);
    }

    /**
     * 특정 후보지의 모든 장소 요약 캐시 패턴
     * 형식: summary:place:candidate:{candidateId}:*
     *
     * @param candidateId 후보 지점 ID
     * @return 패턴 (예: summary:place:candidate:123:*)
     */
    public static String placeSummaryPattern(Long candidateId) {
        return String.format("summary:place:candidate:%d:*", candidateId);
    }

    // ========== API #5: AI 경로 요약 ==========

    /**
     * AI 경로 요약 캐시 키 생성
     * 형식: summary:route:{hash}
     *
     * @param routeHash 경로 데이터의 해시값 (MD5 등)
     * @return 캐시 키 (예: summary:route:abc123def456)
     */
    public static String routeSummaryKey(String routeHash) {
        return String.format("summary:route:%s", routeHash);
    }

    // ========== 패턴 매칭용 ==========

    /**
     * 모임 관련 모든 캐시 패턴
     * 형식: *:{meetingUuid}:*
     *
     * 주의: 이 패턴은 성능에 영향을 줄 수 있으므로 주의해서 사용
     *
     * @param meetingUuid 모임 UUID
     * @return 패턴 (예: *:abc-123-def:*)
     */
    public static String meetingPattern(String meetingUuid) {
        return "*:" + meetingUuid + ":*";
    }

    /**
     * 후보지 관련 모든 캐시 패턴
     * 형식: *:candidate:{candidateId}:*
     *
     * @param candidateId 후보 지점 ID
     * @return 패턴 (예: *:candidate:123:*)
     */
    public static String candidatePattern(Long candidateId) {
        return "*:candidate:" + candidateId + ":*";
    }

    /**
     * 참여자 관련 모든 캐시 패턴
     * 형식: *:participant:{participantId}:*
     *
     * @param participantId 참여자 ID
     * @return 패턴 (예: *:participant:789:*)
     */
    public static String participantPattern(Long participantId) {
        return "*:participant:" + participantId + ":*";
    }

    // ========== 전체 도메인 패턴 ==========

    /**
     * 모든 장소 캐시 패턴
     * 형식: places:*
     *
     * @return 패턴 (예: places:*)
     */
    public static String allPlacesPattern() {
        return "places:*";
    }

    /**
     * 모든 경로 캐시 패턴
     * 형식: routes:*
     *
     * @return 패턴 (예: routes:*)
     */
    public static String allRoutesPattern() {
        return "routes:*";
    }

    /**
     * 모든 요약 캐시 패턴
     * 형식: summary:*
     *
     * @return 패턴 (예: summary:*)
     */
    public static String allSummaryPattern() {
        return "summary:*";
    }

    /**
     * 모든 막차 캐시 패턴
     * 형식: train:*
     *
     * @return 패턴 (예: train:*)
     */
    public static String allTrainPattern() {
        return "train:*";
    }
}