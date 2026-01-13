package com.magicdev.manalgak.domain.odsay.service;

import com.magicdev.manalgak.common.cache.CacheKeys;
import com.magicdev.manalgak.common.cache.CacheTTL;
import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.domain.external.odsay.client.OdsayClient;
import com.magicdev.manalgak.domain.external.odsay.dto.LastTrainInfo;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayTimeTableRequest;
import com.magicdev.manalgak.domain.external.odsay.dto.OdsayTimeTableResponse;
import com.magicdev.manalgak.domain.odsay.dto.LastTrainResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LastTrainService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final OdsayClient odsayClient;

    public LastTrainResponse getLastTrain(String meetingUuid, Long participantId, Long candidateId) {
        String cacheKey = CacheKeys.lastTrainKey(meetingUuid, participantId, candidateId);

        LastTrainResponse cached = getCachedLastTrain(cacheKey);
        if (cached != null) {
            log.info("Cache HIT: {}", cacheKey);
            cached.setFromCache(true);
            return cached;
        }

        log.info("Cache MISS: {}, calling ODsay API", cacheKey);
        LastTrainResponse response = callOdsayApi(participantId, candidateId);
        response.setFromCache(false);

        saveLastTrainToCache(cacheKey, response);

        return response;
    }

    private LastTrainResponse getCachedLastTrain(String cacheKey) {
        try {
            Object cached = redisTemplate.opsForValue().get(cacheKey);
            return cached != null ? (LastTrainResponse) cached : null;
        } catch (Exception e) {
            log.warn("Failed to get from cache: {}", e.getMessage());
            return null;
        }
    }

    private LastTrainResponse callOdsayApi(Long participantId, Long candidateId) {
        // TODO: 실제 구현시 participantId, candidateId로부터 station 정보 조회 필요
        // 현재는 테스트용 더미 stationID 사용
        String stationID = "222"; // 강남역 (테스트용)
        Integer wayCode = 1; // 1: 상행, 2: 하행

        try {
            OdsayTimeTableRequest request = OdsayTimeTableRequest.builder()
                    .stationID(stationID)
                    .wayCode(wayCode)
                    .showOff(getCurrentDayType())
                    .build();

            OdsayTimeTableResponse response = odsayClient.getTimeTable(request);
            LastTrainInfo lastTrainInfo = extractLastTrainInfo(response, wayCode);

            if (lastTrainInfo == null) {
                throw new BusinessException(ErrorCode.LAST_TRAIN_NOT_FOUND);
            }

            // LastTrainInfo를 LastTrainResponse로 변환
            LocalDateTime lastTrainTime = parseLastTrainTime(lastTrainInfo);

            return LastTrainResponse.builder()
                    .stationName(lastTrainInfo.getStationName())
                    .lineName(lastTrainInfo.getLineName())
                    .lastTrainTime(lastTrainTime)
                    .taxiFare(calculateTaxiFare(participantId, candidateId))
                    .build();

        } catch (Exception e) {
            log.error("Failed to get last train info: {}", e.getMessage());
            throw new BusinessException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }

    /**
     * 현재 요일 타입 반환
     * @return 1: 평일, 2: 토요일, 3: 일요일/공휴일
     */
    private Integer getCurrentDayType() {
        DayOfWeek dayOfWeek = LocalDate.now().getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY) {
            return 2;
        } else if (dayOfWeek == DayOfWeek.SUNDAY) {
            return 3;
        }
        return 1; // 평일
    }

    /**
     * ODsay 시간표 응답에서 막차 정보 추출
     */
    private LastTrainInfo extractLastTrainInfo(OdsayTimeTableResponse response, Integer wayCode) {
        if (response == null || response.getResult() == null) {
            return null;
        }

        OdsayTimeTableResponse.Result result = response.getResult();

        // 요일별 시간표 선택 (getCurrentDayType()와 동일한 로직)
        DayOfWeek dayOfWeek = LocalDate.now().getDayOfWeek();
        OdsayTimeTableResponse.TimeList timeList;
        if (dayOfWeek == DayOfWeek.SATURDAY) {
            timeList = result.getSatList();
        } else if (dayOfWeek == DayOfWeek.SUNDAY) {
            timeList = result.getSunList();
        } else {
            timeList = result.getOrdList();
        }

        if (timeList == null) {
            return null;
        }

        // 방향 선택 (1: 상행/up, 2: 하행/down)
        OdsayTimeTableResponse.Direction direction = wayCode == 1 ? timeList.getUp() : timeList.getDown();
        if (direction == null || direction.getTime() == null || direction.getTime().isEmpty()) {
            return null;
        }

        // 가장 마지막 시간대 블록 찾기 (Idx가 가장 큰 것)
        OdsayTimeTableResponse.TimeBlock lastBlock = direction.getTime().stream()
                .max((a, b) -> Integer.compare(a.getIdx(), b.getIdx()))
                .orElse(null);

        if (lastBlock == null || lastBlock.getList() == null || lastBlock.getList().isEmpty()) {
            return null;
        }

        // 시간 문자열 파싱: "10(성수) 23(성수) 38(성수) 54(삼성)"에서 마지막 시간 추출
        String[] times = lastBlock.getList().trim().split("\\s+");
        String lastTimeStr = times[times.length - 1];  // "54(삼성)"

        // 시간과 종착역 분리
        int openParen = lastTimeStr.indexOf('(');
        if (openParen == -1) {
            return null;
        }

        String minute = lastTimeStr.substring(0, openParen);  // "54"
        String terminal = lastTimeStr.substring(openParen + 1, lastTimeStr.length() - 1);  // "삼성"

        // HH:mm 형식으로 변환 (24시 이상은 다음날 00시부터 시작)
        int hour = lastBlock.getIdx() % 24;  // 24 -> 0, 25 -> 1
        boolean isNextDay = lastBlock.getIdx() >= 24;  // 24시 이상이면 다음날
        String lastTrainTime = String.format("%02d:%s", hour, minute);

        return LastTrainInfo.builder()
                .stationName(result.getStationName())
                .lineName(result.getLaneName())
                .lastTrainTime(lastTrainTime)
                .terminalStation(terminal)
                .isNextDay(isNextDay)
                .build();
    }

    /**
     * 막차 시간 문자열을 LocalDateTime으로 변환
     * @param lastTrainInfo 막차 정보 (시간 및 다음날 여부 포함)
     */
    private LocalDateTime parseLastTrainTime(LastTrainInfo lastTrainInfo) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime time = LocalTime.parse(lastTrainInfo.getLastTrainTime(), formatter);
        LocalDate date = LocalDate.now();

        // 다음날 막차인 경우 (24시 이상)
        if (lastTrainInfo.isNextDay()) {
            date = date.plusDays(1);
        }

        return LocalDateTime.of(date, time);
    }

    /**
     * 택시 요금 계산 (임시 구현)
     */
    private Integer calculateTaxiFare(Long participantId, Long candidateId) {
        // TODO: 실제 거리 기반 택시 요금 계산 로직 구현
        return 15000;
    }

    private void saveLastTrainToCache(String cacheKey, LastTrainResponse response) {
        try {
            redisTemplate.opsForValue().set(
                    cacheKey,
                    response,
                    CacheTTL.LAST_TRAIN
            );
            log.info("Saved to cache: {}", cacheKey);
        } catch (Exception e) {
            log.error("Failed to save to cache: {}", e.getMessage());
        }
    }
}
