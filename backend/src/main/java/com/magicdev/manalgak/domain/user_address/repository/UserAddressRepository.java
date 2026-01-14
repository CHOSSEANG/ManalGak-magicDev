package com.magicdev.manalgak.domain.user_address.repository;

import com.magicdev.manalgak.domain.user_address.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAddressRepository extends JpaRepository<UserAddress,Long> {

    List<UserAddress> findByUserId(Long userId);

    Long countByUserId(Long userId);
}
