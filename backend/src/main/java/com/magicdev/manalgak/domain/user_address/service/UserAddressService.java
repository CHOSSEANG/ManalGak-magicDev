package com.magicdev.manalgak.domain.user_address.service;

import com.magicdev.manalgak.domain.user_address.dto.UserAddressResponse;
import com.magicdev.manalgak.domain.user_address.service.command.UserAddressCommand;

import java.util.List;

public interface UserAddressService {

    List<UserAddressResponse> getAddresses(Long userId);

    UserAddressResponse saveUserAddress(UserAddressCommand userAddressCommand, Long userId);

    UserAddressResponse updateUserAddress(UserAddressCommand userAddressCommand, Long userAddressId, Long userId);

    void deleteUserAddress(Long userAddressId, Long userId);

}
