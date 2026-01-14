package com.magicdev.manalgak.common.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private SecretKey key;
    private final long expiration;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret,
                            @Value("${jwt.expiration}") long expiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    // 로그인 JWT 발급
    public String generateToken(Long userId, Long kakaoId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .issuedAt(now)
                .expiration(expiry)
                .claim("userId", userId)
                .claim("kakaoId", kakaoId)
                .signWith(key)
                .compact();

    }

    // 참여자 JWT 발급
    public String generateParticipantToken(Long participantId, String meetingUuid) {

        Date now = new Date();
        Date expiry = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .issuedAt(now)
                .expiration(expiry)
                .claim("participantId", participantId)
                .claim("meetingUuid", meetingUuid)
                .signWith(key)
                .compact();

    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    public Long getUserId(String token) {
        return getClaims(token).get("userId", Long.class);
    }

    public Long getKakaoId(String token) {
        return getClaims(token).get("kakaoId", Long.class);
    }

    public Long getParticipantId(String token) {
        return getClaims(token).get("participantId", Long.class);
    }

    public String getMeetingUuid(String token) {
        return getClaims(token).get("meetingUuid", String.class);
    }

    public String resolveToken(String header){
        if(header != null && header.startsWith("Bearer ")){
            return header.substring(7);
        }
        return null;
    }

}