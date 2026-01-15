package com.magicdev.manalgak.domain.user_address.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Builder
@Getter
public class UserAddressRequest {

    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;

}
