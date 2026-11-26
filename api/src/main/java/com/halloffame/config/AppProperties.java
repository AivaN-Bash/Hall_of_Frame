package com.halloffame.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
    Cors cors,
    Jwt jwt,
    Admin admin,
    Storage storage
) {
    public record Cors(String allowedOrigin) {}
    public record Jwt(String secret, long expirySeconds) {}
    public record Admin(String username, String password) {}
    public record Storage(String localDir, long maxUploadBytes) {}
}
