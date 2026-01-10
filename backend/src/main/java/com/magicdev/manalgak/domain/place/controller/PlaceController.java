package com.magicdev.manalgak.domain.place.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.place.dto.PlaceResponse;
import com.magicdev.manalgak.domain.place.dto.PlaceSummaryResponse;
import com.magicdev.manalgak.domain.place.service.PlaceService;
import com.magicdev.manalgak.domain.place.service.PlaceSummaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/meetings/{meetingUuid}/candidates/{candidateId}")
@RequiredArgsConstructor
@Tag(name = "Places", description = "장소 관련 API")
public class PlaceController {

    private final PlaceSummaryService placeSummaryService;
    private final PlaceService placeService;

    @GetMapping
    @Operation(
            summary = "장소 추천",
            description = "카카오 장소 검색 API로 장소를 추천합니다."
    )
    public ResponseEntity<CommonResponse<PlaceResponse>> getRecommendedPlaces(
            @PathVariable String meetingUuid,
            @PathVariable Long candidateId,
            @Parameter(description = "목적: DINING, CAFE") @RequestParam(defaultValue = "DINING") String purpose,
            @Parameter(description = "검색 개수") @RequestParam(defaultValue = "5") int limit
    ) {
        PlaceResponse response = placeService.getRecommendedPlaces(meetingUuid, candidateId, purpose, limit);
        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @GetMapping("/summary")
    @Operation(
            summary = "AI 장소 요약",
            description = "추천된 장소 목록을 AI로 요약합니다."
    )
    public ResponseEntity<CommonResponse<PlaceSummaryResponse>> summarizePlaces(
            @PathVariable String meetingUuid,
            @PathVariable Long candidateId,
            @Parameter(description = "톤: friendly, professional, casual") @RequestParam(defaultValue = "friendly") String tone
    ) {
        PlaceSummaryResponse response = placeSummaryService.summarizePlaces(meetingUuid, candidateId, tone);
        return ResponseEntity.ok(CommonResponse.success(response));
    }
}
