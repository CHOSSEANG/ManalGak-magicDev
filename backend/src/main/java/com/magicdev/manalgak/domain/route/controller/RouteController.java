package com.magicdev.manalgak.domain.route.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.route.dto.MapRouteResponse;
import com.magicdev.manalgak.domain.route.dto.RouteSummaryRequest;
import com.magicdev.manalgak.domain.route.dto.RouteSummaryResponse;
import com.magicdev.manalgak.domain.route.service.MapRouteService;
import com.magicdev.manalgak.domain.route.service.RouteSummaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/routes")
@RequiredArgsConstructor
@Tag(name = "Routes", description = "경로 관련 API")
public class RouteController {

    private final RouteSummaryService routeSummaryService;
    private final MapRouteService mapRouteService;

    @PostMapping("/summarize")
    @Operation(
            summary = "경로 AI 요약",
            description = "여러 참여자의 경로 정보를 AI로 요약합니다."
    )
    public ResponseEntity<CommonResponse<RouteSummaryResponse>> summarizeRoutes(
            @RequestParam String meetingUuid,
            @RequestBody @Valid RouteSummaryRequest request
    ) {
        RouteSummaryResponse response = routeSummaryService.summarizeRoutes(meetingUuid, request);
        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @GetMapping("/map/{meetingUuid}")
    @Operation(
            summary = "지도 경로 조회",
            description = "Step4 지도에 표시할 참여자 출발지 → 중간지점 도로 경로를 조회합니다."
    )
    public ResponseEntity<CommonResponse<MapRouteResponse>> getMapRoutes(
            @PathVariable String meetingUuid
    ) {
        MapRouteResponse response = mapRouteService.getMapRoutes(meetingUuid);
        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @GetMapping("/map/{meetingUuid}/place")
    @Operation(
            summary = "지도 경로 조회 (확정 장소)",
            description = "Step6 지도에 표시할 참여자 출발지 → 확정 장소 도로 경로를 조회합니다."
    )
    public ResponseEntity<CommonResponse<MapRouteResponse>> getMapRoutesToPlace(
            @PathVariable String meetingUuid,
            @RequestParam double destLat,
            @RequestParam double destLng,
            @RequestParam String placeName
    ) {
        MapRouteResponse response = mapRouteService.getMapRoutesToPlace(
                meetingUuid, destLat, destLng, placeName
        );
        return ResponseEntity.ok(CommonResponse.success(response));
    }
}
