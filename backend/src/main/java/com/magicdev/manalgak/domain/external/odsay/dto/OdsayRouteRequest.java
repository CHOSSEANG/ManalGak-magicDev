package com.magicdev.manalgak.domain.external.odsay.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OdsayRouteRequest {
    private Double startX;
    private Double startY;
    private Double endX;
    private Double endY;
    private Integer opt;
}
