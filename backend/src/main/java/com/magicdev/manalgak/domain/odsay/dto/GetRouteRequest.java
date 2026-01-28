package com.magicdev.manalgak.domain.odsay.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetRouteRequest {
	// 필수 파라미터
	private Double startX;  // 출발지 경도 (longitude)
	private Double startY;  // 출발지 위도 (latitude)
	private Double endX;    // 도착지 경도
	private Double endY;    // 도착지 위도

	// 선택적 파라미터
	private String opt;            // 0:지하철, 1:버스, 2:버스+지하철 (기본값: null)
	private String searchType;     // 0:최적, 1:최소시간, 2:최소환승 (기본값: 0)
	private String searchPathType; // 0:최적경로, 1:대중교통우선 (기본값: 0)
}
