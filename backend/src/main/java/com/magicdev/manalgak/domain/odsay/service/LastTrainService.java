package com.magicdev.manalgak.domain.odsay.service;

import com.magicdev.manalgak.common.cache.CacheKeys;
import com.magicdev.manalgak.common.cache.CacheTTL;
import com.magicdev.manalgak.domain.odsay.dto.LastTrainResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class LastTrainService {

    private final RedisTemplate<String, Object> redisTemplate;

    public LastTrainResponse getLastTrain(Long participantId, Long candidateId) {
        String cacheKey = CacheKeys.lastTrainKey(participantId, candidateId);

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
        LocalDateTime lastTrainTime = LocalDateTime.now()
                .with(LocalTime.of(23, 30));

        return LastTrainResponse.builder()
                .stationName("서울역")
                .lineName("지하철 1호선")
                .lastTrainTime(lastTrainTime)
                .taxiFare(15000)
                .build();
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
