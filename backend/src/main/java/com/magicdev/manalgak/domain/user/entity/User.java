package com.magicdev.manalgak.domain.user.entity;

import com.magicdev.manalgak.common.util.DateTimeUtil;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Table(name = "users")
@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(name = "kakao_id", nullable = false, unique = true)
	private Long kakaoId;

	private String nickname;
	@Column(name = "profile_image_url")
	private String profileImageUrl;

	private LocalDateTime createdAt;

	@PrePersist
	public void prePersist() {
		this.createdAt = DateTimeUtil.now();
	}
}
