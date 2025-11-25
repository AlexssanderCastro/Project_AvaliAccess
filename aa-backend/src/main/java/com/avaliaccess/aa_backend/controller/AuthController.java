package com.avaliaccess.aa_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.avaliaccess.aa_backend.dto.AuthDtos.AuthResponse;
import com.avaliaccess.aa_backend.dto.AuthDtos.LoginRequest;
import com.avaliaccess.aa_backend.dto.AuthDtos.RegisterRequest;
import com.avaliaccess.aa_backend.dto.ErrorResponse;
import com.avaliaccess.aa_backend.entity.Role;
import com.avaliaccess.aa_backend.entity.User;
import com.avaliaccess.aa_backend.repository.UserRepository;
import com.avaliaccess.aa_backend.security.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Email already registered"));
        }
        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.getRoles().add(Role.USUARIO);
        userRepository.save(user);

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", user.getRoles());
        String token = jwtService.generateToken(user.getEmail(), claims);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        String username = auth.getName();
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", auth.getAuthorities());
        String token = jwtService.generateToken(username, claims);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
