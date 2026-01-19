package com.magicdev.manalgak.domain.user_address.entity;

import com.magicdev.manalgak.domain.user.dto.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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

    @Column(precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 11,scale = 8)
    private BigDecimal longitude;

    @Column(length = 255)
    private String address;

    @Column(length = 50)
    private String category;

    public UserAddress(User user, String address, BigDecimal latitude, BigDecimal longitude, String category) {
        this.user = user;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.category =category;
    }

    public void update(String address, BigDecimal latitude, BigDecimal longitude, String category) {
        if(address != null) this.address = address;
        if(latitude != null) this.latitude = latitude;
        if(longitude != null) this.longitude = longitude;
        if(category != null) this.category = category;
    }


}
