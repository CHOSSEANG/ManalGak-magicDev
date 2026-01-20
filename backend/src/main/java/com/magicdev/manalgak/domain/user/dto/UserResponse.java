package com.magicdev.manalgak.domain.user.dto;

import com.magicdev.manalgak.domain.user.entity.User;
import lombok.Getter;

@Getter
public class UserResponse {

    private String nickname;
    private String profileImageUrl;

    private UserResponse(String nickname, String profileImageUrl) {
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
    }

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getNickname(),
                user.getProfileImageUrl()
        );
    }
}
