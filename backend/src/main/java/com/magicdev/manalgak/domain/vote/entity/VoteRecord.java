package com.magicdev.manalgak.domain.vote.entity;

import com.magicdev.manalgak.domain.participant.entity.Participant;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "vote_records",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_vote_participant",
                        columnNames = {"vote_id", "participant_id"}
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VoteRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vote_id",nullable = false)
    private Vote vote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id",nullable = false)
    private VoteOption voteOption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id",nullable = false)
    private Participant participant;

    public void changeOption(VoteOption option){
        this.voteOption = option;
    }

    public static VoteRecord create(Vote vote, VoteOption option, Participant participant) {
        VoteRecord record = new VoteRecord();
        record.vote = vote;
        record.voteOption = option;
        record.participant = participant;
        return record;
    }
}
