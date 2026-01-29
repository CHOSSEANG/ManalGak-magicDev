package com.magicdev.manalgak.domain.algorithm.dto;

import java.util.List;

import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RouteSegment {
	private String type;  // "WALK", "SUBWAY", "BUS"
	private List<Coordinate> coordinates;  // 좌표 배열
	private String lineName;  // 지하철/버스 노선명
	private Integer lineNumber;  // 호선 번호 (지하철만)
	private Integer distance;  // 거리(m)
	private Integer sectionTime;  // 구간 소요시간(분)
}
