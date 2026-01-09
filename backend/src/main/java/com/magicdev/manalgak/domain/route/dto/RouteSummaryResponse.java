package com.magicdev.manalgak.domain.route.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteSummaryResponse {
    private String summary;
    private String tips;
    private LocalDateTime generatedAt;
    private boolean fromCache;
}
