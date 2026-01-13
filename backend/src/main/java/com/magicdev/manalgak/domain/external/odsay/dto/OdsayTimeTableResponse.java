package com.magicdev.manalgak.domain.external.odsay.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class OdsayTimeTableResponse {
    private Result result;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Result {
        @JsonProperty("OrdList")
        private TimeList ordList;

        @JsonProperty("SatList")
        private TimeList satList;

        @JsonProperty("SunList")
        private TimeList sunList;

        private String laneName;
        private String stationName;
        private Integer stationID;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TimeList {
        private Direction up;
        private Direction down;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Direction {
        private List<TimeBlock> time;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TimeBlock {
        @JsonProperty("Idx")
        private Integer idx;  // Hour index (5 = 5 AM, 24 = 12 AM next day)

        private String list;  // Comma-separated time strings like "10(성수) 23(성수) 38(성수)"
    }
}
