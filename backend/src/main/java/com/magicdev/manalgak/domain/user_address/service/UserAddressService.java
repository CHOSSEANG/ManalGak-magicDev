package com.magicdev.manalgak.domain.user_address.service;

import com.magicdev.manalgak.domain.user_address.dto.UserAddressRequest;
import com.magicdev.manalgak.domain.user_address.dto.UserAddressResponse;

import java.util.List;

public interface UserAddressService {

    List<UserAddressResponse> getAddresses(Long userId);

    UserAddressResponse saveUserAddress(UserAddressRequest request, Long userId);

    UserAddressResponse updateUserAddress(UserAddressRequest request, Long userAddressId, Long userId);

    void deleteUserAddress(Long userAddressId, Long userId);

}
