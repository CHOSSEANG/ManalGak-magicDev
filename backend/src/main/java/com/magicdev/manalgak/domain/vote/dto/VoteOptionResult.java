package com.magicdev.manalgak.domain.vote.dto;

import com.magicdev.manalgak.domain.vote.entity.VoteOption;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class VoteOptionResult {

    private Long optionId;
    private String content;
    private int voteCount;

    public static VoteOptionResult from(VoteOption option) {
        return new VoteOptionResult(
                option.getId(),
                option.getContent(),
                option.getVoteCount()
        );
    }
}
