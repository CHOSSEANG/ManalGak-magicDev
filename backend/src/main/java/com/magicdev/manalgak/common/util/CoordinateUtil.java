package com.magicdev.manalgak.common.util;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;

public class CoordinateUtil {

    private CoordinateUtil(){}

    private static final double MIN_LAT = -90.0;
    private static final double MAX_LAT = 90.0;
    private static final double MIN_LNG = -180.0;
    private static final double MAX_LNG = 180.0;

    public static void validate(Double latitude, Double longitude){
        if(!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
            throw new BusinessException(ErrorCode.INVALID_COORDINATES);
        }
    }

    private static boolean isValidLatitude(Double latitude){
        return latitude != null
                && !latitude.isNaN()
                && latitude >= MIN_LAT
                && latitude <= MAX_LAT;
    }

    private static boolean isValidLongitude(Double longitude){
        return longitude != null
                && !longitude.isNaN()
                && longitude >= MIN_LNG
                && longitude <= MAX_LNG;
    }
}
