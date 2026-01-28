package com.magicdev.manalgak.domain.odsay.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OdsayRouteResponse {
	private Result result;
	private Error error;  // 🆕 이거 추가!

	@Getter
	@Setter
	public static class Result {
		private List<Path> path;
		private Integer searchType;
		private Integer startRadius;
		private Integer endRadius;
		private Integer subwayCount;
		private Integer busCount;
		private Integer subwayBusCount;
		private Integer pointDistance;
		private Integer outTrafficCheck;
	}

	@Getter
	@Setter
	public static class Path {
		private Integer pathType;
		private List<SubPath> subPath;
		private Info info;
	}

	@Getter
	@Setter
	public static class SubPath {
		private Integer trafficType;
		private Integer distance;
		private Integer sectionTime;
		private List<Lane> lane;
		private Integer stationCount;
		private PassStopList passStopList;
		private String way;
		private Integer wayCode;
		private Double startX;
		private Double startY;
		private Integer startID;
		private String startName;
		private String endExitNo;
		private Double endExitX;
		private Double endExitY;
		private Double endX;
		private Double endY;
		private Integer endID;
		private String endName;
	}

	@Getter
	@Setter
	public static class Lane {
		// 지하철용 필드
		private String name;
		private Integer subwayCode;
		private Integer subwayCityCode;

		// 버스용 필드
		private String busNo;
		private Integer type;
		private Integer busID;
		private String busLocalBlID;
		private Integer busCityCode;
		private Integer busProviderCode;
	}

	@Getter
	@Setter
	public static class PassStopList {
		private List<Station> stations;
	}

	@Getter
	@Setter
	public static class Station {
		private Integer index;
		private String stationName;
		private Integer stationID;
		private Double x;
		private Double y;
	}

	@Getter
	@Setter
	public static class Info {
		private String mapObj;
		private Integer payment;
		private Integer busTransitCount;
		private Integer subwayTransitCount;
		private Integer busStationCount;
		private Integer subwayStationCount;
		private Integer totalStationCount;
		private Integer totalTime;
		private Integer totalWalk;
		private Integer trafficDistance;
		private Integer totalDistance;
		private String firstStartStation;
		private String lastEndStation;
		private Integer totalWalkTime;
	}

	// 🆕 Error 클래스 추가
	@Getter
	@Setter
	public static class Error {
		private String code;
		private String msg;
	}

}
