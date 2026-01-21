package com.magicdev.manalgak.domain.geocoding.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class KakaoGeoResponse {
    private List<Document> documents;
    private Meta meta;

    @Data
    public static class Document {
        private Address address;

        @JsonProperty("address_name")
        private String addressName;

        @JsonProperty("address_type")
        private String addressType;

        @JsonProperty("road_address")
        private RoadAddress roadAddress;

        private String x;
        private String y;
    }

    @Data
    public static class Address {
        @JsonProperty("address_name")
        private String addressName;

        @JsonProperty("b_code")
        private String bCode;

        @JsonProperty("h_code")
        private String hCode;

        @JsonProperty("main_address_no")
        private String mainAddressNo;

        @JsonProperty("mountain_yn")
        private String mountainYn;

        @JsonProperty("region_1depth_name")
        private String region1depthName;

        @JsonProperty("region_2depth_name")
        private String region2depthName;

        @JsonProperty("region_3depth_h_name")
        private String region3depthHName;

        @JsonProperty("region_3depth_name")
        private String region3depthName;

        @JsonProperty("sub_address_no")
        private String subAddressNo;

        private String x;
        private String y;
    }

    @Data
    public static class RoadAddress {
        @JsonProperty("address_name")
        private String addressName;

        @JsonProperty("building_name")
        private String buildingName;

        @JsonProperty("main_building_no")
        private String mainBuildingNo;

        @JsonProperty("region_1depth_name")
        private String region1depthName;

        @JsonProperty("region_2depth_name")
        private String region2depthName;

        @JsonProperty("region_3depth_name")
        private String region3depthName;

        @JsonProperty("road_name")
        private String roadName;

        @JsonProperty("sub_building_no")
        private String subBuildingNo;

        @JsonProperty("underground_yn")
        private String undergroundYn;

        private String x;
        private String y;

        @JsonProperty("zone_no")
        private String zoneNo;
    }

    @Data
    public static class Meta {
        @JsonProperty("is_end")
        private boolean isEnd;

        @JsonProperty("pageable_count")
        private int pageableCount;

        @JsonProperty("total_count")
        private int totalCount;
    }
}
