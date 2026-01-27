package com.magicdev.manalgak.domain.vote.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "voteOption", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VoteRecord> voteRecords = new ArrayList<>();

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

    public static VoteOption create(Vote vote, String content){
        VoteOption option = new VoteOption();
        option.vote = vote;
        option.content =content;
        option.voteCount = 0;
        return option;
    }

    public int getCount() {
        return this.voteCount;
    }
}
