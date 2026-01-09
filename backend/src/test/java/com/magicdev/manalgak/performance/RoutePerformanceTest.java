package com.magicdev.manalgak.performance;

import com.magicdev.manalgak.domain.route.dto.RouteResponse;
import com.magicdev.manalgak.domain.route.service.RouteService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Slf4j
class RoutePerformanceTest {

    @Autowired
    private RouteService routeService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @BeforeEach
    void setUp() {
        redisTemplate.getConnectionFactory()
                .getConnection()
                .flushAll();
    }

    @Test
    void 경로_조회_캐싱_성능_테스트() {
        String meetingUuid = "test-meeting-uuid";
        Long candidateId = 1L;

        RouteResponse response1 = routeService.getRoutes(meetingUuid, candidateId);
        assertThat(response1.getRoutes()).isNotEmpty();

        RouteResponse response2 = routeService.getRoutes(meetingUuid, candidateId);
        assertThat(response2.getRoutes()).hasSize(response1.getRoutes().size());
    }

    @Test
    void 다른_후보지_캐시_테스트() {
        String meetingUuid = "test-meeting-uuid";
        Long candidateId1 = 1L;
        Long candidateId2 = 2L;

        RouteResponse response1 = routeService.getRoutes(meetingUuid, candidateId1);
        assertThat(response1.getRoutes()).isNotEmpty();

        RouteResponse response2 = routeService.getRoutes(meetingUuid, candidateId2);
        assertThat(response2.getRoutes()).isNotEmpty();

        RouteResponse response3 = routeService.getRoutes(meetingUuid, candidateId1);
        assertThat(response3.getRoutes()).hasSize(response1.getRoutes().size());
    }
}
