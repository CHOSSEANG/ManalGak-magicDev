package com.magicdev.manalgak.performance;

import com.magicdev.manalgak.domain.place.dto.PlaceResponse;
import com.magicdev.manalgak.domain.place.service.PlaceService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Slf4j
class PlacePerformanceTest {

    @Autowired
    private PlaceService placeService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @BeforeEach
    void setUp() {
        redisTemplate.getConnectionFactory()
                .getConnection()
                .flushAll();
    }

    @Test
    void 장소_추천_캐싱_성능_테스트() {
        Long candidateId = 1L;
        String purpose = "DINING";
        int limit = 10;

        PlaceResponse response1 = placeService.getRecommendedPlaces(candidateId, purpose, limit);
        assertThat(response1.isFromCache()).isFalse();

        PlaceResponse response2 = placeService.getRecommendedPlaces(candidateId, purpose, limit);
        assertThat(response2.isFromCache()).isTrue();

        assertThat(response2.getPlaces()).isEqualTo(response1.getPlaces());
    }

    @Test
    void 캐시_만료_후_재호출_테스트() throws InterruptedException {
        Long candidateId = 2L;
        String purpose = "CAFE";
        int limit = 5;

        PlaceResponse response1 = placeService.getRecommendedPlaces(candidateId, purpose, limit);
        assertThat(response1.isFromCache()).isFalse();

        Thread.sleep(100);

        String cacheKey = "places:candidate:" + candidateId + ":" + purpose + ":" + limit;
        redisTemplate.expire(cacheKey, Duration.ofSeconds(1));

        Thread.sleep(1100);

        PlaceResponse response2 = placeService.getRecommendedPlaces(candidateId, purpose, limit);
        assertThat(response2.isFromCache()).isFalse();
    }

    @Test
    void 다른_파라미터_호출시_새로운_캐시_테스트() {
        Long candidateId = 3L;
        String purpose1 = "DINING";
        String purpose2 = "CAFE";
        int limit = 5;

        PlaceResponse response1 = placeService.getRecommendedPlaces(candidateId, purpose1, limit);
        assertThat(response1.isFromCache()).isFalse();

        PlaceResponse response2 = placeService.getRecommendedPlaces(candidateId, purpose1, limit);
        assertThat(response2.isFromCache()).isTrue();

        PlaceResponse response3 = placeService.getRecommendedPlaces(candidateId, purpose2, limit);
        assertThat(response3.isFromCache()).isFalse();
    }
}
