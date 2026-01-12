package com.magicdev.manalgak.common.exception;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.common.dto.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<CommonResponse<Void>> handleBusinessException(BusinessException e){
        ErrorCode errorCode = e.getErrorCode();

        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(errorCode.name())
                .message(errorCode.getMessage())
                .details(null)
                .build();

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(CommonResponse.fail(errorResponse));
    }
}
