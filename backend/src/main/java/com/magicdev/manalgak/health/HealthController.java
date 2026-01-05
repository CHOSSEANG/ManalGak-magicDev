package com.magicdev.manalgak.health;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "Health Check", description = "서버 상태 확인 API")
public class HealthController {

    @GetMapping
    @Operation(
            summary = "서버 상태 확인",
            description = "서버가 정상적으로 실행 중인지 확인합니다. 인증이 필요 없습니다.",
            security = {}  // 인증 불필요
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "서버 정상 작동 중",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    value = """
                                            {
                                              "status": "UP",
                                              "timestamp": "2026-01-05T19:30:00",
                                              "service": "manalgak-api"
                                            }
                                            """
                            )
                    )
            )
    })
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "timestamp", LocalDateTime.now(),
            "service", "manalgak-api"
        ));
    }
}
