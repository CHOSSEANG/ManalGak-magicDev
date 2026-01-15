package com.magicdev.manalgak.domain.vote.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "vote_options")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class VoteOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vote_id",nullable = false)
    private Vote vote;

    private String content;
    private int voteCount;

    public void increase() {
        this.voteCount++;
    }

    public void decrease() {
        if(this.voteCount>0){
            this.voteCount--;
        }
    }
}
