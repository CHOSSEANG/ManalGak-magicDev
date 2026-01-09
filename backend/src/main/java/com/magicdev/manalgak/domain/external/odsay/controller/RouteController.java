package com.magicdev.manalgak.domain.external.odsay.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.route.dto.RouteResponse;
import com.magicdev.manalgak.domain.route.service.RouteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController("odsayRouteController")
@RequestMapping("/api/v1/meetings/{meetingUuid}/candidates/{candidateId}/routes")
@RequiredArgsConstructor
@Tag(name = "ODsay Routes", description = "ODsay 경로 조회 API")
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    @Operation(
            summary = "경로 조회",
            description = "후보지별 모든 참여자의 경로 정보를 조회합니다."
    )
    public ResponseEntity<CommonResponse<RouteResponse>> getRoutes(
            @PathVariable String meetingUuid,
            @PathVariable Long candidateId
    ) {
        RouteResponse response = routeService.getRoutes(meetingUuid, candidateId);
        return ResponseEntity.ok(CommonResponse.success(response));
    }
}
