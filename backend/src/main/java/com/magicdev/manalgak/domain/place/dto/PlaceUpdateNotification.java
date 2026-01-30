package com.magicdev.manalgak.domain.place.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceUpdateNotification {
    private String type;
    private LocalDateTime timestamp;

    public static PlaceUpdateNotification cacheInvalidated() {
        return PlaceUpdateNotification.builder()
                .type("CACHE_INVALIDATED")
                .timestamp(LocalDateTime.now())
                .build();
    }
}