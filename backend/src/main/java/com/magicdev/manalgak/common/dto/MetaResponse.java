package com.magicdev.manalgak.common.dto;

import com.magicdev.manalgak.common.util.DateTimeUtil;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MetaResponse {

    private final LocalDateTime time;

    public MetaResponse() {
        this.time = DateTimeUtil.now();
    }
}
