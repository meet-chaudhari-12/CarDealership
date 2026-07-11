package com.dealership.backend.service;

import com.dealership.backend.dto.AuthResponse;
import com.dealership.backend.dto.RegisterRequest;
import com.dealership.backend.exception.UserAlreadyExistsException;
import com.dealership.backend.model.Role;
import com.dealership.backend.model.User;
import com.dealership.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return new AuthResponse("User registered successfully");
    }
}