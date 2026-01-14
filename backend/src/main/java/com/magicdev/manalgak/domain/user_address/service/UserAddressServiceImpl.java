package com.magicdev.manalgak.domain.user_address.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.domain.user.dto.User;
import com.magicdev.manalgak.domain.user.repository.UserRepository;
import com.magicdev.manalgak.domain.user_address.dto.UserAddressRequest;
import com.magicdev.manalgak.domain.user_address.dto.UserAddressResponse;
import com.magicdev.manalgak.domain.user_address.entity.UserAddress;
import com.magicdev.manalgak.domain.user_address.repository.UserAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAddressServiceImpl implements UserAddressService {

    private final UserAddressRepository userAddressRepository;
    private final UserRepository userRepository;

    @Override
    public List<UserAddressResponse> getAddresses(Long userId) {

        return userAddressRepository.findByUserId(userId).stream()
                .map(UserAddressResponse::from)
                .toList();
    }

    @Override
    public UserAddressResponse saveUserAddress(UserAddressRequest request, Long userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if(userAddressRepository.countByUserId(userId) >= 3){
            throw new BusinessException(ErrorCode.ADDRESS_LIMIT);
        }
        UserAddress userAddress = new UserAddress(user, request.getAddress(), request.getLatitude(), request.getLongitude());
        UserAddress save = userAddressRepository.save(userAddress);
        return UserAddressResponse.from(save);
    }

    @Override
    @Transactional
    public UserAddressResponse updateUserAddress(UserAddressRequest request, Long userAddressId) {
        UserAddress userAddress = userAddressRepository.findById(userAddressId).orElseThrow(()->new BusinessException(ErrorCode.ADDRESS_NOT_FOUND));
        userAddress.update(request.getAddress(), request.getLatitude(),request.getLongitude());
        return UserAddressResponse.from(userAddress);
    }

    @Override
    public void deleteUserAddress(Long userAddressId) {
        userAddressRepository.deleteById(userAddressId);
    }
}
