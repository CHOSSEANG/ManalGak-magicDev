package com.magicdev.manalgak.domain.geocoding.service;

import com.magicdev.manalgak.domain.geocoding.dto.GeoPoint;

public interface GeocodingService {
    GeoPoint geocode(String address);
}