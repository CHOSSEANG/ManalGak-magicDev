package com.magicdev.manalgak.domain.user_address.service.command;

import lombok.Builder;
import lombok.Getter;


@Builder
@Getter
public class UserAddressCommand {
    private Double latitude;
    private Double longitude;
    private String address;
    private String category;
}