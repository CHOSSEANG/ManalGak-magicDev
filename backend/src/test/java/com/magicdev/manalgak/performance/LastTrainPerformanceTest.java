package com.magicdev.manalgak.performance;

import com.magicdev.manalgak.domain.odsay.dto.LastTrainResponse;
import com.magicdev.manalgak.domain.odsay.service.LastTrainService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Slf4j
class LastTrainPerformanceTest {

    @Autowired
    private LastTrainService lastTrainService;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @BeforeEach
    void setUp() {
        redisTemplate.getConnectionFactory()
                .getConnection()
                .flushAll();
    }

    @Test
    void 막차_조회_캐싱_성능_테스트() {
        String meetingUuid = "test-meeting-uuid-1";
        Long participantId = 1L;
        Long candidateId = 1L;

        LastTrainResponse response1 = lastTrainService.getLastTrain(meetingUuid, participantId, candidateId);
        assertThat(response1.getStationName()).isNotNull();

        LastTrainResponse response2 = lastTrainService.getLastTrain(meetingUuid, participantId, candidateId);
        assertThat(response2.getStationName()).isEqualTo(response1.getStationName());
    }

    @Test
    void 다른_참여자_캐시_테스트() {
        String meetingUuid = "test-meeting-uuid-2";
        Long participantId1 = 1L;
        Long participantId2 = 2L;
        Long candidateId = 1L;

        LastTrainResponse response1 = lastTrainService.getLastTrain(meetingUuid, participantId1, candidateId);
        assertThat(response1.getStationName()).isNotNull();

        LastTrainResponse response2 = lastTrainService.getLastTrain(meetingUuid, participantId2, candidateId);
        assertThat(response2.getStationName()).isNotNull();

        LastTrainResponse response3 = lastTrainService.getLastTrain(meetingUuid, participantId1, candidateId);
        assertThat(response3.getStationName()).isEqualTo(response1.getStationName());
    }
}
