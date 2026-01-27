package com.magicdev.manalgak.domain.algorithm.dto;

import java.util.List;

import com.magicdev.manalgak.domain.station.entity.SubwayStation;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StationWithTravelTimes {
	private SubwayStation station;
	private List<TravelTimeInfo> travelTimes;
	private Integer maxTime;
	private Integer minTime;
	private Integer timeDifference;
}
