package com.magicdev.manalgak.common.util;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class DateTimeUtil {

    private static final ZoneId DEFAULT_ZONE = ZoneId.of("Asia/Seoul");

    private DateTimeUtil(){}

    // 현재 시간
    public static LocalDateTime now(){
        return LocalDateTime.now(DEFAULT_ZONE);
    }

    // 만료 여부 판단
    public static boolean isExpired(LocalDateTime expiredAt){
        if(expiredAt == null){
            throw new BusinessException(ErrorCode.INVALID_TIME);
        }
        return expiredAt.isBefore(now());
    }
}
