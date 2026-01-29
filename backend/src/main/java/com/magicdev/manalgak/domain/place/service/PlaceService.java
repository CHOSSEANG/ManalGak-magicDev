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
import com.magicdev.manalgak.domain.place.entity.PlaceCandidate;
import com.magicdev.manalgak.domain.place.entity.RecommendedPlace;
import com.magicdev.manalgak.domain.place.repository.PlaceCandidateRepository;
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
    private final PlaceCandidateRepository placeCandidateRepository;
    private final MeetingRepository meetingRepository;

    private static final int DEFAULT_RADIUS = 500;  // 반경 500m

    @Transactional
    public PlaceResponse getRecommendedPlaces(String meetingUuid, String purpose, int limit) {
        String cacheKey = CacheKeys.placesKeyByMidpoint(meetingUuid, purpose, limit);

        // 1. Redis 캐시 확인
        PlaceResponse cached = getCachedPlaces(cacheKey);
        if (cached != null) {
            log.info("Redis Cache HIT: {}", cacheKey);
            cached.setFromCache(true);
            return cached;
        }

        // 2. DB 확인
        List<PlaceCandidate> dbCandidates = placeCandidateRepository.findByMeetingMeetingUuid(meetingUuid);
        if (!dbCandidates.isEmpty()) {
            log.info("DB HIT: meetingUuid={}, count={}", meetingUuid, dbCandidates.size());
            PlaceResponse response = convertCandidatesToResponse(dbCandidates, meetingUuid);
            response.setFromCache(true);
            // Redis 캐시에 저장
            savePlacesToCache(cacheKey, response);
            return response;
        }

        // 3. 카카오 API 호출
        log.info("Cache MISS: {}, calling Kakao API", cacheKey);
        PlaceResponse response = callKakaoApi(meetingUuid, purpose, limit);
        response.setFromCache(false);

        // 4. DB에 저장
        saveCandidatesToDb(meetingUuid, response.getPlaces());

        // 5. Redis 캐시에 저장
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
        // 1. 중간지점 역 기반으로 좌표 계산
        Coordinate midpoint = midpointCalculationService.findOptimalStationByMeetingID(meetingUuid);

        log.info("중간지점 역 계산 완료: lat={}, lng={}",
                midpoint.getLatitude(), midpoint.getLongitude());

        // 2. 목적 -> 카카오 카테고리 코드 변환
        String categoryCode = mapPurposeToKakaoCode(purpose);

        // 3. 목적 -> 프론트엔드 카테고리 변환
        String frontCategory = mapPurposeToFrontCategory(purpose);

        // 4. 1차 검색: 기본 반경
        int firstRadius = DEFAULT_RADIUS;
        KakaoPlaceSearchResponse firstResponse = kakaoLocalApiService.searchByCategory(
                categoryCode,
                midpoint.getLongitude(),  // x
                midpoint.getLatitude(),   // y
                firstRadius,
                limit
        );

        List<PlaceResponse.Place> places = convertToPlaces(firstResponse, frontCategory);

        if (places.size() >= limit) {
            return buildResponse(places, firstResponse, midpoint, false, firstRadius);
        }

        // 5. 2차 검색: 카테고리별 확대 반경
        int expandedRadius = getExpandedRadius(purpose);
        KakaoPlaceSearchResponse expandedResponse = kakaoLocalApiService.searchByCategory(
                categoryCode,
                midpoint.getLongitude(),  // x
                midpoint.getLatitude(),   // y
                expandedRadius,
                limit
        );

        List<PlaceResponse.Place> expandedPlaces = convertToPlaces(expandedResponse, frontCategory);
        return buildResponse(expandedPlaces, expandedResponse, midpoint, true, expandedRadius);
    }

    private List<PlaceResponse.Place> convertToPlaces(
            KakaoPlaceSearchResponse response,
            String frontCategory
    ) {
        return response.getDocuments()
                .stream()
                .map(doc -> convertToPlace(doc, frontCategory))
                .filter(place -> place.getLatitude() != null && place.getLongitude() != null)
                .collect(Collectors.toList());
    }

    private PlaceResponse buildResponse(
            List<PlaceResponse.Place> places,
            KakaoPlaceSearchResponse response,
            Coordinate midpoint,
            boolean expandedSearch,
            int searchRadius
    ) {
        return PlaceResponse.builder()
                .places(places)
                .totalCount(response.getMeta().getTotalCount())
                .midpoint(midpoint)
                .fromCache(false)
                .expandedSearch(expandedSearch)
                .searchRadius(searchRadius)
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

    /**
     * 목적별 확대 반경 반환
     */
    private int getExpandedRadius(String purpose) {
        if (purpose == null) {
            return 1000;
        }
        return switch (purpose.toUpperCase()) {
            case "CAFE", "DATE", "STUDY" -> 1000;                   // 카페
            case "DINING", "RESTAURANT", "BRUNCH", "DRINK" -> 1000;  // 음식점
            case "TOUR", "SHOPPING" -> 1500;                        // 관광명소
            case "CULTURE", "MOVIE", "KARAOKE" -> 2000;             // 문화시설
            default -> 1000;
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

    // ========== 추천 장소 후보 (place_candidates) 관련 ==========

    /**
     * DB에 저장된 후보 장소들을 PlaceResponse로 변환
     */
    private PlaceResponse convertCandidatesToResponse(List<PlaceCandidate> candidates, String meetingUuid) {
        Coordinate midpoint = midpointCalculationService.findOptimalStationByMeetingID(meetingUuid);

        List<PlaceResponse.Place> places = candidates.stream()
                .map(this::convertCandidateToPlace)
                .collect(Collectors.toList());

        return PlaceResponse.builder()
                .places(places)
                .totalCount(places.size())
                .midpoint(midpoint)
                .fromCache(true)
                .expandedSearch(false)
                .searchRadius(null)
                .build();
    }

    /**
     * PlaceCandidate 엔티티 -> PlaceResponse.Place DTO 변환
     */
    private PlaceResponse.Place convertCandidateToPlace(PlaceCandidate candidate) {
        return PlaceResponse.Place.builder()
                .placeId(candidate.getPlaceId())
                .placeName(candidate.getPlaceName())
                .category(candidate.getCategory())
                .categoryGroupCode(candidate.getCategoryGroupCode())
                .categoryGroupName(candidate.getCategoryGroupName())
                .categoryName(candidate.getCategoryName())
                .address(candidate.getAddress())
                .roadAddress(candidate.getRoadAddress())
                .latitude(candidate.getLatitude())
                .longitude(candidate.getLongitude())
                .distance(candidate.getDistance())
                .walkingMinutes(candidate.getWalkingMinutes())
                .stationName("중간지점")
                .phone(candidate.getPhone())
                .placeUrl(candidate.getPlaceUrl())
                .build();
    }

    /**
     * 추천 장소 후보를 DB에 저장
     */
    private void saveCandidatesToDb(String meetingUuid, List<PlaceResponse.Place> places) {
        Meeting meeting = meetingRepository.findByMeetingUuid(meetingUuid)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEETING_NOT_FOUND));

        List<PlaceCandidate> candidates = places.stream()
                .map(place -> PlaceCandidate.builder()
                        .meeting(meeting)
                        .placeId(place.getPlaceId())
                        .placeName(place.getPlaceName())
                        .category(place.getCategory())
                        .categoryGroupCode(place.getCategoryGroupCode())
                        .categoryGroupName(place.getCategoryGroupName())
                        .categoryName(place.getCategoryName())
                        .address(place.getAddress())
                        .roadAddress(place.getRoadAddress())
                        .latitude(place.getLatitude())
                        .longitude(place.getLongitude())
                        .distance(place.getDistance())
                        .walkingMinutes(place.getWalkingMinutes())
                        .phone(place.getPhone())
                        .placeUrl(place.getPlaceUrl())
                        .build())
                .collect(Collectors.toList());

        placeCandidateRepository.saveAll(candidates);
        log.info("추천 장소 후보 DB 저장 완료: meetingUuid={}, count={}", meetingUuid, candidates.size());
    }

    /**
     * 추천 장소 후보 새로고침 (기존 삭제 후 새로 저장)
     */
    @Transactional
    public PlaceResponse refreshCandidates(String meetingUuid, String purpose, int limit) {
        String cacheKey = CacheKeys.placesKeyByMidpoint(meetingUuid, purpose, limit);

        // 1. 기존 DB 데이터 삭제
        placeCandidateRepository.deleteByMeetingMeetingUuid(meetingUuid);
        log.info("기존 추천 장소 후보 삭제: meetingUuid={}", meetingUuid);

        // 2. Redis 캐시 삭제
        redisTemplate.delete(cacheKey);

        // 3. 카카오 API 호출
        PlaceResponse response = callKakaoApi(meetingUuid, purpose, limit);
        response.setFromCache(false);

        // 4. DB에 저장
        saveCandidatesToDb(meetingUuid, response.getPlaces());

        // 5. Redis 캐시에 저장
        savePlacesToCache(cacheKey, response);

        return response;
    }

    /**
     * 모임의 추천 장소 캐시 무효화
     * - 참여자 주소 변경 시 호출
     */
    @Transactional
    public void invalidatePlaceCache(String meetingUuid) {
        // 1. Redis 캐시 삭제 (SCAN 사용 - 논블로킹 방식)
        String pattern = CacheKeys.meetingPlacesPattern(meetingUuid);
        try {
            int deletedCount = scanAndDelete(pattern);
            if (deletedCount > 0) {
                log.info("Redis 캐시 삭제: meetingUuid={}, 삭제된 키 수={}", meetingUuid, deletedCount);
            }
        } catch (Exception e) {
            log.warn("Redis 캐시 삭제 실패: meetingUuid={}, error={}", meetingUuid, e.getMessage());
        }

        // 2. DB 캐시 삭제 (PlaceCandidate)
        placeCandidateRepository.deleteByMeetingMeetingUuid(meetingUuid);
        log.info("PlaceCandidate 삭제: meetingUuid={}", meetingUuid);
    }

    /**
     * SCAN 명령을 사용하여 패턴에 맞는 키 삭제 (논블로킹)
     */
    private int scanAndDelete(String pattern) {
        int deletedCount = 0;
        var scanOptions = org.springframework.data.redis.core.ScanOptions.scanOptions()
                .match(pattern)
                .count(100)
                .build();

        try (var cursor = redisTemplate.scan(scanOptions)) {
            while (cursor.hasNext()) {
                String key = (String) cursor.next();
                redisTemplate.delete(key);
                deletedCount++;
            }
        }
        return deletedCount;
    }
}
