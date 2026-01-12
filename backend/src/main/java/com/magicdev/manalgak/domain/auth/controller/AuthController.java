package com.magicdev.manalgak.domain.auth.controller;

import com.magicdev.manalgak.domain.auth.service.KakaoLoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "Auth", description = "로그인 API")
@Slf4j
@Controller
@RequiredArgsConstructor
public class AuthController {

    @Value("${frontend.login-success-url}")
    private String loginSuccessUrl;

    private final KakaoLoginService kakaoLoginService;

    @Operation(summary = "카카오 로그인 콜백", description = "카카오 로그인 후 redirect되는 콜백 URL입니다.")
    @GetMapping("/auth/kakao/callback")
    public ResponseEntity<?> kakaoCallback( @RequestParam("code") String code) {
        String jwtToken = kakaoLoginService.login(code);
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .header(
                        HttpHeaders.LOCATION,
                        loginSuccessUrl + "?token=" + jwtToken
                )
                .build();
    }


}
