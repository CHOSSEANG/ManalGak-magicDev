package com.magicdev.manalgak.domain.vote.service;

import com.magicdev.manalgak.domain.vote.dto.VoteCreateRequest;
import com.magicdev.manalgak.domain.vote.dto.VoteResponse;
import com.magicdev.manalgak.domain.vote.dto.VoteResultMessage;
import com.magicdev.manalgak.domain.vote.entity.Vote;

import java.util.List;


public interface VoteService {

    VoteResponse createVote(Long meetingId, List<String> options);

    VoteResponse getVote(Long voteId);

    VoteResultMessage vote(Long voteId, Long optionId, Long userId);

    VoteResponse getVoteByMeetingId(Long meetingId);

}
