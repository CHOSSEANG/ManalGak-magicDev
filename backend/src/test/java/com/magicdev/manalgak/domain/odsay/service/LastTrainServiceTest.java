package com.magicdev.manalgak.domain.odsay.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.domain.external.odsay.client.OdsayClient;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayTimeTableRequest;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayTimeTableResponse;
import com.magicdev.manalgak.domain.odsay.dto.LastTrainResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LastTrainServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private OdsayClient odsayClient;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private LastTrainService lastTrainService;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    @DisplayName("막차 정보 조회 성공 - API 호출")
    void getLastTrain_success_fromApi() {
        // given
        String meetingUuid = "test-uuid";
        Long participantId = 1L;
        Long candidateId = 1L;

        when(valueOperations.get(anyString())).thenReturn(null);

        OdsayTimeTableResponse mockResponse = createMockTimeTableResponse();
        when(odsayClient.getTimeTable(any(OdsayTimeTableRequest.class)))
                .thenReturn(mockResponse);

        // when
        LastTrainResponse result = lastTrainService.getLastTrain(meetingUuid, participantId, candidateId);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getStationName()).isEqualTo("강남");
        assertThat(result.getLineName()).isEqualTo("수도권 2호선");
        assertThat(result.getLastTrainTime()).isNotNull();
        assertThat(result.isFromCache()).isFalse();

        verify(odsayClient, times(1)).getTimeTable(any());
        verify(valueOperations, times(1)).set(anyString(), any(), any());
    }

    @Test
    @DisplayName("막차 정보 조회 성공 - Redis 캐시에서 조회")
    void getLastTrain_success_fromCache() {
        // given
        String meetingUuid = "test-uuid";
        Long participantId = 1L;
        Long candidateId = 1L;

        LastTrainResponse cachedResponse = LastTrainResponse.builder()
                .stationName("강남")
                .lineName("수도권 2호선")
                .lastTrainTime(LocalDateTime.now())
                .taxiFare(15000)
                .fromCache(false)
                .build();

        when(valueOperations.get(anyString())).thenReturn(cachedResponse);

        // when
        LastTrainResponse result = lastTrainService.getLastTrain(meetingUuid, participantId, candidateId);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getStationName()).isEqualTo("강남");
        assertThat(result.isFromCache()).isTrue();

        verify(odsayClient, never()).getTimeTable(any());
        verify(valueOperations, times(1)).get(anyString());
    }

    @Test
    @DisplayName("막차 정보 없음 - 예외 발생")
    void getLastTrain_notFound_throwsException() {
        // given
        String meetingUuid = "test-uuid";
        Long participantId = 1L;
        Long candidateId = 1L;

        when(valueOperations.get(anyString())).thenReturn(null);

        OdsayTimeTableResponse emptyResponse = OdsayTimeTableResponse.builder()
                .result(OdsayTimeTableResponse.Result.builder()
                        .ordList(OdsayTimeTableResponse.TimeList.builder()
                                .up(OdsayTimeTableResponse.Direction.builder()
                                        .time(List.of())
                                        .build())
                                .build())
                        .build())
                .build();

        when(odsayClient.getTimeTable(any(OdsayTimeTableRequest.class)))
                .thenReturn(emptyResponse);

        // when & then
        assertThatThrownBy(() -> lastTrainService.getLastTrain(meetingUuid, participantId, candidateId))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    @DisplayName("Redis 캐시 조회 실패 시 API 호출로 fallback")
    void getLastTrain_cacheFail_fallbackToApi() {
        // given
        String meetingUuid = "test-uuid";
        Long participantId = 1L;
        Long candidateId = 1L;

        when(valueOperations.get(anyString())).thenThrow(new RuntimeException("Redis error"));

        OdsayTimeTableResponse mockResponse = createMockTimeTableResponse();
        when(odsayClient.getTimeTable(any(OdsayTimeTableRequest.class)))
                .thenReturn(mockResponse);

        // when
        LastTrainResponse result = lastTrainService.getLastTrain(meetingUuid, participantId, candidateId);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getStationName()).isEqualTo("강남");
        verify(odsayClient, times(1)).getTimeTable(any());
    }

    private OdsayTimeTableResponse createMockTimeTableResponse() {
        OdsayTimeTableResponse.TimeBlock timeBlock = OdsayTimeTableResponse.TimeBlock.builder()
                .idx(24)
                .list("10(성수) 23(성수) 54(삼성)")
                .build();

        OdsayTimeTableResponse.Direction direction = OdsayTimeTableResponse.Direction.builder()
                .time(List.of(timeBlock))
                .build();

        OdsayTimeTableResponse.TimeList timeList = OdsayTimeTableResponse.TimeList.builder()
                .up(direction)
                .build();

        OdsayTimeTableResponse.Result result = OdsayTimeTableResponse.Result.builder()
                .ordList(timeList)
                .laneName("수도권 2호선")
                .stationName("강남")
                .stationID(222)
                .build();

        return OdsayTimeTableResponse.builder()
                .result(result)
                .build();
    }
}