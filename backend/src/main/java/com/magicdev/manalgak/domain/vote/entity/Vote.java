package com.magicdev.manalgak.domain.vote.entity;

import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "votes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;

    @OneToMany(mappedBy = "vote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VoteOption> voteOptions = new ArrayList<>();

    @OneToMany(mappedBy = "vote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VoteRecord> voteRecords = new ArrayList<>();


    public static Vote create(Meeting meeting) {
        Vote vote = new Vote();
        vote.meeting = meeting;
        return vote;
    }

}
