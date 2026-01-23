package com.magicdev.manalgak.domain.place.service;

import com.magicdev.manalgak.common.cache.CacheKeys;
import com.magicdev.manalgak.common.cache.CacheTTL;
import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.domain.algorithm.Model.Coordinate;
import com.magicdev.manalgak.domain.algorithm.service.MidpointCalculationService;
import com.magicdev.manalgak.domain.external.kakao.dto.KakaoPlaceSearchResponse;
import com.magicdev.manalgak.domain.external.kakao.service.KakaoLocalApiService;
import com.magicdev.manalgak.domain.meeting.entity.Meeting;
import com.magicdev.manalgak.domain.meeting.repository.MeetingRepository;
import com.magicdev.manalgak.domain.place.dto.PlaceResponse;
import com.magicdev.manalgak.domain.place.dto.PlaceSelectRequest;
import com.magicdev.manalgak.domain.place.entity.RecommendedPlace;
import com.magicdev.manalgak.domain.place.repository.RecommendedPlaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlaceService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final KakaoLocalApiService kakaoLocalApiService;
    private final MidpointCalculationService midpointCalculationService;
    private final RecommendedPlaceRepository recommendedPlaceRepository;
    private final MeetingRepository meetingRepository;

    private static final int DEFAULT_RADIUS = 500;  // 반경 500m

    public PlaceResponse getRecommendedPlaces(String meetingUuid, String purpose, int limit) {
        String cacheKey = CacheKeys.placesKeyByMidpoint(meetingUuid, purpose, limit);

        PlaceResponse cached = getCachedPlaces(cacheKey);
        if (cached != null) {
            log.info("Cache HIT: {}", cacheKey);
            cached.setFromCache(true);
            return cached;
        }

        log.info("Cache MISS: {}, calling Kakao API", cacheKey);
        PlaceResponse response = callKakaoApi(meetingUuid, purpose, limit);
        response.setFromCache(false);

        savePlacesToCache(cacheKey, response);

        return response;
    }

    // 기존 메서드 유지 (하위 호환성)
    public PlaceResponse getRecommendedPlaces(String meetingUuid, Long candidateId, String purpose, int limit) {
        return getRecommendedPlaces(meetingUuid, purpose, limit);
    }

    private PlaceResponse getCachedPlaces(String cacheKey) {
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            return cached != null ? (PlaceResponse) cached : null;
        } catch (Exception e) {
            log.warn("Failed to get from cache: {}", e.getMessage());
            return null;
        }
    }

    private PlaceResponse callKakaoApi(String meetingUuid, String purpose, int limit) {
        // 1. 중간지점 계산
        Coordinate midpoint = midpointCalculationService.returnMidPointByMeetingID(meetingUuid);

        log.info("중간지점 계산 완료: lat={}, lng={}",
                midpoint.getLatitude(), midpoint.getLongitude());

        // 2. 목적 -> 카카오 카테고리 코드 변환
        String categoryCode = mapPurposeToKakaoCode(purpose);

        // 3. 목적 -> 프론트엔드 카테고리 변환
        String frontCategory = mapPurposeToFrontCategory(purpose);

        // 4. 카카오 API 호출
        KakaoPlaceSearchResponse kakaoResponse = kakaoLocalApiService.searchByCategory(
                categoryCode,
                midpoint.getLongitude(),  // x
                midpoint.getLatitude(),   // y
                DEFAULT_RADIUS,
                limit
        );

        // 5. 응답 변환 (좌표가 null인 장소는 제외)
        List<PlaceResponse.Place> places = kakaoResponse.getDocuments()
                .stream()
                .map(doc -> convertToPlace(doc, frontCategory))
                .filter(place -> place.getLatitude() != null && place.getLongitude() != null)
                .collect(Collectors.toList());

        return PlaceResponse.builder()
                .places(places)
                .totalCount(kakaoResponse.getMeta().getTotalCount())
                .midpoint(midpoint)
                .fromCache(false)
                .build();
    }

    /**
     * 카카오 응답 -> PlaceResponse.Place 변환
     */
    private PlaceResponse.Place convertToPlace(
            KakaoPlaceSearchResponse.Document doc,
            String frontCategory
    ) {
        int distance = 0;
        try {
            distance = Integer.parseInt(doc.getDistance());
        } catch (NumberFormatException e) {
            log.warn("거리 파싱 실패: {}", doc.getDistance());
        }

        int walkingMinutes = (int) Math.ceil(distance / 80.0);  // 도보 시간 계산 (80m/분)

        return PlaceResponse.Place.builder()
                .placeId(doc.getId())
                .placeName(doc.getPlaceName())
                .category(frontCategory)
                .categoryGroupCode(doc.getCategoryGroupCode())
                .categoryGroupName(doc.getCategoryGroupName())
                .categoryName(doc.getCategoryName())
                .address(doc.getAddressName())
                .roadAddress(doc.getRoadAddressName())
                .latitude(parseDouble(doc.getY()))
                .longitude(parseDouble(doc.getX()))
                .distance(distance)
                .walkingMinutes(walkingMinutes)
                .stationName("중간지점")
                .phone(doc.getPhone())
                .placeUrl(doc.getPlaceUrl())
                .build();
    }

    private Double parseDouble(String value) {
        if (value == null || value.isBlank()) {
            log.error("좌표 값이 비어있습니다: '{}'", value);
            return null;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            log.error("좌표 파싱 실패 - 유효하지 않은 값: '{}'", value);
            return null;
        }
    }

    private void savePlacesToCache(String cacheKey, PlaceResponse response) {
        try {
            redisTemplate.opsForValue().set(
                    cacheKey,
                    response,
                    CacheTTL.PLACES
            );
            log.info("Saved to cache: {}", cacheKey);
        } catch (Exception e) {
            log.error("Failed to save to cache: {}", e.getMessage());
        }
    }

    /**
     * 목적 -> 카카오 카테고리 코드 매핑
     */
    private String mapPurposeToKakaoCode(String purpose) {
        if (purpose == null) {
            return "FD6";
        }
        return switch (purpose.toUpperCase()) {
            case "DINING", "RESTAURANT", "BRUNCH", "DRINK" -> "FD6";  // 음식점
            case "CAFE", "DATE", "STUDY" -> "CE7";                     // 카페
            case "CULTURE", "MOVIE", "KARAOKE" -> "CT1";               // 문화시설
            case "TOUR", "SHOPPING" -> "AT4";                          // 관광명소
            default -> "FD6";
        };
    }

    /**
     * 목적 -> 프론트엔드 카테고리 매핑
     */
    private String mapPurposeToFrontCategory(String purpose) {
        if (purpose == null) {
            return "restaurant";
        }
        return switch (purpose.toUpperCase()) {
            case "DINING", "RESTAURANT", "BRUNCH", "DRINK" -> "restaurant";
            case "CAFE", "DATE", "STUDY" -> "cafe";
            case "CULTURE", "MOVIE", "KARAOKE" -> "culture";
            case "TOUR", "SHOPPING" -> "tour";
            default -> "restaurant";
        };
    }

    // ========== 선택 장소 저장/조회 기능 ==========

    /**
     * 선택한 장소 저장
     */
    @Transactional
    public PlaceResponse.Place saveSelectedPlace(String meetingUuid, PlaceSelectRequest request) {
        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        // 기존 선택 장소가 있으면 삭제 (1개의 모임에 1개의 선택 장소만 허용)
        if (recommendedPlaceRepository.existsByMeetingMeetingUuid(meetingUuid)) {
            recommendedPlaceRepository.deleteByMeetingMeetingUuid(meetingUuid);
        }

        RecommendedPlace recommendedPlace = RecommendedPlace.builder()
                .meeting(meeting)
                .placeId(request.getPlaceId())
                .placeName(request.getPlaceName())
                .category(request.getCategory())
                .categoryGroupCode(request.getCategoryGroupCode())
                .categoryGroupName(request.getCategoryGroupName())
                .address(request.getAddress())
                .roadAddress(request.getRoadAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .distance(request.getDistance())
                .walkingMinutes(request.getWalkingMinutes())
                .phone(request.getPhone())
                .placeUrl(request.getPlaceUrl())
                .build();

        RecommendedPlace saved = recommendedPlaceRepository.save(recommendedPlace);

        log.info("선택 장소 저장 완료: meetingUuid={}, placeId={}", meetingUuid, saved.getPlaceId());

        return convertToPlaceDto(saved);
    }

    /**
     * 선택된 장소 조회
     */
    @Transactional(readOnly = true)
    public PlaceResponse.Place getSelectedPlace(String meetingUuid) {
        RecommendedPlace recommendedPlace = recommendedPlaceRepository
                .findByMeetingMeetingUuid(meetingUuid)
                .orElse(null);

        if (recommendedPlace == null) {
            return null;
        }

        return convertToPlaceDto(recommendedPlace);
    }

    /**
     * RecommendedPlace 엔티티 -> PlaceResponse.Place DTO 변환
     */
    private PlaceResponse.Place convertToPlaceDto(RecommendedPlace entity) {
        return PlaceResponse.Place.builder()
                .placeId(entity.getPlaceId())
                .placeName(entity.getPlaceName())
                .category(entity.getCategory())
                .categoryGroupCode(entity.getCategoryGroupCode())
                .categoryGroupName(entity.getCategoryGroupName())
                .address(entity.getAddress())
                .roadAddress(entity.getRoadAddress())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .distance(entity.getDistance())
                .walkingMinutes(entity.getWalkingMinutes())
                .stationName("중간지점")
                .phone(entity.getPhone())
                .placeUrl(entity.getPlaceUrl())
                .build();
    }
}