package com.magicdev.manalgak.domain.algorithm.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WeightedCoordinate extends Coordinate{
	private double weight; // 가중치 (1.0 = 기본, 2.0 = 2배 중요도)

	public WeightedCoordinate(double latitude, double longitude, double weight) {
		super(latitude, longitude);
		this.weight = weight;
	}
}
