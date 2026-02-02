package com.magicdev.manalgak.domain.vote.service;

import com.magicdev.manalgak.domain.vote.dto.VoteCreateRequest;
import com.magicdev.manalgak.domain.vote.dto.VoteResponse;
import com.magicdev.manalgak.domain.vote.dto.VoteResultMessage;
import com.magicdev.manalgak.domain.vote.entity.Vote;

import java.util.List;


public interface VoteService {

    VoteResponse createVote(String meetingUuid, List<String> options);

    VoteResponse getVote(Long voteId);

    VoteResultMessage vote(Long voteId, Long optionId, Long userId);

    VoteResponse getVoteByMeetingUuid(String meetingUuid);

    /**
     * 모임의 투표 삭제 (장소 변경 시 호출)
     * @param meetingUuid 모임 UUID
     * @return 삭제 여부 (투표가 있었으면 true)
     */
    boolean deleteVoteByMeetingUuid(String meetingUuid);

}
