package com.magicdev.manalgak.domain.external.odsay.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OdsayTimeTableRequest {
    private String stationID;
    private Integer wayCode;
    private Integer showOff;
}
