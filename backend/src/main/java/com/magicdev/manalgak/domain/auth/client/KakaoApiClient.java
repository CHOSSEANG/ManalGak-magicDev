package com.magicdev.manalgak.domain.auth.client;

import com.magicdev.manalgak.domain.auth.dto.KakaoTokenResponse;
import com.magicdev.manalgak.domain.auth.dto.KakaoUserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class KakaoApiClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${api.kakao.key}")
    private String clientId;

    @Value("${api.kakao.client-secret}")
    private String clientSecret;

    @Value("${api.kakao.redirect-uri}")
    private String redirectUri;


    public String getAccessToken(String authorizationCode){
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type","authorization_code");
        body.add("client_id",clientId);
        body.add("client_secret",clientSecret);
        body.add("redirect_uri",redirectUri);
        body.add("code",authorizationCode);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body,headers);

        ResponseEntity<KakaoTokenResponse> response = restTemplate.postForEntity(tokenUrl,request,KakaoTokenResponse.class);

        return response.getBody().getAccessToken();
    }

    public KakaoUserResponse getUserInfo(String accessToken) {

        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<KakaoUserResponse> response =
                restTemplate.exchange(
                        userInfoUrl,
                        HttpMethod.POST,
                        request,
                        KakaoUserResponse.class
                );
        return response.getBody();
    }


}

