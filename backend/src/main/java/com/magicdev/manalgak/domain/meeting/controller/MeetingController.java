package com.magicdev.manalgak.domain.meeting.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.meeting.dto.*;
import com.magicdev.manalgak.domain.meeting.service.MeetingService;
import com.magicdev.manalgak.domain.participant.dto.ParticipantCreateRequest;
import com.magicdev.manalgak.domain.participant.dto.ParticipantUpdateRequest;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;
import com.magicdev.manalgak.domain.participant.service.ParticipantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Meeting", description = "모임 API")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/v1/meetings")
public class MeetingController {

    private final MeetingService meetingService;
    private final ParticipantService participantService;

    @Operation(summary = "모임 생성", description = "새 모임을 생성합니다.")
    @PostMapping
    public CommonResponse<MeetingCreateResponse> createMeeting(
            @RequestBody MeetingCreateRequest request,
            @AuthenticationPrincipal Long userId
    ){
        return CommonResponse.success(meetingService.createMeeting(request, userId));
    }

    @Operation(summary = "모임 수정", description = "모임내용을 수정합니다.")
    @PatchMapping("/{meetingUuid}")
    public CommonResponse<MeetingResponse> updateMeeting(
            @RequestBody MeetingUpdateRequest request,
            @PathVariable String meetingUuid,
            @AuthenticationPrincipal Long userId
    ){
        return CommonResponse.success(meetingService.updateMeeting(request,meetingUuid, userId));
    }

    @Operation(summary = "모임 삭제", description = "모임을 삭제합니다")
    @DeleteMapping("/{meetingUuid}")
    public CommonResponse<Void> deleteMeeting(
            @PathVariable String meetingUuid,
            @AuthenticationPrincipal Long userId
    ){
        meetingService.deleteMeeting(meetingUuid, userId);
        return CommonResponse.success(null);
    }

    @Operation(summary = "모임 조회", description = "해당 모임을 상세 조회합니다.")
    @GetMapping("/{meetingUuid}")
    public CommonResponse<MeetingDetailResponse> getMeeting(
            @PathVariable String meetingUuid
    ){
        MeetingDetailResponse meeting = meetingService.getMeeting(meetingUuid);
        return CommonResponse.success(meeting);
    }

    @Operation(summary = "모임 전체 조회", description = "해당 유저의 전체 모임을 조회합니다.")
    @GetMapping("/user")
    public CommonResponse<List<MeetingAllResponse>> getAllMeeting(
            @AuthenticationPrincipal Long userId
    ){
        List<MeetingAllResponse> allMeetings = meetingService.getAllMeetings(userId);
        return CommonResponse.success(allMeetings);
    }

    @Operation(summary = "모임 참여", description = "모임에 참여합니다.")
    @PostMapping("/{meetingUuid}/participants")
    public CommonResponse<ParticipantResponse> joinMeeting(@PathVariable String meetingUuid,
                                                            @RequestBody ParticipantCreateRequest request,
                                                            @AuthenticationPrincipal Long userId){
        return CommonResponse.success(participantService.joinMeeting(meetingUuid,userId, request));
    }

    @Operation(summary = "참여자 수정", description = "참여자의 정보를 수정합니다.")
    @PatchMapping("/{meetingUuid}/participants/{participantId}")
    public CommonResponse<ParticipantResponse> updateParticipant(@PathVariable String meetingUuid,
                                                                 @PathVariable Long participantId,
                                                                 @RequestBody ParticipantUpdateRequest request,
                                                                 @AuthenticationPrincipal Long userId){
        return CommonResponse.success(participantService.updateParticipant(meetingUuid, participantId, userId, request));
    }

    @Operation(summary = "모임 복사", description = "기존 모임 정보를 복사하여 새로운 모임을 생성합니다.")
    @PostMapping("/{meetingUuid}/copy")
    public CommonResponse<MeetingCopyResponse> copyMeeting(@PathVariable String meetingUuid,
                                                           @AuthenticationPrincipal Long userId){
        return CommonResponse.success(meetingService.copyMeeting(meetingUuid,userId));
    }
}
