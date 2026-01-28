package com.magicdev.manalgak.domain.station.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subway_station")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SubwayStation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Integer lineNumber;  // 호선

	@Column(nullable = false)
	private String stationCode;  // 고유역번호

	@Column(nullable = false)
	private String stationName;  // 역명

	@Column(nullable = false)
	private Double latitude;  // 위도

	@Column(nullable = false)
	private Double longitude;  // 경도

	@Builder
	public SubwayStation(Integer lineNumber, String stationCode,
		String stationName, Double latitude, Double longitude) {
		this.lineNumber = lineNumber;
		this.stationCode = stationCode;
		this.stationName = stationName;
		this.latitude = latitude;
		this.longitude = longitude;
	}
}
