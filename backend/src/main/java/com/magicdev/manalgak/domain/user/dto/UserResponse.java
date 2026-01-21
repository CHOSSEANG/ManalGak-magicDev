package com.magicdev.manalgak.domain.user.dto;

import com.magicdev.manalgak.domain.user.entity.User;
import lombok.Getter;

@Getter
public class UserResponse {

    private String nickname;
    private String profileImageUrl;
    private Long userId;

    public UserResponse(String nickname, String profileImageUrl, Long userId) {
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
        this.userId = userId;
    }


    public static UserResponse from(User user) {
        return new UserResponse(
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getId()
        );
    }
}
