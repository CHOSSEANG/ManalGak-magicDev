-- V4: 추천 장소 테이블 생성

CREATE TABLE IF NOT EXISTS recommended_places (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meeting_id BIGINT NOT NULL,
    place_id VARCHAR(100) NOT NULL,
    place_name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    category_group_code VARCHAR(20),
    category_group_name VARCHAR(100),
    address VARCHAR(500),
    road_address VARCHAR(500),
    latitude DOUBLE,
    longitude DOUBLE,
    distance INT,
    walking_minutes INT,
    phone VARCHAR(50),
    place_url VARCHAR(500),
    created_at DATETIME,
    INDEX idx_meeting_id (meeting_id),
    INDEX idx_place_id (place_id),
    CONSTRAINT fk_recommended_places_meeting
        FOREIGN KEY (meeting_id) REFERENCES meetings(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;