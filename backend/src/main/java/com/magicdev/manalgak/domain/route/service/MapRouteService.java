package com.magicdev.manalgak.domain.route.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;
import com.magicdev.manalgak.domain.algorithm.service.MidpointCalculationService;
import com.magicdev.manalgak.domain.external.kakao.service.KakaoMobilityService;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.repository.ParticipantRepository;
import com.magicdev.manalgak.domain.route.dto.MapRouteResponse;
import com.magicdev.manalgak.domain.station.entity.SubwayStation;
import com.magicdev.manalgak.domain.station.repository.SubwayStationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Step4 지도 경로 시각화 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MapRouteService {

    private final MeetingRepository meetingRepository;
    private final ParticipantRepository participantRepository;
    private final MidpointCalculationService midpointCalculationService;
    private final SubwayStationRepository subwayStationRepository;
    private final KakaoMobilityService kakaoMobilityService;

    // 참여자별 색상 팔레트
    private static final String[] COLORS = {
            "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
            "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"
    };

    @Transactional(readOnly = true)
    public MapRouteResponse getMapRoutes(String meetingUuid) {
        // 1. 미팅 조회
        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        // 2. 참여자 목록 조회
        List<Participant> participants = participantRepository.findByMeetingId(meeting.getId());

        // 3. 출발지가 설정된 참여자만 필터링
        List<Participant> participantsWithOrigin = participants.stream()
                .filter(p -> p.getOrigin() != null)
                .filter(p -> p.getOrigin().getLatitude() != null)
                .filter(p -> p.getOrigin().getLongitude() != null)
                .toList();

        if (participantsWithOrigin.isEmpty()) {
            throw new BusinessException(ErrorCode.ADDRESS_NO_ORIGIN);
        }

        // 4. 중간지점(최적 역) 조회
        Coordinate midpointCoord = midpointCalculationService.findOptimalStationByMeetingID(meetingUuid);

        // 5. 역 이름 조회
        String stationName = findNearestStationName(midpointCoord);

        // 6. 각 참여자별 경로 조회
        List<MapRouteResponse.ParticipantRoute> participantRoutes = new ArrayList<>();

        for (int i = 0; i < participantsWithOrigin.size(); i++) {
            Participant participant = participantsWithOrigin.get(i);
            String color = COLORS[i % COLORS.length];

            // 도로 경로 조회
            List<double[]> path = kakaoMobilityService.getRouteCoordinates(
                    participant.getOrigin().getLatitude(),
                    participant.getOrigin().getLongitude(),
                    midpointCoord.getLatitude(),
                    midpointCoord.getLongitude()
            );

            MapRouteResponse.ParticipantRoute route = MapRouteResponse.ParticipantRoute.builder()
                    .participantId(participant.getId())
                    .nickName(participant.getNickName())
                    .profileImageUrl(participant.getUser().getProfileImageUrl())
                    .origin(MapRouteResponse.Origin.builder()
                            .lat(participant.getOrigin().getLatitude())
                            .lng(participant.getOrigin().getLongitude())
                            .address(participant.getOrigin().getAddress())
                            .build())
                    .path(path)
                    .color(color)
                    .build();

            participantRoutes.add(route);
        }

        // 7. 응답 생성
        return MapRouteResponse.builder()
                .midpoint(MapRouteResponse.Midpoint.builder()
                        .lat(midpointCoord.getLatitude())
                        .lng(midpointCoord.getLongitude())
                        .stationName(stationName)
                        .build())
                .participants(participantRoutes)
                .build();
    }

    @Transactional(readOnly = true)
    public MapRouteResponse getMapRoutesToPlace(
            String meetingUuid,
            double destLat,
            double destLng,
            String placeName
    ) {
        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        List<Participant> participants = participantRepository.findByMeetingId(meeting.getId());

        List<Participant> participantsWithOrigin = participants.stream()
                .filter(p -> p.getOrigin() != null)
                .filter(p -> p.getOrigin().getLatitude() != null)
                .filter(p -> p.getOrigin().getLongitude() != null)
                .toList();

        if (participantsWithOrigin.isEmpty()) {
            throw new BusinessException(ErrorCode.ADDRESS_NO_ORIGIN);
        }

        List<MapRouteResponse.ParticipantRoute> participantRoutes = new ArrayList<>();

        for (int i = 0; i < participantsWithOrigin.size(); i++) {
            Participant participant = participantsWithOrigin.get(i);
            String color = COLORS[i % COLORS.length];

            List<double[]> path = kakaoMobilityService.getRouteCoordinates(
                    participant.getOrigin().getLatitude(),
                    participant.getOrigin().getLongitude(),
                    destLat,
                    destLng
            );

            MapRouteResponse.ParticipantRoute route = MapRouteResponse.ParticipantRoute.builder()
                    .participantId(participant.getId())
                    .nickName(participant.getNickName())
                    .profileImageUrl(participant.getUser().getProfileImageUrl())
                    .origin(MapRouteResponse.Origin.builder()
                            .lat(participant.getOrigin().getLatitude())
                            .lng(participant.getOrigin().getLongitude())
                            .address(participant.getOrigin().getAddress())
                            .build())
                    .path(path)
                    .color(color)
                    .build();

            participantRoutes.add(route);
        }

        return MapRouteResponse.builder()
                .destination(MapRouteResponse.Destination.builder()
                        .lat(destLat)
                        .lng(destLng)
                        .placeName(placeName)
                        .build())
                .participants(participantRoutes)
                .build();
    }

    // 경계 상자 검색 반경 (km)
    private static final double BOUNDING_BOX_RADIUS_KM = 2.0;

    /**
     * 좌표에서 가장 가까운 역 이름 찾기
     * - Bounding Box로 주변 역만 조회 (성능 최적화)
     * - Haversine 공식으로 정확한 거리 계산
     */
    private String findNearestStationName(Coordinate coord) {
        // 경계 상자 계산 (위도 1도 ≈ 111km)
        double latOffset = BOUNDING_BOX_RADIUS_KM / 111.0;
        double lngOffset = BOUNDING_BOX_RADIUS_KM / (111.0 * Math.cos(Math.toRadians(coord.getLatitude())));

        double minLat = coord.getLatitude() - latOffset;
        double maxLat = coord.getLatitude() + latOffset;
        double minLng = coord.getLongitude() - lngOffset;
        double maxLng = coord.getLongitude() + lngOffset;

        // Bounding Box 내의 역만 조회
        List<SubwayStation> nearbyStations = subwayStationRepository.findStationsInBoundingBox(
                minLat, maxLat, minLng, maxLng
        );

        // 주변에 역이 없으면 범위를 넓혀서 재조회
        if (nearbyStations.isEmpty()) {
            nearbyStations = subwayStationRepository.findStationsInBoundingBox(
                    minLat - latOffset, maxLat + latOffset,
                    minLng - lngOffset, maxLng + lngOffset
            );
        }

        // Haversine 공식으로 가장 가까운 역 찾기
        return nearbyStations.stream()
                .min((s1, s2) -> {
                    double d1 = midpointCalculationService.calculateDistance(
                            coord, new Coordinate(s1.getLatitude(), s1.getLongitude())
                    );
                    double d2 = midpointCalculationService.calculateDistance(
                            coord, new Coordinate(s2.getLatitude(), s2.getLongitude())
                    );
                    return Double.compare(d1, d2);
                })
                .map(SubwayStation::getStationName)
                .orElse("중간지점");
    }
}
