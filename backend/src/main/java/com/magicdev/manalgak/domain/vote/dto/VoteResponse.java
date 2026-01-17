package com.magicdev.manalgak.domain.vote.dto;

import com.magicdev.manalgak.domain.vote.entity.Vote;
import com.magicdev.manalgak.domain.vote.entity.VoteOption;
import com.magicdev.manalgak.domain.vote.entity.VoteRecord;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class VoteResponse {

    private Long voteId;
    private List<VoteOptionResponse> options;

    public static VoteResponse from(Vote vote, List<VoteOption> options, List<VoteRecord> records){
        List<VoteOptionResponse> optionResponses = options.stream()
                .map(option -> VoteOptionResponse.from(option, records))
                .toList();

        return new VoteResponse(vote.getId(), optionResponses);
    }
}
