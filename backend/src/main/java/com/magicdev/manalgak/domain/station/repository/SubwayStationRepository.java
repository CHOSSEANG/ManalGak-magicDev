package com.magicdev.manalgak.domain.station.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.magicdev.manalgak.domain.station.entity.SubwayStation;

@Repository
public interface SubwayStationRepository extends JpaRepository<SubwayStation, Long> {
	// 모든 역 정보 조회 (거리 계산용)
	List<SubwayStation> findAll();

	// 특정 호선의 역만 조회
	List<SubwayStation> findByLineNumber(Integer lineNumber);

	// 경계 상자 내의 역만 조회 (성능 최적화)
	@Query("SELECT s FROM SubwayStation s WHERE s.latitude BETWEEN :minLat AND :maxLat AND s.longitude BETWEEN :minLng AND :maxLng")
	List<SubwayStation> findStationsInBoundingBox(
			@Param("minLat") double minLat,
			@Param("maxLat") double maxLat,
			@Param("minLng") double minLng,
			@Param("maxLng") double maxLng
	);
}
