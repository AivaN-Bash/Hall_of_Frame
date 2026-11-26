package com.halloffame.dto;

import jakarta.validation.constraints.NotBlank;

public final class AuthDto {
    private AuthDto() {}

    public record LoginRequest(
        @NotBlank(message = "Username is required") String username,
        @NotBlank(message = "Password is required") String password
    ) {}

    public record UserInfo(String username, String role) {}

    public record LoginResponse(String token, long expiresIn, UserInfo user) {}
}
