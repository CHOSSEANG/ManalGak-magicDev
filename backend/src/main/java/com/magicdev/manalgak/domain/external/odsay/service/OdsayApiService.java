package com.magicdev.manalgak.domain.external.odsay.service;

import com.magicdev.manalgak.common.exception.ExternalApiException;
import com.magicdev.manalgak.domain.external.odsay.client.OdsayClient;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayRouteRequest;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayRouteResponse;
import com.magicdev.manalgak.domain.route.dto.RouteResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OdsayApiService {

    private static final Logger log = LoggerFactory.getLogger(OdsayApiService.class);
    private static final int WALKING_TYPE = 3;
    private static final int SUBWAY_TYPE = 1;
    private static final int BUS_TYPE = 2;

    private final OdsayClient odsayClient;

    public RouteResponse.RouteInfo getRoute(Double startX, Double startY,
                                            Double endX, Double endY,
                                            String participantName) {
        OdsayRouteRequest request = OdsayRouteRequest.builder()
                .startX(startX)
                .startY(startY)
                .endX(endX)
                .endY(endY)
                .opt(0)
                .build();

        OdsayRouteResponse response = odsayClient.searchRoute(request);
        return convertToRouteInfo(response, participantName);
    }

    public List<RouteResponse.RouteInfo> getRoutesParallel(List<ParticipantRoute> participants,
                                                           Double destX, Double destY) {
        if (participants == null || participants.isEmpty()) {
            return List.of();
        }

        List<CompletableFuture<RouteResponse.RouteInfo>> futures = participants.stream()
                .map(participant -> CompletableFuture.supplyAsync(() ->
                        getRoute(
                                participant.startX(),
                                participant.startY(),
                                destX,
                                destY,
                                participant.participantName()
                        )))
                .toList();

        return futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList());
    }

    private RouteResponse.RouteInfo convertToRouteInfo(OdsayRouteResponse response,
                                                       String participantName) {
        if (response == null) {
            throw new ExternalApiException("ODsay response is null");
        }
        if (response.getError() != null && !response.getError().isNull()) {
            log.warn("ODsay error response for participant={}: {}", participantName, response.getError());
            throw new ExternalApiException("ODsay error response: " + response.getError());
        }
        if (response.getResult() == null || response.getResult().getPath() == null
                || response.getResult().getPath().isEmpty()) {
            log.warn("ODsay response missing path for participant={}: {}",
                    participantName, summarizeResponse(response));
            throw new ExternalApiException("No route found from ODsay API");
        }

        OdsayRouteResponse.Path firstPath = response.getResult().getPath().get(0);
        OdsayRouteResponse.Info info = firstPath.getInfo();

        int travelTime = info != null && info.getTotalTime() != null ? info.getTotalTime() : 0;
        int transferCount = 0;
        if (info != null) {
            transferCount = safeInt(info.getBusTransitCount()) + safeInt(info.getSubwayTransitCount());
        }

        String path = buildPathString(firstPath.getSubPath());
        String transportType = extractTransportType(firstPath.getSubPath());

        return RouteResponse.RouteInfo.builder()
                .participantName(participantName)
                .path(path)
                .travelTime(travelTime)
                .transferCount(transferCount)
                .transportType(transportType)
                .build();
    }

    private String buildPathString(List<OdsayRouteResponse.SubPath> subPaths) {
        if (subPaths == null || subPaths.isEmpty()) {
            return "";
        }

        List<String> segments = subPaths.stream()
                .filter(subPath -> subPath.getTrafficType() == null || subPath.getTrafficType() != WALKING_TYPE)
                .map(subPath -> {
                    String start = safeName(subPath.getStartName());
                    String end = safeName(subPath.getEndName());
                    if (start.isBlank() && end.isBlank()) {
                        return "";
                    }
                    return start + " -> " + end;
                })
                .filter(segment -> !segment.isBlank())
                .toList();

        return String.join(" -> ", segments);
    }

    private String extractTransportType(List<OdsayRouteResponse.SubPath> subPaths) {
        if (subPaths == null || subPaths.isEmpty()) {
            return "TRANSIT";
        }

        List<String> laneNames = new ArrayList<>();
        for (OdsayRouteResponse.SubPath subPath : subPaths) {
            if (subPath.getLane() == null) {
                continue;
            }
            subPath.getLane().stream()
                    .map(OdsayRouteResponse.Lane::getName)
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(name -> !name.isBlank())
                    .forEach(name -> {
                        if (!laneNames.contains(name)) {
                            laneNames.add(name);
                        }
                    });
        }

        if (!laneNames.isEmpty()) {
            return String.join(" + ", laneNames);
        }

        boolean hasSubway = subPaths.stream()
                .anyMatch(subPath -> subPath.getTrafficType() != null && subPath.getTrafficType() == SUBWAY_TYPE);
        boolean hasBus = subPaths.stream()
                .anyMatch(subPath -> subPath.getTrafficType() != null && subPath.getTrafficType() == BUS_TYPE);

        if (hasBus && hasSubway) {
            return "BUS+SUBWAY";
        }
        if (hasBus) {
            return "BUS";
        }
        if (hasSubway) {
            return "SUBWAY";
        }
        return "WALK";
    }

    private int safeInt(Integer value) {
        return value == null ? 0 : value;
    }

    private String safeName(String value) {
        return value == null ? "" : value.trim();
    }

    private String summarizeResponse(OdsayRouteResponse response) {
        String pathSummary = "null";
        if (response.getResult() != null && response.getResult().getPath() != null) {
            pathSummary = "size=" + response.getResult().getPath().size();
        }
        String errorSummary = response.getError() == null ? "null" : response.getError().toString();
        return "paths=" + pathSummary + ", error=" + errorSummary;
    }

    public record ParticipantRoute(String participantName, Double startX, Double startY) {
    }
}
