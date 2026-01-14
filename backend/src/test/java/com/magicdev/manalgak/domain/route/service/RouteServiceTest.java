package com.magicdev.manalgak.domain.route.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.domain.algorithm.entity.MeetingCandidate;
import com.magicdev.manalgak.domain.algorithm.repository.MeetingCandidateRepository;
import com.magicdev.manalgak.domain.external.odsay.service.OdsayApiService;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import com.magicdev.manalgak.domain.participant.entity.Location;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

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
    private ObjectProvider<MeetingRepository> meetingRepositoryProvider;

    @Mock
    private MeetingCandidateRepository meetingCandidateRepository;

    @Mock
    private ParticipantRepository participantRepository;

    @Mock
    private MeetingRepository meetingRepository;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    private RouteService routeService;

    @BeforeEach
    void setUp() {
        lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        lenient().when(meetingCandidateRepositoryProvider.getIfAvailable()).thenReturn(meetingCandidateRepository);
        lenient().when(participantRepositoryProvider.getIfAvailable()).thenReturn(participantRepository);
        lenient().when(meetingRepositoryProvider.getIfAvailable()).thenReturn(meetingRepository);

        routeService = new RouteService(
                redisTemplate,
                odsayApiService,
                meetingCandidateRepositoryProvider,
                participantRepositoryProvider,
                meetingRepositoryProvider
        );
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

        Meeting meeting = createMockMeeting(meetingUuid);
        when(meetingRepository.findByMeetingUuid(meetingUuid))
                .thenReturn(Optional.of(meeting));

        List<Participant> participants = createMockParticipants();
        when(participantRepository.findByMeetingId(meeting.getId()))
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

        Meeting meeting = createMockMeeting(meetingUuid);
        when(meetingRepository.findByMeetingUuid(meetingUuid))
                .thenReturn(Optional.of(meeting));

        when(participantRepository.findByMeetingId(meeting.getId()))
                .thenReturn(List.of());

        // when & then
        assertThatThrownBy(() -> routeService.getRoutes(meetingUuid, candidateId))
                .isInstanceOf(BusinessException.class);
    }

    private MeetingCandidate createMockCandidate() {
        MeetingCandidate candidate = new MeetingCandidate();
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

    private Meeting createMockMeeting(String meetingUuid) {
        Meeting meeting = new Meeting();
        try {
            var idField = Meeting.class.getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(meeting, 1L);

            var uuidField = Meeting.class.getDeclaredField("meetingUuid");
            uuidField.setAccessible(true);
            uuidField.set(meeting, meetingUuid);
        } catch (Exception e) {
            // fallback
        }
        return meeting;
    }

    private List<Participant> createMockParticipants() {
        Location origin1 = new Location(
                new BigDecimal("37.4"),
                new BigDecimal("126.9"),
                "서울시 강남구"
        );

        Location origin2 = new Location(
                new BigDecimal("37.6"),
                new BigDecimal("127.1"),
                "서울시 강북구"
        );

        Participant p1 = mock(Participant.class);
        when(p1.getNickName()).thenReturn("참여자1");
        when(p1.getOrigin()).thenReturn(origin1);

        Participant p2 = mock(Participant.class);
        when(p2.getNickName()).thenReturn("참여자2");
        when(p2.getOrigin()).thenReturn(origin2);

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
