package com.magicdev.manalgak.domain.auth.service;

import com.magicdev.manalgak.common.jwt.JwtTokenProvider;
import com.magicdev.manalgak.domain.auth.client.KakaoApiClient;
import com.magicdev.manalgak.domain.auth.dto.KakaoUserResponse;
import com.magicdev.manalgak.domain.user.dto.User;
import com.magicdev.manalgak.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoLoginService {

    private final KakaoApiClient kakaoApiClient;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public String login(String authorizationCode){
        String accessToken = kakaoApiClient.getAccessToken(authorizationCode);

        KakaoUserResponse kakaoUserResponse = kakaoApiClient.getUserInfo(accessToken);

        final String profileImageUrl = kakaoUserResponse.getKakao_account() != null &&
                kakaoUserResponse.getKakao_account().getProfile() != null
                ? kakaoUserResponse.getKakao_account().getProfile().getProfile_image_url()
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

        User user = userRepository.findByKakaoId(kakaoUserResponse.getId())
                .orElseGet(() -> User.builder()
                        .kakaoId(kakaoUserResponse.getId())
                        .profileImageUrl(profileImageUrl)
                        .nickname(kakaoUserResponse.getKakao_account().getProfile().getNickname())
                        .build());
        userRepository.save(user);

        return jwtTokenProvider.generateToken(
                user.getId(),
                user.getKakaoId()
        );
    }
}
