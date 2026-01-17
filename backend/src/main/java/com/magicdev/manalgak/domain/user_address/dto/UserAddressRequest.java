package com.magicdev.manalgak.domain.user_address.dto;

import com.magicdev.manalgak.domain.user_address.service.command.UserAddressCommand;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Builder
@Getter
public class UserAddressRequest {

    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;
    private String category;

    public UserAddressCommand toCommand() {
        return UserAddressCommand.builder()
                .latitude(latitude)
                .longitude(longitude)
                .address(address)
                .category(category)
                .build();
    }
}
