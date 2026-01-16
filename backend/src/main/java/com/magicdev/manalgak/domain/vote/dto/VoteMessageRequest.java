package com.magicdev.manalgak.domain.vote.dto;

import lombok.Getter;

@Getter
public class VoteMessageRequest {
    private Long voteId;
    private Long optionId;
}