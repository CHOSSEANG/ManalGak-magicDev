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
     * 형식: places:meeting:{meetingUuid}:candidate:{candidateId}:{purpose}:{limit}
     *
     * @param meetingUuid 모임 UUID
     * @param candidateId 후보 지점 ID
     * @param purpose     모임 목적 (DINING, DATE, STUDY, GENERAL)
     * @param limit       반환할 장소 수
     * @return 캐시 키 (예: places:meeting:abc-123:candidate:123:DINING:10)
     */
    public static String placesKey(String meetingUuid, Long candidateId, String purpose, int limit) {
        return String.format("places:meeting:%s:candidate:%d:%s:%d",
                meetingUuid, candidateId, purpose, limit);
    }

    /**
     * 중간지점 기반 장소 목록 캐시 키 생성
     * 형식: places:meeting:{meetingUuid}:midpoint:{purpose}:{limit}
     *
     * @param meetingUuid 모임 UUID
     * @param purpose     모임 목적 (DINING, CAFE, CULTURE, TOUR)
     * @param limit       반환할 장소 수
     * @return 캐시 키 (예: places:meeting:abc-123:midpoint:DINING:10)
     */
    public static String placesKeyByMidpoint(String meetingUuid, String purpose, int limit) {
        return String.format("places:meeting:%s:midpoint:%s:%d",
                meetingUuid, purpose, limit);
    }

    /**
     * 특정 후보지의 모든 장소 캐시 패턴
     * 형식: *:candidate:{candidateId}:*
     *
     * @param candidateId 후보 지점 ID
     * @return 패턴 (예: *:candidate:123:*)
     */
    public static String placesPattern(Long candidateId) {
        return String.format("*:candidate:%d:*", candidateId);
    }

    // ========== API #2: 경로 조회 ==========

    /**
     * 경로 정보 캐시 키 생성
     * 형식: routes:meeting:{meetingUuid}:candidate:{candidateId}
     *
     * @param meetingUuid 모임 UUID
     * @param candidateId 후보 지점 ID
     * @return 캐시 키 (예: routes:meeting:abc-123:candidate:456)
     */
    public static String routesKey(String meetingUuid, Long candidateId) {
        return String.format("routes:meeting:%s:candidate:%d", meetingUuid, candidateId);
    }

    // ========== API #3: 막차 조회 ==========

    /**
     * 막차 정보 캐시 키 생성
     * 형식: train:meeting:{meetingUuid}:participant:{participantId}:candidate:{candidateId}
     *
     * @param meetingUuid   모임 UUID
     * @param participantId 참여자 ID
     * @param candidateId   후보 지점 ID
     * @return 캐시 키 (예: train:meeting:abc-123:participant:789:candidate:456)
     */
    public static String lastTrainKey(String meetingUuid, Long participantId, Long candidateId) {
        return String.format("train:meeting:%s:participant:%d:candidate:%d",
                meetingUuid, participantId, candidateId);
    }

    /**
     * 특정 참여자의 모든 막차 캐시 패턴
     * 형식: *:participant:{participantId}:*
     *
     * @param participantId 참여자 ID
     * @return 패턴 (예: *:participant:789:*)
     */
    public static String lastTrainPattern(Long participantId) {
        return String.format("*:participant:%d:*", participantId);
    }

    // ========== API #4: AI 장소 요약 ==========

    /**
     * AI 장소 요약 캐시 키 생성
     * 형식: summary:place:meeting:{meetingUuid}:candidate:{candidateId}:{tone}
     *
     * @param meetingUuid 모임 UUID
     * @param candidateId 후보 지점 ID
     * @param tone        톤 (friendly, professional, casual)
     * @return 캐시 키 (예: summary:place:meeting:abc-123:candidate:123:friendly)
     */
    public static String placeSummaryKey(String meetingUuid, Long candidateId, String tone) {
        return String.format("summary:place:meeting:%s:candidate:%d:%s",
                meetingUuid, candidateId, tone);
    }

    /**
     * 특정 후보지의 모든 장소 요약 캐시 패턴
     * 형식: *:candidate:{candidateId}:*
     *
     * @param candidateId 후보 지점 ID
     * @return 패턴 (예: *:candidate:123:*)
     */
    public static String placeSummaryPattern(Long candidateId) {
        return String.format("*:candidate:%d:*", candidateId);
    }

    // ========== API #5: AI 경로 요약 ==========

    /**
     * AI 경로 요약 캐시 키 생성
     * 형식: summary:route:meeting:{meetingUuid}:hash:{hash}
     *
     * @param meetingUuid 모임 UUID
     * @param routeHash   경로 데이터의 해시값 (MD5 등)
     * @return 캐시 키 (예: summary:route:meeting:abc-123:hash:abc123def456)
     */
    public static String routeSummaryKey(String meetingUuid, String routeHash) {
        return String.format("summary:route:meeting:%s:hash:%s", meetingUuid, routeHash);
    }

    // ========== 패턴 매칭용 ==========

    /**
     * 모임 관련 장소 캐시 패턴
     * 형식: places:meeting:{meetingUuid}:*
     *
     * @param meetingUuid 모임 UUID
     * @return 패턴 (예: places:meeting:abc-123:*)
     */
    public static String meetingPlacesPattern(String meetingUuid) {
        return "places:meeting:" + meetingUuid + ":*";
    }

    /**
     * 모임 관련 경로 캐시 패턴
     * 형식: routes:meeting:{meetingUuid}:*
     *
     * @param meetingUuid 모임 UUID
     * @return 패턴 (예: routes:meeting:abc-123:*)
     */
    public static String meetingRoutesPattern(String meetingUuid) {
        return "routes:meeting:" + meetingUuid + ":*";
    }

    /**
     * 모임 관련 막차 캐시 패턴
     * 형식: train:meeting:{meetingUuid}:*
     *
     * @param meetingUuid 모임 UUID
     * @return 패턴 (예: train:meeting:abc-123:*)
     */
    public static String meetingTrainPattern(String meetingUuid) {
        return "train:meeting:" + meetingUuid + ":*";
    }

    /**
     * 모임 관련 요약 캐시 패턴
     * 형식: summary:*:meeting:{meetingUuid}:*
     *
     * @param meetingUuid 모임 UUID
     * @return 패턴 (예: summary:*:meeting:abc-123:*)
     */
    public static String meetingSummaryPattern(String meetingUuid) {
        return "summary:*:meeting:" + meetingUuid + ":*";
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