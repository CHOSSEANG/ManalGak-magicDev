package com.magicdev.manalgak.domain.route.service;

import com.magicdev.manalgak.common.cache.CacheKeys;
import com.magicdev.manalgak.common.cache.CacheTTL;
import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.common.util.CoordinateUtil;
import com.magicdev.manalgak.domain.algorithm.entity.MeetingCandidate;
import com.magicdev.manalgak.domain.algorithm.repository.MeetingCandidateRepository;
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

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final OdsayApiService odsayApiService;
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
        if (routes.isEmpty()) {
            return RouteResponse.RouteStatistics.builder().build();
        }

        int avgTime = (int) routes.stream()
                .mapToInt(RouteResponse.RouteInfo::getTravelTime)
                .average()
                .orElse(0);

        int maxTime = routes.stream()
                .mapToInt(RouteResponse.RouteInfo::getTravelTime)
                .max()
                .orElse(0);

        int minTime = routes.stream()
                .mapToInt(RouteResponse.RouteInfo::getTravelTime)
                .min()
                .orElse(0);

        int totalTransfers = routes.stream()
                .mapToInt(RouteResponse.RouteInfo::getTransferCount)
                .sum();

        Map<String, Long> transportCounts = routes.stream()
                .collect(Collectors.groupingBy(
                        RouteResponse.RouteInfo::getTransportType,
                        Collectors.counting()
                ));

        String mostFrequentTransport = transportCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("");

        return RouteResponse.RouteStatistics.builder()
                .averageTravelTime(avgTime)
                .maxTravelTime(maxTime)
                .minTravelTime(minTime)
                .totalTransfers(totalTransfers)
                .mostFrequentTransport(mostFrequentTransport)
                .build();
    }
}
