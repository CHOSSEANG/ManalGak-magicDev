package com.magicdev.manalgak.domain.algorithm.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Coordinate {
	private double latitude; // 위도
	private double longitude; // 경도

	@Override
	public String toString() {
		return String.format("%.8f,%.8f", latitude, longitude);
	}
}
