-- V1: 기본 테이블 생성

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    kakao_id BIGINT NOT NULL UNIQUE,
    nickname VARCHAR(100),
    profile_image_url VARCHAR(500),
    created_at DATETIME NOT NULL,
    INDEX idx_kakao_id (kakao_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 모임 테이블
CREATE TABLE IF NOT EXISTS meetings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meeting_uuid VARCHAR(36) NOT NULL UNIQUE,
    meeting_name VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    purpose VARCHAR(50),
    meeting_time DATETIME,
    end_time DATETIME,
    total_participants INT,
    organizer_id BIGINT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    INDEX idx_meeting_uuid (meeting_uuid),
    INDEX idx_organizer_id (organizer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 참여자 테이블
CREATE TABLE IF NOT EXISTS participant (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meeting_uuid VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_latitude DOUBLE NOT NULL,
    start_longitude DOUBLE NOT NULL,
    start_address VARCHAR(500),
    INDEX idx_meeting_uuid (meeting_uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 모임 후보지 테이블
CREATE TABLE IF NOT EXISTS meeting_candidate (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meeting_uuid VARCHAR(36) NOT NULL,
    name VARCHAR(200),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    address VARCHAR(500),
    INDEX idx_meeting_uuid (meeting_uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
