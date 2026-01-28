package com.magicdev.manalgak.domain.algorithm.dto;

import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;

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
}
