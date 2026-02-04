package com.magicdev.manalgak.domain.route.service;

import com.magicdev.manalgak.common.cache.CacheKeys;
import com.magicdev.manalgak.common.cache.CacheTTL;
import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.common.util.CoordinateUtil;
import com.magicdev.manalgak.domain.algorithm.entity.MeetingCandidate;
import com.magicdev.manalgak.domain.algorithm.repository.MeetingCandidateRepository;
import com.magicdev.manalgak.domain.external.kakao.service.KakaoMapsApiService;
import com.magicdev.manalgak.domain.external.odsay.service.OdsayApiService;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.repository.ParticipantRepository;
import com.magicdev.manalgak.domain.route.dto.RouteResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final OdsayApiService odsayApiService;
    private final KakaoMapsApiService kakaoMapsApiService;
    private final ObjectProvider<MeetingCandidateRepository> meetingCandidateRepositoryProvider;
    private final ObjectProvider<ParticipantRepository> participantRepositoryProvider;
    private final ObjectProvider<MeetingRepository> meetingRepositoryProvider;

    public RouteResponse getRoutes(String meetingUuid, Long candidateId) {
        String cacheKey = CacheKeys.routesKey(meetingUuid, candidateId);

        RouteResponse cached = getCachedRoutes(cacheKey);
        if (cached != null) {
            log.info("Cache HIT: {}", cacheKey);
            return cached;
        }

        log.info("Cache MISS: {}, calling ODsay API", cacheKey);
        RouteResponse response = callOdsayApi(meetingUuid, candidateId);

        saveRoutesToCache(cacheKey, response);

        return response;
    }

    private RouteResponse getCachedRoutes(String cacheKey) {
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            return cached != null ? (RouteResponse) cached : null;
        } catch (Exception e) {
            log.warn("Failed to get from cache: {}", e.getMessage());
            return null;
        }
    }

    private RouteResponse callOdsayApi(String meetingUuid, Long candidateId) {
        MeetingCandidateRepository candidateRepository = meetingCandidateRepositoryProvider.getIfAvailable();
        ParticipantRepository participantRepository = participantRepositoryProvider.getIfAvailable();
        MeetingRepository meetingRepository = meetingRepositoryProvider.getIfAvailable();

        if (candidateRepository == null || participantRepository == null || meetingRepository == null) {
            throw new BusinessException("Route data source is not configured", ErrorCode.INTERNAL_SERVER_ERROR);
        }

        MeetingCandidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CANDIDATE_NOT_FOUND));

        CoordinateUtil.validate(candidate.getLatitude(), candidate.getLongitude());

        // meetingUuid로 Meeting 조회 후 meetingId로 participants 조회
        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        List<Participant> participants = participantRepository.findByMeetingId(meeting.getId());
        if (participants == null || participants.isEmpty()) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PARTICIPANTS);
        }

        List<OdsayApiService.ParticipantRoute> participantRoutes = participants.stream()
                .map(participant -> {
                    Double latitude = participant.getOrigin().getLatitude().doubleValue();
                    Double longitude = participant.getOrigin().getLongitude().doubleValue();
                    CoordinateUtil.validate(latitude, longitude);
                    return new OdsayApiService.ParticipantRoute(
                            participant.getNickName(),
                            longitude,
                            latitude
                    );
                })
                .toList();

        List<RouteResponse.RouteInfo> routes = odsayApiService.getRoutesParallel(
                participantRoutes,
                candidate.getLongitude(),
                candidate.getLatitude()
        );
        RouteResponse.RouteStatistics statistics = calculateStatistics(routes);

        return RouteResponse.builder()
                .routes(routes)
                .statistics(statistics)
                .build();
    }

    public RouteResponse calculateRoutesByCoordinate(
            String meetingUuid,
            Double destLat,
            Double destLng
    ) {
        MeetingRepository meetingRepository = meetingRepositoryProvider.getIfAvailable();
        ParticipantRepository participantRepository = participantRepositoryProvider.getIfAvailable();

        if (meetingRepository == null || participantRepository == null) {
            throw new BusinessException("Route data source is not configured", ErrorCode.INTERNAL_SERVER_ERROR);
        }

        CoordinateUtil.validate(destLat, destLng);

        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        List<Participant> participants = participantRepository.findByMeetingId(meeting.getId());
        if (participants == null || participants.isEmpty()) {
            throw new BusinessException(ErrorCode.INSUFFICIENT_PARTICIPANTS);
        }

        List<Participant> validParticipants = participants.stream()
                .filter(p -> p.getOrigin() != null
                        && p.getOrigin().getLatitude() != null
                        && p.getOrigin().getLongitude() != null)
                .toList();

        List<Participant> publicParticipants = validParticipants.stream()
                .filter(p -> p.getType() == Participant.TransportType.PUBLIC
                        || p.getType() == null)
                .toList();

        List<Participant> carParticipants = validParticipants.stream()
                .filter(p -> p.getType() == Participant.TransportType.CAR)
                .toList();

        // WALK 참여자는 프론트엔드에서 walkingMinutes로 별도 처리 (ODsay/Kakao API 호출 불필요)

        List<RouteResponse.RouteInfo> publicRoutes = List.of();
        if (!publicParticipants.isEmpty()) {
            List<OdsayApiService.ParticipantRoute> odsayRequests = publicParticipants.stream()
                    .map(p -> new OdsayApiService.ParticipantRoute(
                            p.getNickName(),
                            p.getOrigin().getLongitude().doubleValue(),
                            p.getOrigin().getLatitude().doubleValue()
                    ))
                    .toList();

            publicRoutes = odsayApiService.getRoutesParallel(
                    odsayRequests,
                    destLng,
                    destLat
            );
        }

        List<RouteResponse.CarRouteInfo> carRoutes = List.of();
        if (!carParticipants.isEmpty()) {
            List<KakaoMapsApiService.ParticipantOrigin> carRequests = carParticipants.stream()
                    .map(p -> new KakaoMapsApiService.ParticipantOrigin(
                            p.getId(),
                            p.getNickName(),
                            p.getUser() != null ? p.getUser().getProfileImageUrl() : null,
                            p.getOrigin().getLatitude().doubleValue(),
                            p.getOrigin().getLongitude().doubleValue()
                    ))
                    .toList();

            List<KakaoMapsApiService.ParticipantCarRoute> carResults =
                    kakaoMapsApiService.getCarRoutesParallel(carRequests, destLat, destLng);

            carRoutes = carResults.stream()
                    .map(r -> RouteResponse.CarRouteInfo.builder()
                            .participantId(r.getParticipantId())
                            .participantName(r.getParticipantName())
                            .profileImageUrl(r.getProfileImageUrl())
                            .transportType("CAR")
                            .travelTime(r.getTravelTime())
                            .distance(r.getDistance())
                            .build())
                    .toList();
        }

        RouteResponse.RouteStatistics statistics = calculateStatistics(publicRoutes, carRoutes);

        return RouteResponse.builder()
                .routes(publicRoutes)
                .carRoutes(carRoutes)
                .statistics(statistics)
                .build();
    }

    private void saveRoutesToCache(String cacheKey, RouteResponse response) {
        try {
            redisTemplate.opsForValue().set(
                    cacheKey,
                    response,
                    CacheTTL.ROUTES
            );
            log.info("Saved to cache: {}", cacheKey);
        } catch (Exception e) {
            log.error("Failed to save to cache: {}", e.getMessage());
        }
    }

    private RouteResponse.RouteStatistics calculateStatistics(List<RouteResponse.RouteInfo> routes) {
        return calculateStatistics(routes, List.of());
    }

    private RouteResponse.RouteStatistics calculateStatistics(
            List<RouteResponse.RouteInfo> routes,
            List<RouteResponse.CarRouteInfo> carRoutes
    ) {
        List<RouteResponse.RouteInfo> safeRoutes = routes == null ? List.of() : routes;
        List<RouteResponse.CarRouteInfo> safeCarRoutes = carRoutes == null ? List.of() : carRoutes;

        if (safeRoutes.isEmpty() && safeCarRoutes.isEmpty()) {
            return RouteResponse.RouteStatistics.builder().build();
        }

        IntSummaryStatistics travelTimeStats = IntStream.concat(
                safeRoutes.stream().mapToInt(RouteResponse.RouteInfo::getTravelTime),
                safeCarRoutes.stream().mapToInt(RouteResponse.CarRouteInfo::getTravelTime)
        ).summaryStatistics();

        int totalTransfers = safeRoutes.stream()
                .mapToInt(RouteResponse.RouteInfo::getTransferCount)
                .sum();

        Map<String, Long> transportCounts = safeRoutes.stream()
                .collect(Collectors.groupingBy(
                        RouteResponse.RouteInfo::getTransportType,
                        Collectors.counting()
                ));

        safeCarRoutes.stream()
                .map(RouteResponse.CarRouteInfo::getTransportType)
                .forEach(type -> transportCounts.merge(type, 1L, Long::sum));

        String mostFrequentTransport = transportCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("");

        return RouteResponse.RouteStatistics.builder()
                .averageTravelTime((int) travelTimeStats.getAverage())
                .maxTravelTime(travelTimeStats.getMax())
                .minTravelTime(travelTimeStats.getMin())
                .totalTransfers(totalTransfers)
                .mostFrequentTransport(mostFrequentTransport)
                .build();
    }
}
