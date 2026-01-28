package com.magicdev.manalgak.domain.odsay.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.odsay.dto.GetRouteRequest;
import com.magicdev.manalgak.domain.odsay.dto.OdsayRouteResponse;
import com.magicdev.manalgak.domain.odsay.service.OdsayService;
import com.magicdev.manalgak.domain.participant.service.ParticipantService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/odsay")
@RequiredArgsConstructor
@Tag(name = "Odsay API", description = "Odsay API")
public class OdsayController {

    private final OdsayService odsayService;

    @GetMapping("/route")
    @Operation(
            summary = "대중교통 길찾기 경로 조회"
    )
    public CommonResponse<OdsayRouteResponse> getRoute(
        @Parameter(description = "출발지 경도") @RequestParam Double startX,  
        @Parameter(description = "출발지 위도") @RequestParam Double startY,  
        @Parameter(description = "도착지 경도") @RequestParam Double endX,    
        @Parameter(description = "도착지 위도") @RequestParam Double endY,    
        @Parameter(description = "교통 수단 옵션 (0:지하철, 1:버스, 2:버스+지하철)") @RequestParam(required = false) String opt,  
        @Parameter(description = "검색 타입 (0:최적, 1:최소시간, 2:최소환승)") @RequestParam(required = false) String searchType,  
        @Parameter(description = "경로 타입 (0:최적경로, 1:대중교통우선)") @RequestParam(required = false) String searchPathType  
    ) {
        // 🔥 Request DTO 생성
        GetRouteRequest request = GetRouteRequest.builder()
            .startX(startX)
            .startY(startY)
            .endX(endX)
            .endY(endY)
            .opt(opt)
            .searchType(searchType)
            .searchPathType(searchPathType)
            .build();

        // 🔥 Service 호출
        OdsayRouteResponse response = odsayService.searchRoute(request);

        // 🔥 CommonResponse로 감싸서 반환
        return CommonResponse.success(response);
    }
}
