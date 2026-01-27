package com.magicdev.manalgak.domain.algorithm.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;
import com.magicdev.manalgak.domain.algorithm.Model.DistanceInfo;
import com.magicdev.manalgak.domain.algorithm.Model.WeightedCoordinate;
import com.magicdev.manalgak.domain.algorithm.dto.StationWithTravelTimes;
import com.magicdev.manalgak.domain.algorithm.dto.TravelTimeInfo;
import com.magicdev.manalgak.domain.odsay.service.OdsayService;
import com.magicdev.manalgak.domain.participant.dto.ParticipantResponse;
import com.magicdev.manalgak.domain.participant.service.ParticipantService;
import com.magicdev.manalgak.domain.station.entity.SubwayStation;
import com.magicdev.manalgak.domain.station.repository.SubwayStationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MidpointCalculationService {

	private final ParticipantService participantService;
	private final SubwayStationRepository stationRepository;
	private final OdsayService odsayService;

	/**
	 * 미팅 UUID로 참여자들의 중간지점 계산
	 * @param meetingUuid 미팅 UUID
	 * @return 중간지점 좌표
	 */
	public Coordinate returnMidPointByMeetingID(String meetingUuid) {
		// 1. 참여자 목록 조회
		List<ParticipantResponse> participants = participantService.getAllParticipants(meetingUuid);

		// 2. 출발지(origin)가 설정된 참여자만 필터링
		List<ParticipantResponse> participantsWithOrigin = participants.stream()
			.filter(participant -> participant.getOrigin() != null)
			.filter(participant -> participant.getOrigin().getLatitude() != null)
			.filter(participant -> participant.getOrigin().getLongitude() != null)
			.toList();

		// 3. 유효한 참여자가 없으면 기본 좌표 반환 (서울시청)
		if (participantsWithOrigin.isEmpty()) {
			throw new BusinessException(ErrorCode.ADDRESS_NO_ORIGIN);
		}

		// 4. Location을 Coordinate로 변환
		List<Coordinate> coordinates = participantsWithOrigin.stream()
			.map(participant -> new Coordinate(
				participant.getOrigin().getLatitude(),
				participant.getOrigin().getLongitude()
			))
			.collect(Collectors.toList());

		// 5. 기하학적 중심점 계산
		return calculateGeometricCenter(coordinates);
	}

	public Coordinate findOptimalStationByMeetingID(String meetingUuid) {
		// 1. 참여자 출발지 조회
		List<ParticipantResponse> participants = participantService.getAllParticipants(meetingUuid);

		// 2. 출발지가 설정된 참여자만 필터링
		List<ParticipantResponse> participantsWithOrigin = participants.stream()
			.filter(participant -> participant.getOrigin() != null)
			.filter(participant -> participant.getOrigin().getLatitude() != null)
			.filter(participant -> participant.getOrigin().getLongitude() != null)
			.toList();

		// 3. 유효한 참여자가 없으면 예외
		if (participantsWithOrigin.isEmpty()) {
			throw new BusinessException(ErrorCode.ADDRESS_NO_ORIGIN);
		}

		// 4. Location을 Coordinate로 변환
		List<Coordinate> coordinates = participantsWithOrigin.stream()
			.map(participant -> new Coordinate(
				participant.getOrigin().getLatitude(),
				participant.getOrigin().getLongitude()
			))
			.collect(Collectors.toList());

		// 5. 기하학적 중간지점 계산
		Coordinate midpoint = calculateGeometricCenter(coordinates);

		// 3. 중간지점 기준 가까운 역들 정렬
		List<SubwayStation> nearbyStations = findNearbyStationsOrderByDistance(midpoint);

		// 4. 각 역에 대해 소요시간 차이 검증
		for (SubwayStation station : nearbyStations) {
			StationWithTravelTimes result = calculateTravelTimesForStation(
				participants, station
			);

			if (result.getTimeDifference() <= 5) {
				// 조건 만족하는 역 찾음!
				log.info("최적 역 발견: {} ({}호선), 소요시간 차이: {}분",
					station.getStationName(),
					station.getLineNumber(),
					result.getTimeDifference());
				return new Coordinate(
					station.getLatitude(),
					station.getLongitude()
				);
			}
		}

		// 8. 적합한 역 없으면 가장 가까운 역 반환 (fallback)
		log.warn("5분 이내 역을 찾지 못함. 가장 가까운 역 반환");
		SubwayStation nearestStation = nearbyStations.get(0);
		return new Coordinate(
			nearestStation.getLatitude(),
			nearestStation.getLongitude()
		);
	}

	/**
	 * 순수 좌표 데이터만으로 중간지점 계산
	 * @param coordinates 위도, 경도 리스트
	 * @return 중간지점 좌표
	 */
	public Coordinate calculateGeometricCenter(List<Coordinate> coordinates) {
		if (coordinates == null || coordinates.isEmpty()) {
			throw new IllegalArgumentException("좌표 리스트가 비어있습니다.");
		}

		double x = 0.0, y = 0.0, z = 0.0;

		for (Coordinate coord : coordinates) {
			// 위도, 경도를 라디안으로 변환
			double lat = Math.toRadians(coord.getLatitude());
			double lon = Math.toRadians(coord.getLongitude());

			// 3D 직교 좌표계로 변환 (지구는 구체이므로)
			x += Math.cos(lat) * Math.cos(lon);
			y += Math.cos(lat) * Math.sin(lon);
			z += Math.sin(lat);
		}

		// 평균 계산
		int total = coordinates.size();
		x /= total;
		y /= total;
		z /= total;

		// 구면 좌표계로 다시 변환
		double centralLon = Math.atan2(y, x);
		double centralSqrt = Math.sqrt(x * x + y * y);
		double centralLat = Math.atan2(z, centralSqrt);

		// 라디안을 도(degree)로 변환
		return new Coordinate(
			Math.toDegrees(centralLat),
			Math.toDegrees(centralLon)
		);
	}

	/**
	 * 가중치를 적용한 중간지점 계산
	 * (예: 특정 참여자의 이동 불편함을 고려)
	 */
	public Coordinate calculateWeightedCenter(List<WeightedCoordinate> coordinates) {
		double totalWeight = 0.0;
		double x = 0.0, y = 0.0, z = 0.0;

		for (WeightedCoordinate wc : coordinates) {
			double weight = wc.getWeight();
			totalWeight += weight;

			double lat = Math.toRadians(wc.getLatitude());
			double lon = Math.toRadians(wc.getLongitude());

			x += Math.cos(lat) * Math.cos(lon) * weight;
			y += Math.cos(lat) * Math.sin(lon) * weight;
			z += Math.sin(lat) * weight;
		}

		x /= totalWeight;
		y /= totalWeight;
		z /= totalWeight;

		double centralLon = Math.atan2(y, x);
		double centralSqrt = Math.sqrt(x * x + y * y);
		double centralLat = Math.atan2(z, centralSqrt);

		return new Coordinate(
			Math.toDegrees(centralLat),
			Math.toDegrees(centralLon)
		);
	}

	/**
	 * Haversine 공식을 사용한 두 지점 간 거리 계산
	 * @return 거리 (km)
	 */
	public double calculateDistance(Coordinate from, Coordinate to) {
		final double EARTH_RADIUS_KM = 6371.0;

		double latDistance = Math.toRadians(to.getLatitude() - from.getLatitude());
		double lonDistance = Math.toRadians(to.getLongitude() - from.getLongitude());

		double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
			+ Math.cos(Math.toRadians(from.getLatitude()))
			* Math.cos(Math.toRadians(to.getLatitude()))
			* Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return EARTH_RADIUS_KM * c;
	}

	/**
	 * 모든 지점에서 특정 지점까지의 거리 계산
	 */
	public List<DistanceInfo> calculateDistances(List<Coordinate> from, Coordinate to) {
		return from.stream()
			.map(coord -> new DistanceInfo(coord, to, calculateDistance(coord, to)))
			.collect(Collectors.toList());
	}

	/**
	 * 최대 거리를 최소화하는 중간지점 찾기 (minimax 알고리즘)
	 * 격자 탐색 방식 사용
	 */
	public Coordinate findOptimalMidpoint(List<Coordinate> coordinates, double searchRadiusKm) {
		// 초기 중심점
		Coordinate initialCenter = calculateGeometricCenter(coordinates);

		// 격자 탐색
		double stepSize = searchRadiusKm / 10; // 10x10 격자
		Coordinate optimalPoint = initialCenter;
		double minMaxDistance = Double.MAX_VALUE;

		for (double latOffset = -searchRadiusKm; latOffset <= searchRadiusKm; latOffset += stepSize) {
			for (double lonOffset = -searchRadiusKm; lonOffset <= searchRadiusKm; lonOffset += stepSize) {
				// 위도 1도 ≈ 111km, 경도는 위도에 따라 달라짐
				double latDegreeOffset = latOffset / 111.0;
				double lonDegreeOffset = lonOffset / (111.0 * Math.cos(Math.toRadians(initialCenter.getLatitude())));

				Coordinate candidate = new Coordinate(
					initialCenter.getLatitude() + latDegreeOffset,
					initialCenter.getLongitude() + lonDegreeOffset
				);

				// 이 지점에서 가장 먼 참여자까지의 거리
				double maxDistance = coordinates.stream()
					.mapToDouble(coord -> calculateDistance(coord, candidate))
					.max()
					.orElse(Double.MAX_VALUE);

				if (maxDistance < minMaxDistance) {
					minMaxDistance = maxDistance;
					optimalPoint = candidate;
				}
			}
		}

		return optimalPoint;
	}

	private List<SubwayStation> findNearbyStationsOrderByDistance(
		Coordinate midpoint) {

		List<SubwayStation> allStations = stationRepository.findAll();

		// 거리 계산 후 정렬
		return allStations.stream()
			.sorted((s1, s2) -> {
				double d1 = calculateDistance(midpoint,
					new Coordinate(s1.getLatitude(), s1.getLongitude()));
				double d2 = calculateDistance(midpoint,
					new Coordinate(s2.getLatitude(), s2.getLongitude()));
				return Double.compare(d1, d2);
			})
			.limit(20)  // 상위 20개만 (너무 많으면 API 호출 과다)
			.toList();
	}

	private StationWithTravelTimes calculateTravelTimesForStation(
		List<ParticipantResponse> participants,
		SubwayStation station) {

		Coordinate stationCoord = new Coordinate(
			station.getLatitude(),
			station.getLongitude()
		);

		List<TravelTimeInfo> travelTimes = new ArrayList<>();

		for (ParticipantResponse participant : participants) {
			Coordinate origin = new Coordinate(
				participant.getOrigin().getLatitude(),
				participant.getOrigin().getLongitude()
			);

			// Odsay API 호출
			Integer travelTime = odsayService.getTravelTime(origin, stationCoord);

			// null이면 경로 없음 -> 큰 값으로 처리하거나 스킵
			if (travelTime == null) {
				travelTime = 999; // 경로 없음 표시
			}

			travelTimes.add(new TravelTimeInfo(
				participant.getNickName(),
				origin,
				travelTime
			));
		}

		// 최대/최소 시간 계산
		Integer maxTime = travelTimes.stream()
			.mapToInt(TravelTimeInfo::getTravelTimeMinutes)
			.max()
			.orElse(0);

		Integer minTime = travelTimes.stream()
			.mapToInt(TravelTimeInfo::getTravelTimeMinutes)
			.min()
			.orElse(0);

		return StationWithTravelTimes.builder()
			.station(station)
			.travelTimes(travelTimes)
			.maxTime(maxTime)
			.minTime(minTime)
			.timeDifference(maxTime - minTime)
			.build();
	}

}
