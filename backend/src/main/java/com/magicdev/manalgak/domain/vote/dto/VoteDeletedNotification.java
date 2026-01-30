package com.magicdev.manalgak.domain.vote.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 투표 삭제 알림 DTO
 * - 장소 변경 시 기존 투표가 삭제되었음을 클라이언트에 알림
 */
@Getter
@AllArgsConstructor
public class VoteDeletedNotification {

    private String type;
    private String message;

    public static VoteDeletedNotification deleted() {
        return new VoteDeletedNotification("VOTE_DELETED", "장소가 변경되어 기존 투표가 삭제되었습니다.");
    }
}