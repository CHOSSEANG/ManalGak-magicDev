package com.magicdev.manalgak.domain.auth.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.auth.service.KakaoLoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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

        ResponseCookie cookie = ResponseCookie.from("token",jwtToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7*24*60*60)
                .sameSite("Lax")
                .build();

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.LOCATION, loginSuccessUrl)
                .build();
    }

    @Operation(summary = "로그아웃", description = "해당 웹을 로그아웃합니다.")
    @GetMapping("/auth/logout")
    public ResponseEntity<CommonResponse<Void>> logout(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("token",null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(CommonResponse.success(null));
    }


}
