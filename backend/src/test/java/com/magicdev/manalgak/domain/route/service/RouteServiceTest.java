package com.magicdev.manalgak.domain.route.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.domain.algorithm.entity.MeetingCandidate;
import com.magicdev.manalgak.domain.algorithm.repository.MeetingCandidateRepository;
import com.magicdev.manalgak.domain.external.odsay.service.OdsayApiService;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.repository.ParticipantRepository;
import com.magicdev.manalgak.domain.route.dto.RouteResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RouteServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private OdsayApiService odsayApiService;

    @Mock
    private ObjectProvider<MeetingCandidateRepository> meetingCandidateRepositoryProvider;

    @Mock
    private ObjectProvider<ParticipantRepository> participantRepositoryProvider;

    @Mock
    private MeetingCandidateRepository meetingCandidateRepository;

    @Mock
    private ParticipantRepository participantRepository;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private RouteService routeService;

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(meetingCandidateRepositoryProvider.getIfAvailable()).thenReturn(meetingCandidateRepository);
        when(participantRepositoryProvider.getIfAvailable()).thenReturn(participantRepository);
    }

    @Test
    @DisplayName("경로 조회 성공 - API 호출")
    void getRoutes_success_fromApi() {
        // given
        String meetingUuid = "test-uuid";
        Long candidateId = 1L;

        when(valueOperations.get(anyString())).thenReturn(null);

        MeetingCandidate candidate = createMockCandidate();
        when(meetingCandidateRepository.findById(candidateId))
                .thenReturn(Optional.of(candidate));

        List<Participant> participants = createMockParticipants();
        when(participantRepository.findByMeetingUuid(meetingUuid))
                .thenReturn(participants);

        List<RouteResponse.RouteInfo> mockRoutes = createMockRoutes();
        when(odsayApiService.getRoutesParallel(any(), any(), any()))
                .thenReturn(mockRoutes);

        // when
        RouteResponse result = routeService.getRoutes(meetingUuid, candidateId);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getRoutes()).hasSize(2);
        assertThat(result.getStatistics()).isNotNull();

        verify(odsayApiService, times(1)).getRoutesParallel(any(), any(), any());
        verify(valueOperations, times(1)).set(anyString(), any(), any());
    }

    @Test
    @DisplayName("경로 조회 성공 - Redis 캐시에서 조회")
    void getRoutes_success_fromCache() {
        // given
        String meetingUuid = "test-uuid";
        Long candidateId = 1L;

        RouteResponse cachedResponse = RouteResponse.builder()
                .routes(createMockRoutes())
                .statistics(RouteResponse.RouteStatistics.builder()
                        .averageTravelTime(30)
                        .maxTravelTime(35)
                        .minTravelTime(25)
                        .totalTransfers(3)
                        .mostFrequentTransport("지하철")
                        .build())
                .build();

        when(valueOperations.get(anyString())).thenReturn(cachedResponse);

        // when
        RouteResponse result = routeService.getRoutes(meetingUuid, candidateId);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getRoutes()).hasSize(2);

        verify(odsayApiService, never()).getRoutesParallel(any(), any(), any());
        verify(valueOperations, times(1)).get(anyString());
    }

    @Test
    @DisplayName("후보지를 찾을 수 없음 - 예외 발생")
    void getRoutes_candidateNotFound_throwsException() {
        // given
        String meetingUuid = "test-uuid";
        Long candidateId = 999L;

        when(valueOperations.get(anyString())).thenReturn(null);
        when(meetingCandidateRepository.findById(candidateId))
                .thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> routeService.getRoutes(meetingUuid, candidateId))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    @DisplayName("참여자가 없음 - 예외 발생")
    void getRoutes_noParticipants_throwsException() {
        // given
        String meetingUuid = "test-uuid";
        Long candidateId = 1L;

        when(valueOperations.get(anyString())).thenReturn(null);

        MeetingCandidate candidate = createMockCandidate();
        when(meetingCandidateRepository.findById(candidateId))
                .thenReturn(Optional.of(candidate));

        when(participantRepository.findByMeetingUuid(meetingUuid))
                .thenReturn(List.of());

        // when & then
        assertThatThrownBy(() -> routeService.getRoutes(meetingUuid, candidateId))
                .isInstanceOf(BusinessException.class);
    }

    private MeetingCandidate createMockCandidate() {
        MeetingCandidate candidate = new MeetingCandidate();
        // Use reflection or builder if available
        // For simplicity, assuming setters exist
        try {
            var latField = MeetingCandidate.class.getDeclaredField("latitude");
            latField.setAccessible(true);
            latField.set(candidate, 37.5);

            var lonField = MeetingCandidate.class.getDeclaredField("longitude");
            lonField.setAccessible(true);
            lonField.set(candidate, 127.0);
        } catch (Exception e) {
            // fallback
        }
        return candidate;
    }

    private List<Participant> createMockParticipants() {
        Participant p1 = Participant.builder()
                .name("참여자1")
                .startLatitude(37.4)
                .startLongitude(126.9)
                .build();

        Participant p2 = Participant.builder()
                .name("참여자2")
                .startLatitude(37.6)
                .startLongitude(127.1)
                .build();

        return List.of(p1, p2);
    }

    private List<RouteResponse.RouteInfo> createMockRoutes() {
        RouteResponse.RouteInfo route1 = RouteResponse.RouteInfo.builder()
                .participantName("참여자1")
                .path("역A → 역B")
                .travelTime(25)
                .transferCount(1)
                .transportType("지하철")
                .build();

        RouteResponse.RouteInfo route2 = RouteResponse.RouteInfo.builder()
                .participantName("참여자2")
                .path("역C → 역D")
                .travelTime(35)
                .transferCount(2)
                .transportType("지하철+버스")
                .build();

        return List.of(route1, route2);
    }
}