package com.halloffame.security;

import com.halloffame.config.AppProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirySeconds;

    public JwtService(AppProperties properties) {
        String rawSecret = properties.jwt().secret();
        byte[] keyBytes;
        try {
            // Derive a fixed 256-bit key even if a shorter dev secret is configured.
            keyBytes = MessageDigest.getInstance("SHA-256")
                .digest(rawSecret.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.expirySeconds = properties.jwt().expirySeconds();
    }

    public String generateToken(String username, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(expirySeconds)))
            .signWith(key)
            .compact();
    }

    public Claims parseAndValidate(String token) throws JwtException {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    public long getExpirySeconds() {
        return expirySeconds;
    }
}
