package com.magicdev.manalgak.common.config;

import com.magicdev.manalgak.domain.algorithm.entity.MeetingCandidate;
import com.magicdev.manalgak.domain.algorithm.repository.MeetingCandidateRepository;
import com.magicdev.manalgak.domain.participant.entity.Participant;
import com.magicdev.manalgak.domain.participant.repository.ParticipantRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 로컬 테스트용 In-Memory Repository 설정
 *
 * 실제 JPA Repository가 없을 때만 동작합니다 (@ConditionalOnMissingBean).
 * MySQL을 사용할 때는 이 설정이 무시됩니다.
 *
 * 용도: ODsay API 테스트 시 임시 데이터 제공
 */
@Configuration
public class InMemoryRepositoryConfig {

    @Bean
    @ConditionalOnMissingBean(MeetingCandidateRepository.class)
    public MeetingCandidateRepository meetingCandidateRepository() {
        Map<Long, MeetingCandidate> store = new ConcurrentHashMap<>();
        store.put(1L, MeetingCandidate.builder()
                .id(1L)
                .name("Sample Candidate")
                .latitude(37.5665)
                .longitude(126.9780)
                .address("Seoul, Korea")
                .build());

        return candidateId -> Optional.ofNullable(store.get(candidateId));
    }

    @Bean
    @ConditionalOnMissingBean(ParticipantRepository.class)
    public ParticipantRepository participantRepository() {
        Map<String, List<Participant>> store = new ConcurrentHashMap<>();
        store.put("sample-meeting", List.of(
                Participant.builder()
                        .id(1L)
                        .name("Participant 1")
                        .startLatitude(37.5651)
                        .startLongitude(126.9895)
                        .build(),
                Participant.builder()
                        .id(2L)
                        .name("Participant 2")
                        .startLatitude(37.5704)
                        .startLongitude(126.9920)
                        .build()
        ));

        return meetingUuid -> store.getOrDefault(meetingUuid, List.of());
    }
}
