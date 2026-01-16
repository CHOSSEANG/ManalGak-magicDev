package com.magicdev.manalgak.domain.algorithm.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DistanceInfo {
	private Coordinate from;
	private Coordinate to;
	private double distanceKm;
}
