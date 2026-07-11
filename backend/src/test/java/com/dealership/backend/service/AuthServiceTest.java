package com.dealership.backend.service;

import com.dealership.backend.dto.AuthResponse;
import com.dealership.backend.dto.RegisterRequest;
import com.dealership.backend.exception.UserAlreadyExistsException;
import com.dealership.backend.model.User;
import com.dealership.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRegisterUserSuccessfully() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Meet");
        request.setEmail("meet@gmail.com");
        request.setPassword("123456");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");

        AuthResponse response = authService.register(request);

        assertEquals("User registered successfully", response.getMessage());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        RegisterRequest request = new RegisterRequest();
        request.setName("Meet");
        request.setEmail("meet@gmail.com");
        request.setPassword("123456");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class,
                () -> authService.register(request));

        verify(userRepository, never()).save(any(User.class));
    }
}