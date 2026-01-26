package com.magicdev.manalgak.domain.vote.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.vote.dto.VoteCreateRequest;
import com.magicdev.manalgak.domain.vote.dto.VoteMessageRequest;
import com.magicdev.manalgak.domain.vote.dto.VoteResponse;
import com.magicdev.manalgak.domain.vote.dto.VoteResultMessage;
import com.magicdev.manalgak.domain.vote.service.VoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/votes")
@Tag(name = "Vote", description = "투표 API")
public class VoteController {

    private final VoteService voteService;
    private final SimpMessagingTemplate messagingTemplate;
    @Operation(summary =  "투표 생성",
            description = "해당 모임에 대한 투표를 생성합니다.")
    @PostMapping("/meeting/{meetingUuid}")
    public CommonResponse<VoteResponse> createVote(
            @PathVariable String meetingUuid,
            @RequestBody VoteCreateRequest request
    ) {
        VoteResponse vote = voteService.createVote(meetingUuid, request.getOptions());

        return CommonResponse.success(vote);
    }

    @Operation(
            summary = "투표 조회",
            description = "투표 정보를 조회합니다.")
    @GetMapping("/meeting/{meetingUuid}")
    public CommonResponse<VoteResponse> getVoteByMeeting(
            @PathVariable String meetingUuid
    ) {
        VoteResponse vote = voteService.getVoteByMeetingUuid(meetingUuid);
        return CommonResponse.success(vote);
    }


    @Operation(summary = "투표 참여", description = "사용자가 특정 옵션에 투표합니다.")
    @PostMapping("/{voteId}")
    public CommonResponse<VoteResultMessage> vote(
            @PathVariable Long voteId,
            @RequestBody VoteMessageRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        VoteResultMessage result =
                voteService.vote(voteId, request.getOptionId(), userId);

        return CommonResponse.success(result);
    }
}
