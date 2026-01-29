package com.magicdev.manalgak.domain.algorithm.dto;

import java.util.List;

import com.magicdev.manalgak.domain.odsay.dto.OdsayRouteResponse;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OptimalStationDetailResponse {
	private String stationName;
	private Integer lineNumber;
	private String stationCode;
	private Double latitude;
	private Double longitude;
	private Integer maxTravelTime;
	private Integer minTravelTime;
	private Integer timeDifference;
	private List<ParticipantTravelInfo> participantTravelInfos;

	@Getter
	@Builder
	public static class ParticipantTravelInfo {
		private String nickName;
		private Double originLatitude;
		private Double originLongitude;
		private Integer travelTimeMinutes;
		private List<OdsayRouteResponse.Path> paths;  // 🆕 경로 정보 추가
		private List<RouteSegment> routeSegments; // 정제된 경로 데이터
	}
}
