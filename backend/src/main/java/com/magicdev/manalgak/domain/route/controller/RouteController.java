package com.magicdev.manalgak.domain.route.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.route.dto.RouteSummaryRequest;
import com.magicdev.manalgak.domain.route.dto.RouteSummaryResponse;
import com.magicdev.manalgak.domain.route.service.RouteSummaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/routes")
@RequiredArgsConstructor
@Tag(name = "Routes", description = "경로 관련 API")
public class RouteController {

    private final RouteSummaryService routeSummaryService;

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
}
