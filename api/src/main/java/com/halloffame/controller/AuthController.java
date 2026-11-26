package com.halloffame.controller;

import com.halloffame.dto.AuthDto.LoginRequest;
import com.halloffame.dto.AuthDto.LoginResponse;
import com.halloffame.dto.AuthDto.UserInfo;
import com.halloffame.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username().trim(), request.password())
        );
        String role = auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .map(a -> a.startsWith("ROLE_") ? a.substring(5) : a)
            .findFirst()
            .orElse("ADMIN");

        String token = jwtService.generateToken(auth.getName(), role);
        return new LoginResponse(
            token,
            jwtService.getExpirySeconds(),
            new UserInfo(auth.getName(), role)
        );
    }

    @GetMapping("/me")
    public UserInfo me(Authentication authentication) {
        String role = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .map(a -> a.startsWith("ROLE_") ? a.substring(5) : a)
            .findFirst()
            .orElse("ADMIN");
        return new UserInfo(authentication.getName(), role);
    }
}
