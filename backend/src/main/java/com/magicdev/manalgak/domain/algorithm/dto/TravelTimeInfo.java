package com.magicdev.manalgak.domain.algorithm.dto;

import java.util.List;

import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;
import com.magicdev.manalgak.domain.odsay.dto.OdsayRouteResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TravelTimeInfo {
	private String participantName;
	private Coordinate origin;
	private Integer travelTimeMinutes;
	private List<OdsayRouteResponse.Path> paths;  // 🆕 경로 정보 추가
}
