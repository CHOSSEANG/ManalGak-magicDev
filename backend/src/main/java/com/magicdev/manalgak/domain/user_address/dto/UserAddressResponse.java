package com.magicdev.manalgak.domain.user_address.dto;

import com.magicdev.manalgak.domain.user_address.entity.UserAddress;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Builder
@Getter
public class UserAddressResponse {

    private Long id;
    private Long userId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;
    private String category;
    public static UserAddressResponse from(UserAddress userAddress){
        return UserAddressResponse.builder()
                .address(userAddress.getAddress())
                .latitude(userAddress.getLatitude())
                .longitude(userAddress.getLongitude())
                .userId(userAddress.getUser().getId())
                .id(userAddress.getId())
                .category(userAddress.getCategory())
                .build();
    }
}
