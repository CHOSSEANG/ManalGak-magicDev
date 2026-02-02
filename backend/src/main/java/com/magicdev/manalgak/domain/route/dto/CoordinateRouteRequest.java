package com.magicdev.manalgak.domain.route.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CoordinateRouteRequest {
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
}
