package com.magicdev.manalgak.domain.vote.dto;

import com.magicdev.manalgak.domain.vote.entity.VoteOption;
import com.magicdev.manalgak.domain.vote.entity.VoteRecord;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class VoteResultMessage {

    private Long voteId;
    private List<OptionInfo> options;

    public VoteResultMessage(Long voteId, List<OptionInfo> options) {
        this.voteId = voteId;
        this.options = options;
    }

    public static VoteResultMessage from(Long voteId, List<VoteOption> optionList, List<VoteRecord> records) {
        List<OptionInfo> options = optionList.stream().map(option -> {
            List<ParticipantInfo> voters = records.stream()
                    .filter(r -> r.getVoteOption().getId().equals(option.getId()))
                    .map(r -> new ParticipantInfo(r.getParticipant().getId(), r.getParticipant().getNickName()))
                    .collect(Collectors.toList());

            return new OptionInfo(option.getId(), option.getContent(), option.getCount(), voters);
        }).collect(Collectors.toList());

        return new VoteResultMessage(voteId, options);
    }

    @Getter
    @NoArgsConstructor
    public static class OptionInfo {
        private Long optionId;
        private String content;
        private int voteCount;
        private List<ParticipantInfo> voters;

        public OptionInfo(Long optionId, String content, int voteCount, List<ParticipantInfo> voters) {
            this.optionId = optionId;
            this.content = content;
            this.voteCount = voteCount;
            this.voters = voters;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class ParticipantInfo {
        private Long participantId;
        private String nickname;

        public ParticipantInfo(Long participantId, String nickname) {
            this.participantId = participantId;
            this.nickname = nickname;
        }
    }
}
