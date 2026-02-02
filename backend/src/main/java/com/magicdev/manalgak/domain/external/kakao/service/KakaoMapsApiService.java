package com.magicdev.manalgak.domain.external.kakao.service;

import com.magicdev.manalgak.domain.external.kakao.client.KakaoMapsClient;
import com.magicdev.manalgak.domain.external.kakao.dto.KakaoDirectionsRequest;
import com.magicdev.manalgak.domain.external.kakao.dto.KakaoDirectionsResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoMapsApiService {

    private static final int API_TIMEOUT_SECONDS = 10;

    private final KakaoMapsClient kakaoMapsClient;

    public CarRouteResult getCarRoute(
            double originLat, double originLng,
            double destLat, double destLng
    ) {
        KakaoDirectionsRequest request = KakaoDirectionsRequest.builder()
                .originLat(originLat)
                .originLng(originLng)
                .destinationLat(destLat)
                .destinationLng(destLng)
                .priority("RECOMMEND")
                .build();

        KakaoDirectionsResponse response = kakaoMapsClient.getDirections(request);

        if (response == null || !response.isSuccess()) {
            return null;
        }

        return CarRouteResult.builder()
                .durationMinutes(response.getDurationInMinutes())
                .distanceMeters(response.getDistanceInMeters())
                .build();
    }

    public List<ParticipantCarRoute> getCarRoutesParallel(
            List<ParticipantOrigin> participants,
            double destLat, double destLng
    ) {
        if (participants == null || participants.isEmpty()) {
            return List.of();
        }

        List<CompletableFuture<ParticipantCarRoute>> futures = participants.stream()
                .map(p -> CompletableFuture.supplyAsync(() -> {
                    CarRouteResult result = getCarRoute(
                            p.originLat(),
                            p.originLng(),
                            destLat,
                            destLng
                    );

                    if (result == null) {
                        return null;
                    }

                    return ParticipantCarRoute.builder()
                            .participantId(p.participantId())
                            .participantName(p.participantName())
                            .profileImageUrl(p.profileImageUrl())
                            .travelTime(result.getDurationMinutes())
                            .distance(result.getDistanceMeters())
                            .build();
                }))
                .toList();

        return futures.stream()
                .map(f -> {
                    try {
                        return f.get(API_TIMEOUT_SECONDS, TimeUnit.SECONDS);
                    } catch (TimeoutException e) {
                        log.warn("카카오 모빌리티 API 타임아웃: {}", e.getMessage());
                        return null;
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        log.warn("카카오 모빌리티 API 호출 인터럽트: {}", e.getMessage());
                        return null;
                    } catch (ExecutionException e) {
                        log.warn("카카오 모빌리티 API 실행 오류: {}", e.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Builder
    @Getter
    public static class CarRouteResult {
        private int durationMinutes;
        private int distanceMeters;
    }

    public record ParticipantOrigin(
            Long participantId,
            String participantName,
            String profileImageUrl,
            double originLat,
            double originLng
    ) {
    }

    @Builder
    @Getter
    public static class ParticipantCarRoute {
        private Long participantId;
        private String participantName;
        private String profileImageUrl;
        private int travelTime;
        private int distance;
    }
}
