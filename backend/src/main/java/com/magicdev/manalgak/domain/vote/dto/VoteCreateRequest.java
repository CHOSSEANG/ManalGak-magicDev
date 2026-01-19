package com.magicdev.manalgak.domain.vote.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class VoteCreateRequest {
    private List<String> options;
}
