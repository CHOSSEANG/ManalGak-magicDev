package com.magicdev.manalgak.common.util;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;

import java.util.UUID;

public final class UuidGenerator {

    private UuidGenerator(){}

    // UUID 생성
    public static String generate(){
        return UUID.randomUUID().toString();
    }

    // UUID 문자열 검증
    public static boolean isValid(String uuid){
        if(uuid == null || uuid.isBlank()){
            return false;
        }
        try {
            UUID.fromString(uuid);
            return true;
        } catch (IllegalArgumentException e){
            return false;
        }
    }

    public static UUID parse(String uuid){
       if(!isValid(uuid)){
           throw new BusinessException(ErrorCode.INVALID_UUID);
       }
       return UUID.fromString(uuid);
    }
}
