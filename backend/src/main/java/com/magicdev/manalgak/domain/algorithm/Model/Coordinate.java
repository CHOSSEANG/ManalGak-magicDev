package com.magicdev.manalgak.domain.algorithm.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Coordinate {
	private double latitude; // 위도
	private double longitude; // 경도

	// DB에서 가져온 문자열 파싱용 생성자
	public Coordinate(String coordinateString) {
		String[] parts = coordinateString.split(",");
		this.latitude = Double.parseDouble(parts[0]);
		this.longitude = Double.parseDouble(parts[1]);
	}

	@Override
	public String toString() {
		return String.format("%.8f,%.8f", latitude, longitude);
	}
}
