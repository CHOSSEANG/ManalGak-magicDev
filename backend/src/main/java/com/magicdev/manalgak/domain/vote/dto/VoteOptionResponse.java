package com.magicdev.manalgak.domain.vote.dto;

import com.magicdev.manalgak.domain.vote.entity.VoteOption;
import com.magicdev.manalgak.domain.vote.entity.VoteRecord;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class VoteOptionResponse {
    private Long optionId;
    private String content;
    private int voteCount;
    private List<VoteResultMessage.ParticipantInfo> voters;

    public static VoteOptionResponse from(VoteOption option, List<VoteRecord> records){
        List<VoteResultMessage.ParticipantInfo> voters = records.stream()
                .filter(r -> r.getVoteOption().getId().equals(option.getId()))
                .map(r -> new VoteResultMessage.ParticipantInfo(
                        r.getParticipant().getId(),
                        r.getParticipant().getNickName()
                ))
                .toList();
        return new VoteOptionResponse(
                option.getId(),
                option.getContent(),
                option.getVoteCount(),
                voters
        );
    }
}
