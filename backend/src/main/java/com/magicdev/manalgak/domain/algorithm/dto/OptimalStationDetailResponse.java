package com.magicdev.manalgak.domain.algorithm.dto;

import java.util.List;

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
	}
}
