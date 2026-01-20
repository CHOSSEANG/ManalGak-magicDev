package com.magicdev.manalgak.domain.user_address.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.domain.user.entity.User;
import com.magicdev.manalgak.domain.user.repository.UserRepository;
import com.magicdev.manalgak.domain.user_address.dto.UserAddressResponse;
import com.magicdev.manalgak.domain.user_address.entity.UserAddress;
import com.magicdev.manalgak.domain.user_address.repository.UserAddressRepository;
import com.magicdev.manalgak.domain.user_address.service.command.UserAddressCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAddressServiceImpl implements UserAddressService {
    private static final int MAX_ADDRESS_COUNT = 3;
    private final UserAddressRepository userAddressRepository;
    private final UserRepository userRepository;

    @Override
    public List<UserAddressResponse> getAddresses(Long userId) {

        return userAddressRepository.findByUserId(userId).stream()
                .map(UserAddressResponse::from)
                .toList();
    }

    @Override
    public UserAddressResponse saveUserAddress(UserAddressCommand userAddressCommand, Long userId) {

        User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if(userAddressRepository.countByUserId(userId) >= MAX_ADDRESS_COUNT){
            throw new BusinessException(ErrorCode.ADDRESS_LIMIT);
        }
        UserAddress userAddress = new UserAddress(user, userAddressCommand.getAddress(), userAddressCommand.getLatitude(), userAddressCommand.getLongitude(), userAddressCommand.getCategory());
        UserAddress save = userAddressRepository.save(userAddress);
        return UserAddressResponse.from(save);
    }

    @Override
    @Transactional
    public UserAddressResponse updateUserAddress(UserAddressCommand userAddressCommand, Long userAddressId,Long userId) {
        UserAddress userAddress = userAddressRepository.findById(userAddressId).orElseThrow(()->new BusinessException(ErrorCode.ADDRESS_NOT_FOUND));
        if(!userAddress.getUser().getId().equals(userId)){
            throw new BusinessException(ErrorCode.NO_AUTHORITY);
        }
        userAddress.update(userAddressCommand.getAddress(), userAddressCommand.getLatitude(),userAddressCommand.getLongitude(),userAddressCommand.getCategory());
        return UserAddressResponse.from(userAddress);
    }

    @Transactional
    @Override
    public void deleteUserAddress(Long userAddressId, Long userId) {
        UserAddress userAddress = userAddressRepository.findById(userAddressId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ADDRESS_NOT_FOUND));
        if (!userAddress.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.NO_AUTHORITY);
        }
        userAddressRepository.deleteById(userAddressId);
    }
}
