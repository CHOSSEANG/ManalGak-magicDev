package com.magicdev.manalgak.domain.user.repository;

import com.magicdev.manalgak.domain.user.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByKakaoId(Long kakaoId);

    boolean existsByKakaoId(Long kakaoId);
}