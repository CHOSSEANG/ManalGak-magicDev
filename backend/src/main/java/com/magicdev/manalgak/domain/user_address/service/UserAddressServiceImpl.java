package com.magicdev.manalgak.domain.user_address.service;

import com.magicdev.manalgak.common.exception.BusinessException;
import com.magicdev.manalgak.common.exception.ErrorCode;
import com.magicdev.manalgak.domain.geocoding.dto.GeoPoint;
import com.magicdev.manalgak.domain.geocoding.service.GeocodingService;
import com.magicdev.manalgak.domain.user.entity.User;
import com.magicdev.manalgak.domain.user.repository.UserRepository;
import com.magicdev.manalgak.domain.user_address.dto.UserAddressResponse;
import com.magicdev.manalgak.domain.user_address.entity.UserAddress;
import com.magicdev.manalgak.domain.user_address.repository.UserAddressRepository;
import com.magicdev.manalgak.domain.user_address.service.command.UserAddressCommand;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class UserAddressServiceImpl implements UserAddressService {
    private static final int MAX_ADDRESS_COUNT = 3;
    private final UserAddressRepository userAddressRepository;
    private final UserRepository userRepository;
    private final GeocodingService geocodingService;

    @Override
    public List<UserAddressResponse> getAddresses(Long userId) {
        return userAddressRepository.findByUserId(userId).stream()
                .map(UserAddressResponse::from)
                .toList();
    }

    @Override
    public UserAddressResponse saveUserAddress(
            UserAddressCommand command,
            Long userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (userAddressRepository.countByUserId(userId) >= MAX_ADDRESS_COUNT) {
            throw new BusinessException(ErrorCode.ADDRESS_LIMIT);
        }

        Double latitude = null;
        Double longitude = null;

        if (command.getAddress() != null) {
            GeoPoint geoPoint = geocodingService.geocode(command.getAddress());
            if (geoPoint == null) {
                throw new BusinessException(ErrorCode.ADDRESS_NOT_FOUND);
            }
            latitude = geoPoint.getLatitude();
            longitude = geoPoint.getLongitude();
        }

        UserAddress userAddress = new UserAddress(
                user,
                command.getAddress(),
                latitude,
                longitude,
                command.getCategory()
        );

        UserAddress saved = userAddressRepository.save(userAddress);
        return UserAddressResponse.from(saved);
    }

    @Override
    @Transactional
    public UserAddressResponse updateUserAddress(
            UserAddressCommand command,
            Long userAddressId,
            Long userId
    ) {

        UserAddress userAddress = userAddressRepository.findById(userAddressId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ADDRESS_NOT_FOUND));

        if (!userAddress.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.NO_AUTHORITY);
        }

        Double latitude = null;
        Double longitude = null;

        if (command.getAddress() != null) {
            GeoPoint geoPoint = geocodingService.geocode(command.getAddress());
            if (geoPoint == null) {
                throw new BusinessException(ErrorCode.ADDRESS_NOT_FOUND);
            }
            latitude = geoPoint.getLatitude();
            longitude = geoPoint.getLongitude();
        }

        userAddress.update(
                command.getAddress(),
                command.getCategory(),
                latitude,
                longitude
        );

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
