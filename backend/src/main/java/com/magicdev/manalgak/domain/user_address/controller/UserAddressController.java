package com.magicdev.manalgak.domain.user_address.controller;

import com.magicdev.manalgak.common.dto.CommonResponse;
import com.magicdev.manalgak.domain.user_address.dto.UserAddressRequest;
import com.magicdev.manalgak.domain.user_address.dto.UserAddressResponse;
import com.magicdev.manalgak.domain.user_address.service.UserAddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "UserAddress", description = "주소 API")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/v1/addresses")
public class UserAddressController {

    private final UserAddressService userAddressService;

    @Operation(summary = "주소 추가", description = "주소를 추가합니다.")
    @PostMapping
    public CommonResponse<UserAddressResponse> saveAddress(
            @RequestBody UserAddressRequest request,
            @AuthenticationPrincipal Long userId
    ) {
        return CommonResponse.success(userAddressService.saveUserAddress(request,userId));
    }

    @Operation(summary = "주소 수정", description = "주소를 수정합니다.")
    @PatchMapping("{userAddressId}")
    public CommonResponse<UserAddressResponse> updateAddress(
            @RequestBody UserAddressRequest request,
            @PathVariable Long userAddressId,
            @AuthenticationPrincipal Long userId
    ) {
        return CommonResponse.success(userAddressService.updateUserAddress(request,userAddressId,userId));
    }

    @Operation(summary = "주소 조회", description = "주소를 조회합니다.")
    @GetMapping("/user")
    public CommonResponse<List<UserAddressResponse>> getAddresses(
            @AuthenticationPrincipal Long userId
    ) {
        return CommonResponse.success(userAddressService.getAddresses(userId));
    }

    @Operation(summary = "주소 삭제", description = "주소를 삭제합니다.")
    @DeleteMapping("{userAddressId}")
    public CommonResponse<Void> deleteAddresses(
            @PathVariable Long userAddressId,
            @AuthenticationPrincipal Long userId
    ) {
        userAddressService.deleteUserAddress(userAddressId, userId);
        return CommonResponse.success(null);
    }

}
