package com.magicdev.manalgak.domain.algorithm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;
import com.magicdev.manalgak.domain.algorithm.dto.CalculateRequest;
import com.magicdev.manalgak.domain.algorithm.dto.OptimalStationDetailResponse;
import com.magicdev.manalgak.domain.algorithm.service.MidpointCalculationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/midpoint")
@RequiredArgsConstructor
public class AlgorithmController {

	private final MidpointCalculationService midpointCalculationService;

	@PostMapping
	public Coordinate midpointFind(@RequestBody CalculateRequest calculateRequest ){
		/**
		 * 가장 기본적인 구현 - 이것만 있어도 충분y
		 */
		// 1단계: 기하학적 중심점 계산 (필수)

		return midpointCalculationService.calculateGeometricCenter(calculateRequest.getCoordinates());
	}

	@GetMapping("/meeting")
	public Coordinate meetingFind(@RequestParam("meetingUUID") String meetingUUID ){
		/**
		 * 가장 기본적인 구현 - 이것만 있어도 충분
		 */
		// 1단계: 기하학적 중심점 계산 (필수)

		return midpointCalculationService.returnMidPointByMeetingID(meetingUUID);
	}

	/**
	 * 테스트용: 최적 지하철역 찾기
	 * 모든 참여자의 소요시간 차이가 5분 이내인 역을 찾음
	 */
	@GetMapping("/meeting/optimal-station")
	public Coordinate findOptimalStation(@RequestParam("meetingUUID") String meetingUUID) {
		log.info("🧪 [테스트] 최적 역 조회 요청 - meetingUUID: {}", meetingUUID);

		Coordinate optimalStationCoord = midpointCalculationService
			.findOptimalStationByMeetingID(meetingUUID);

		log.info("🧪 [테스트] 최적 역 좌표 반환 - lat: {}, lon: {}",
			optimalStationCoord.getLatitude(),
			optimalStationCoord.getLongitude());

		return optimalStationCoord;
	}

	/**
	 * 테스트용: 최적 지하철역 찾기 (상세 정보 포함)
	 */
	@GetMapping("/meeting/optimal-station/details")
	public OptimalStationDetailResponse findOptimalStationWithDetails(
		@RequestParam("meetingUUID") String meetingUUID) {
		log.info("🧪 [테스트] 최적 역 상세 조회 요청 - meetingUUID: {}", meetingUUID);

		OptimalStationDetailResponse response = midpointCalculationService
			.findOptimalStationWithDetails(meetingUUID);

		log.info("🧪 [테스트] 역: {} ({}호선), 시간차이: {}분",
			response.getStationName(),
			response.getLineNumber(),
			response.getTimeDifference());

		return response;
	}

}
