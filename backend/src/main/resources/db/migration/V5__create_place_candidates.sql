-- V5: 추천 장소 후보 테이블 생성 (투표용 6개 매장 저장)

CREATE TABLE IF NOT EXISTS place_candidates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meeting_id BIGINT NOT NULL,
    place_id VARCHAR(100) NOT NULL,
    place_name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    category_group_code VARCHAR(20),
    category_group_name VARCHAR(100),
    category_name VARCHAR(200),
    address VARCHAR(500),
    road_address VARCHAR(500),
    latitude DOUBLE,
    longitude DOUBLE,
    distance INT,
    walking_minutes INT,
    phone VARCHAR(50),
    place_url VARCHAR(500),
    created_at DATETIME,
    INDEX idx_place_candidates_meeting_id (meeting_id),
    CONSTRAINT fk_place_candidates_meeting
        FOREIGN KEY (meeting_id) REFERENCES meetings(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;