package com.magicdev.manalgak.domain.user_address.dto;

import com.magicdev.manalgak.domain.user_address.service.command.UserAddressCommand;
import lombok.Builder;
import lombok.Getter;


@Builder
@Getter
public class UserAddressRequest {

    private String address;
    private String category;

    public UserAddressCommand toCommand() {
        return UserAddressCommand.builder()
                .address(address)
                .category(category)
                .build();
    }
}
