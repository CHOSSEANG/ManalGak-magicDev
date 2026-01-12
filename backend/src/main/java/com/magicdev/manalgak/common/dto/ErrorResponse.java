package com.magicdev.manalgak.common.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {

    private final String code;
    private final String message;
    private final Object details;
}
