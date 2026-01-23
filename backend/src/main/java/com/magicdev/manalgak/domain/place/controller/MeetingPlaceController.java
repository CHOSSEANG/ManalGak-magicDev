package com.magicdev.manalgak.domain.place.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.place.dto.PlaceResponse;
import com.magicdev.manalgak.domain.place.dto.PlaceSelectRequest;
import com.magicdev.manalgak.domain.place.service.PlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/meetings/{meetingUuid}")
@RequiredArgsConstructor
@Tag(name = "Meeting Places", description = "모임 장소 추천 및 선택 API")
public class MeetingPlaceController {

    private final PlaceService placeService;

    @GetMapping("/places")
    @Operation(
            summary = "추천 장소 조회",
            description = "중간지점 기반으로 카카오 장소 검색 API를 호출하여 추천 장소를 조회합니다."
    )
    public ResponseEntity<CommonResponse<PlaceResponse>> getRecommendedPlaces(
            @PathVariable String meetingUuid,
            @Parameter(description = "목적: DINING, CAFE, CULTURE, TOUR")
            @RequestParam(defaultValue = "DINING") String purpose,
            @Parameter(description = "검색 개수")
            @RequestParam(defaultValue = "15") int limit
    ) {
        PlaceResponse response = placeService.getRecommendedPlaces(meetingUuid, purpose, limit);
        return ResponseEntity.ok(CommonResponse.success(response));
    }

    @PostMapping("/place/select")
    @Operation(
            summary = "장소 선택 저장",
            description = "사용자가 선택한 장소를 DB에 저장합니다."
    )
    public ResponseEntity<CommonResponse<PlaceResponse.Place>> selectPlace(
            @PathVariable String meetingUuid,
            @RequestBody PlaceSelectRequest request
    ) {
        PlaceResponse.Place selectedPlace = placeService.saveSelectedPlace(meetingUuid, request);
        return ResponseEntity.ok(CommonResponse.success(selectedPlace));
    }

    @GetMapping("/place")
    @Operation(
            summary = "선택된 장소 조회",
            description = "모임에서 선택된 장소를 조회합니다."
    )
    public ResponseEntity<CommonResponse<PlaceResponse.Place>> getSelectedPlace(
            @PathVariable String meetingUuid
    ) {
        PlaceResponse.Place selectedPlace = placeService.getSelectedPlace(meetingUuid);
        return ResponseEntity.ok(CommonResponse.success(selectedPlace));
    }
}