package com.magicdev.manalgak.common.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MetaResponse {

    private final LocalDateTime time;

    public MetaResponse() {
        this.time = LocalDateTime.now();
    }
}
