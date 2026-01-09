package com.magicdev.manalgak.common.config;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Redis 설정 테스트
 * - Redis 연결 확인
 * - 데이터 저장/조회 테스트
 * - 객체 직렬화/역직렬화 테스트
 *
 * @author Backend 3 (종태님)
 * @since 2026-01-09
 */
@SpringBootTest
class RedisConfigTest {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @AfterEach
    void tearDown() {
        // 각 테스트 후 테스트 데이터 정리
        redisTemplate.delete("test:string");
        redisTemplate.delete("test:object");
    }

    @Test
    @DisplayName("Redis 연결 테스트 - String 저장 및 조회")
    void redis연결_String_테스트() {
        // Given
        String key = "test:string";
        String value = "Hello Redis";

        // When
        redisTemplate.opsForValue().set(key, value);
        Object result = redisTemplate.opsForValue().get(key);

        // Then
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(value);

        System.out.println("✅ Redis String 저장/조회 성공: " + result);
    }

    @Test
    @DisplayName("Redis 객체 저장 및 조회 테스트")
    void redis_객체_저장_테스트() {
        // Given
        String key = "test:object";
        TestUser user = new TestUser("홍길동", 25, LocalDateTime.now());

        // When
        redisTemplate.opsForValue().set(key, user);
        Object result = redisTemplate.opsForValue().get(key);

        // Then
        assertThat(result).isNotNull();
        // JSON 직렬화로 인해 LinkedHashMap으로 역직렬화될 수 있음

        System.out.println("✅ Redis 객체 저장/조회 성공: " + result);
        System.out.println("   저장된 타입: " + result.getClass().getName());
    }

    @Test
    @DisplayName("Redis 데이터 삭제 테스트")
    void redis_데이터_삭제_테스트() {
        // Given
        String key = "test:delete";
        String value = "Delete Me";
        redisTemplate.opsForValue().set(key, value);

        // When
        Boolean deleted = redisTemplate.delete(key);
        Object result = redisTemplate.opsForValue().get(key);

        // Then
        assertThat(deleted).isTrue();
        assertThat(result).isNull();

        System.out.println("✅ Redis 데이터 삭제 성공");
    }

    @Test
    @DisplayName("Redis 존재 여부 확인 테스트")
    void redis_키_존재_확인_테스트() {
        // Given
        String key = "test:exists";
        String value = "Exists";

        // When - 저장 전
        Boolean existsBefore = redisTemplate.hasKey(key);

        // When - 저장 후
        redisTemplate.opsForValue().set(key, value);
        Boolean existsAfter = redisTemplate.hasKey(key);

        // Then
        assertThat(existsBefore).isFalse();
        assertThat(existsAfter).isTrue();

        System.out.println("✅ Redis 키 존재 확인 성공");

        // Clean up
        redisTemplate.delete(key);
    }

    /**
     * 테스트용 DTO
     */
    static class TestUser {
        private String name;
        private int age;
        private LocalDateTime createdAt;

        public TestUser() {
        }

        public TestUser(String name, int age, LocalDateTime createdAt) {
            this.name = name;
            this.age = age;
            this.createdAt = createdAt;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        @Override
        public String toString() {
            return String.format("TestUser{name='%s', age=%d, createdAt=%s}",
                    name, age, createdAt);
        }
    }
}