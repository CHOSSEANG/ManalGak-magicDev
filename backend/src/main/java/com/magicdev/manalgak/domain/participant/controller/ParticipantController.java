package com.magicdev.manalgak.domain.participant.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.odsay.dto.LastTrainResponse;
import com.magicdev.manalgak.domain.odsay.service.LastTrainService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/meetings/{meetingUuid}/participants/{participantId}/last-train")
@RequiredArgsConstructor
@Tag(name = "Participants", description = "참여자 관련 API")
public class ParticipantController {

    private final LastTrainService lastTrainService;

    @GetMapping("/candidates/{candidateId}")
    @Operation(
            summary = "막차 조회",
            description = "특정 참여자의 막차 정보를 조회합니다."
    )
    public ResponseEntity<CommonResponse<LastTrainResponse>> getLastTrain(
            @PathVariable String meetingUuid,
            @PathVariable Long participantId,
            @PathVariable Long candidateId
    ) {
        LastTrainResponse response = lastTrainService.getLastTrain(participantId, candidateId);
        return ResponseEntity.ok(CommonResponse.success(response));
    }
}
