package com.magicdev.manalgak.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommonResponse<T> {
    private T data;
    private boolean success;
    private ErrorResponse error;
    private MetaResponse meta;


    // 성공 응답
    public static <T> CommonResponse<T> success(T data) {
        return CommonResponse.<T>builder()
                .success(true)
                .data(data)
                .error(null)
                .meta(new MetaResponse())
                .build();
    }

    // 실패 응답
    public static CommonResponse<Void> fail(ErrorResponse error) {
        return CommonResponse.<Void>builder()
                .success(false)
                .data(null)
                .error(error)
                .meta(new MetaResponse())
                .build();
    }


}
