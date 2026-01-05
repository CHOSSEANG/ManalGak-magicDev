package com.magicdev.manalgak.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${spring.profiles.active:local}")
    private String activeProfile;

    @Bean
    public OpenAPI openAPI() {
        // 프로젝트 기본 정보
        Info info = new Info()
                .title("만날각 (ManalGak) API")
                .version("v1.0")
                .description("""
                        목적 기반 중간 만남 장소 추천 서비스

                        ## 주요 기능
                        - 모임 생성 및 참여자 관리
                        - 중점 계산 알고리즘
                        - 목적별 장소 추천 (Kakao API)
                        - 대중교통 경로 조회 (ODsay API)
                        - AI 요약 (OpenAI GPT-4o-mini)

                        ## 인증 방식
                        - 참여자 토큰 (JWT): 참여자 추가 시 발급, 수정/삭제 시 필요
                        - 헤더: `X-Participant-Token: <JWT>`
                        """)
                .contact(new Contact()
                        .name("ManalGak Team")
                        .email("team@manalgak.com")
                        .url("https://github.com/CHOSSEANG/ManalGak-magicDev"))
                .license(new License()
                        .name("MIT License")
                        .url("https://opensource.org/licenses/MIT"));

        // 서버 URL 설정 (환경별)
        Server localServer = new Server()
                .url("http://localhost:8080")
                .description("로컬 개발 서버");

        Server devServer = new Server()
                .url("https://dev.manalgak.com")
                .description("개발 서버");

        Server prodServer = new Server()
                .url("https://manalgak.com")
                .description("운영 서버");

        // JWT 인증 스킴 정의
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER)
                .name("X-Participant-Token")
                .description("참여자 토큰 (JWT)");

        // SecurityRequirement 정의
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("participantAuth");

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer, devServer, prodServer))
                .components(new Components()
                        .addSecuritySchemes("participantAuth", securityScheme))
                .addSecurityItem(securityRequirement); // 전역 보안 적용
    }
}
