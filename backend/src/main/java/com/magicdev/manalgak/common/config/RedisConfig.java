package com.magicdev.manalgak.common.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.PolymorphicTypeValidator;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Redis 설정 클래스
 * - Spring Data Redis를 사용한 캐싱 설정
 * - Lettuce 클라이언트 사용 (비동기, 성능 우수)
 * - JSON 직렬화를 통한 객체 저장
 *
 * @author Backend 3 (종태님)
 * @since 2026-01-09
 */
@Configuration
@EnableCaching  // Spring Cache 추상화 활성화 (@Cacheable 등 어노테이션 사용 가능)
public class RedisConfig {

    @Value("${spring.redis.host}")
    private String redisHost;

    @Value("${spring.redis.port}")
    private int redisPort;

    /**
     * Redis 연결 팩토리 설정
     * - Lettuce 클라이언트 사용 (Spring Boot 기본)
     * - Redis 서버와의 연결을 관리
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName(redisHost);
        config.setPort(redisPort);
        // 운영 환경에서 비밀번호가 필요한 경우:
        // config.setPassword(redisPassword);

        return new LettuceConnectionFactory(config);
    }

    /**
     * RedisTemplate 설정
     * - 직접 Redis 명령어를 사용할 때 필요
     * - Key: String, Value: JSON
     *
     * 사용 예시:
     * redisTemplate.opsForValue().set("key", object);
     * Object result = redisTemplate.opsForValue().get("key");
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory connectionFactory
    ) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Key Serializer: String으로 직렬화
        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        // Value Serializer: JSON으로 직렬화
        GenericJackson2JsonRedisSerializer jsonSerializer = jsonRedisSerializer();
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }

    /**
     * JSON Serializer 설정
     * - Java 객체를 JSON으로 변환
     * - LocalDateTime 등 Java 8 시간 API 지원
     * - 보안: BasicPolymorphicTypeValidator 사용 (RCE 방지)
     */
    private GenericJackson2JsonRedisSerializer jsonRedisSerializer() {
        ObjectMapper objectMapper = new ObjectMapper();

        // Java 8 시간 API 지원 (LocalDateTime, LocalDate 등)
        objectMapper.registerModule(new JavaTimeModule());

        // 날짜를 타임스탬프가 아닌 문자열로 저장
        // 예: "2026-01-09T16:30:00" 형식으로 저장
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        // 안전한 타입 검증 (보안 강화)
        // - 프로젝트 패키지만 허용
        // - 자바 기본 클래스 허용
        PolymorphicTypeValidator ptv = BasicPolymorphicTypeValidator.builder()
                .allowIfBaseType("com.magicdev.manalgak")  // 우리 프로젝트 전체 패키지 (domain, common 등)
                .allowIfSubType("java.util")  // 자바 컬렉션
                .allowIfSubType("java.time")  // 자바 시간 API
                .build();

        // Redis 캐싱용 타입 정보 포함 (역직렬화 시 실제 타입 복원)
        objectMapper.activateDefaultTyping(
                ptv,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        return new GenericJackson2JsonRedisSerializer(objectMapper);
    }

    /**
     * CacheManager 설정
     * - @Cacheable 어노테이션을 사용할 때 필요
     * - 기본 TTL: 1시간
     *
     * 사용 예시:
     * @Cacheable(value = "places", key = "#candidateId")
     * public List<Place> getPlaces(Long candidateId) { ... }
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                // 기본 TTL 설정 (1시간)
                .entryTtl(Duration.ofHours(1))

                // null 값 캐싱 허용 안 함 (null은 저장하지 않음)
                .disableCachingNullValues()

                // Key Serializer: String으로 직렬화
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(new StringRedisSerializer())
                )

                // Value Serializer: JSON으로 직렬화
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(jsonRedisSerializer())
                );

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .build();
    }
}
