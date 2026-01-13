package com.magicdev.manalgak.integration;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RouteIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("경로 조회 API 통합 테스트")
    void getRoutes_integration() throws Exception {
        // Note: This test requires test data to be set up
        // For now, we're testing the endpoint availability

        String meetingUuid = "test-uuid";
        Long candidateId = 1L;

        mockMvc.perform(get("/api/v1/meetings/{meetingUuid}/candidates/{candidateId}/routes",
                        meetingUuid, candidateId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").exists());
    }

    @Test
    @DisplayName("막차 정보 조회 API 통합 테스트")
    void getLastTrain_integration() throws Exception {
        String meetingUuid = "test-uuid";
        Long participantId = 1L;
        Long candidateId = 1L;

        mockMvc.perform(get("/api/v1/meetings/{meetingUuid}/last-train", meetingUuid)
                        .param("participantId", String.valueOf(participantId))
                        .param("candidateId", String.valueOf(candidateId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").exists());
    }

    @Test
    @DisplayName("존재하지 않는 후보지 조회 - 404 에러")
    void getRoutes_candidateNotFound() throws Exception {
        String meetingUuid = "test-uuid";
        Long candidateId = 999999L;

        mockMvc.perform(get("/api/v1/meetings/{meetingUuid}/candidates/{candidateId}/routes",
                        meetingUuid, candidateId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error").exists());
    }
}