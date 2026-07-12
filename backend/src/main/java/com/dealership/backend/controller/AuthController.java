package com.dealership.backend.controller;

import com.dealership.backend.dto.AuthResponse;
import com.dealership.backend.dto.RegisterRequest;
import com.dealership.backend.service.AuthService;
import com.dealership.backend.dto.LoginRequest;
import com.dealership.backend.dto.LoginResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}