package com.magicdev.manalgak.domain.odsay.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.odsay.dto.LastTrainResponse;
import com.magicdev.manalgak.domain.odsay.service.LastTrainService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/meetings/{meetingUuid}/last-train")
@RequiredArgsConstructor
@Tag(name = "Last Train", description = "막차 정보 조회 API")
public class LastTrainController {

    private final LastTrainService lastTrainService;

    @GetMapping
    @Operation(
            summary = "막차 정보 조회",
            description = "특정 참여자와 후보지 간의 막차 정보를 조회합니다. Redis 캐싱을 통해 반복 조회시 성능이 향상됩니다."
    )
    public ResponseEntity<CommonResponse<LastTrainResponse>> getLastTrain(
            @PathVariable
            @Parameter(description = "모임 UUID", required = true)
            String meetingUuid,

            @RequestParam
            @Parameter(description = "참여자 ID", required = true)
            Long participantId,

            @RequestParam
            @Parameter(description = "후보지 ID", required = true)
            Long candidateId
    ) {
        LastTrainResponse response = lastTrainService.getLastTrain(meetingUuid, participantId, candidateId);
        return ResponseEntity.ok(CommonResponse.success(response));
    }
}