package com.magicdev.manalgak.domain.user_address.entity;

import com.magicdev.manalgak.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_address")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    @Column(length = 255)
    private String address;

    @Column(length = 50)
    private String category;

    public UserAddress(
            User user,
            String address,
            Double latitude,
            Double longitude,
            String category
    ) {
        this.user = user;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.category = category;
    }

    /**
     * 주소 정보 수정
     */
    public void update(String address, String category,Double latitude, Double longitude) {
        if (address != null) this.address = address;
        if (category != null) this.category = category;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
