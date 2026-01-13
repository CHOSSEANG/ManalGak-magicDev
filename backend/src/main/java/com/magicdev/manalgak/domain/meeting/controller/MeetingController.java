package com.magicdev.manalgak.domain.meeting.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.meeting.dto.*;
import com.magicdev.manalgak.domain.meeting.service.MeetingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Meeting", description = "모임 API")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/v1/meetings")
public class MeetingController {

    private final MeetingService meetingService;

    @Operation(summary = "모임 생성", description = "새 모임을 생성합니다.")
    @PostMapping
    public CommonResponse<MeetingCreateResponse> createMeeting(
            @RequestBody MeetingCreateRequest request,
            @AuthenticationPrincipal Long userId
    ){
        return CommonResponse.success(meetingService.createMeeting(request, userId));
    }

    @Operation(summary = "모임 수정", description = "모임내용을 수정합니다.")
    @PatchMapping("/{meetingId}")
    public CommonResponse<MeetingResponse> updateMeeting(
            @RequestBody MeetingUpdateRequest request,
            @PathVariable Long meetingId,
            @AuthenticationPrincipal Long userId
    ){
        return CommonResponse.success(meetingService.updateMeeting(request,meetingId, userId));
    }

    @Operation(summary = "모임 삭제", description = "모임을 삭제합니다")
    @DeleteMapping("/{meetingId}")
    public CommonResponse<Void> deleteMeeting(
            @PathVariable Long meetingId,
            @AuthenticationPrincipal Long userId
    ){
        meetingService.deleteMeeting(meetingId, userId);
        return CommonResponse.success(null);
    }

//    @Operation(summary = "모임 조회", description = "모임을 상세 조회합니다")
//    @GetMapping("/{meetingId}")
//    public CommonResponse<MeetingResponse> getMeeting(
//            @PathVariable Long meetingId
//    ){
//        Meeting meeting = meetingService.getMeeting(meetingId);
//        return CommonResponse.success(meeting);
//    }
}
