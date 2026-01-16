package com.magicdev.manalgak.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    /* =====================
     * 1 공통 에러
     * ===================== */
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청 파라미터"),
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "유효성 검증 실패"),
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "리소스를 찾을 수 없음"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 에러"),
    INVALID_UUID(HttpStatus.BAD_REQUEST, "잘못된 UUID 형식입니다"),
    INVALID_TIME(HttpStatus.BAD_REQUEST, "유효하지 않은 시간 값입니다"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,"존재하지 않은 유저"),

    /* =====================
     * 2 모임 관련 에러
     * ===================== */
    MEETING_NOT_FOUND(HttpStatus.NOT_FOUND, "모임을 찾을 수 없음"),
    MEETING_EXPIRED(HttpStatus.BAD_REQUEST, "만료된 모임"),
    INVALID_MAX_PARTICIPANTS(HttpStatus.BAD_REQUEST, "최대 참여자 수 범위 오류 (2~10)"),
    MEETING_NOT_ORGANIZER(HttpStatus.BAD_REQUEST, "모임장이 아닙니다."),

    /* =====================
     * 3 참여자 관련 에러
     * ===================== */
    MAX_PARTICIPANTS_EXCEEDED(HttpStatus.BAD_REQUEST, "최대 참여자 수 초과"),
    INSUFFICIENT_PARTICIPANTS(HttpStatus.BAD_REQUEST, "참여자 수 부족 (최소 2명)"),
    DUPLICATE_PARTICIPANT_NAME(HttpStatus.CONFLICT, "중복된 참여자 이름"),
    PARTICIPANT_NOT_FOUND(HttpStatus.NOT_FOUND, "참여자를 찾을 수 없음"),
    INVALID_PARTICIPANT_TOKEN(HttpStatus.FORBIDDEN, "유효하지 않은 참여자 토큰"),
    ALREADY_PARTICIPANT(HttpStatus.CONFLICT, "이미 참여한 참여자"),
    NO_AUTHORITY(HttpStatus.FORBIDDEN, "해당 작업에 대한 권한 없음"),

    /* =====================
     * 4 위치 정보 관련 에러
     * ===================== */
    INVALID_COORDINATES(HttpStatus.BAD_REQUEST, "유효하지 않은 좌표"),
    GEOCODING_FAILED(HttpStatus.BAD_GATEWAY, "주소 변환 실패"),

    /* =====================
     * 5 계산 관련 에러
     * ===================== */
    CALCULATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "중간 지점 계산 실패"),
    CANDIDATE_NOT_FOUND(HttpStatus.NOT_FOUND, "후보 지점을 찾을 수 없음"),

    /* =====================
     * 6 외부 API 관련 에러
     * ===================== */
    KAKAO_API_ERROR(HttpStatus.BAD_GATEWAY, "카카오 API 호출 실패"),
    ODSAY_API_ERROR(HttpStatus.BAD_GATEWAY, "ODsay API 호출 실패"),
    OPENAI_API_ERROR(HttpStatus.BAD_GATEWAY, "OpenAI API 호출 실패"),
    API_RATE_LIMIT_EXCEEDED(HttpStatus.TOO_MANY_REQUESTS, "API 호출 제한 초과"),
    EXTERNAL_API_ERROR(HttpStatus.BAD_GATEWAY, "외부 API 호출 실패"),
    LAST_TRAIN_NOT_FOUND(HttpStatus.NOT_FOUND, "막차 정보를 찾을 수 없음"),

    /* =====================
     * 7 주소 관련 에러
     * ===================== */
    ADDRESS_NOT_FOUND(HttpStatus.NOT_FOUND, "주소를 찾을 수 없음"),
    ADDRESS_LIMIT(HttpStatus.BAD_REQUEST, "최대 주소 초과"),


    /* =====================
     * 8 투표 관련 에러
     * ===================== */
    VOTE_NOT_FOUND(HttpStatus.NOT_FOUND, "투표를 찾을 수 없음"),
    VOTE_OPTION_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 옵션을 찾을 수 없음");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
