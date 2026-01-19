package com.magicdev.manalgak.domain.user_address.service.command;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Builder
@Getter
public class UserAddressCommand {
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String address;
    private String category;
}