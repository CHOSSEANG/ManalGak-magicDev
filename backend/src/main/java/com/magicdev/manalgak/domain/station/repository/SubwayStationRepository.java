package com.magicdev.manalgak.domain.station.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.magicdev.manalgak.domain.station.entity.SubwayStation;

@Repository
public interface SubwayStationRepository extends JpaRepository<SubwayStation, Long> {
	// 모든 역 정보 조회 (거리 계산용)
	List<SubwayStation> findAll();

	// 특정 호선의 역만 조회
	List<SubwayStation> findByLineNumber(Integer lineNumber);
}
