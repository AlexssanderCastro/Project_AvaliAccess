package com.avaliaccess.aa_backend.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.avaliaccess.aa_backend.entity.User;
import com.avaliaccess.aa_backend.repository.UserRepository;
import com.avaliaccess.aa_backend.service.FileStorageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, FileStorageService fileStorageService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        return userRepository.findByEmail(authentication.getName())
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(new UserProfileResponse(
                    u.getId(), 
                    u.getName(), 
                    u.getEmail(), 
                    u.getPhotoUrl()
                )))
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(request.name());
        
        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        
        userRepository.save(user);
        
        return ResponseEntity.ok(new UserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPhotoUrl()
        ));
    }

    @PutMapping("/profile/photo")
    public ResponseEntity<?> uploadProfilePhoto(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Deletar foto antiga se existir
            if (user.getPhotoUrl() != null && !user.getPhotoUrl().isEmpty()) {
                try {
                    String oldFileName = user.getPhotoUrl().replace("/uploads/", "");
                    fileStorageService.deleteFile(oldFileName);
                } catch (IOException e) {
                    // Log error but continue
                }
            }
            
            // Salvar nova foto
            String fileName = fileStorageService.storeFile(file);
            user.setPhotoUrl("/uploads/" + fileName);
            userRepository.save(user);
            
            return ResponseEntity.ok(new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhotoUrl()
            ));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload photo");
        }
    }

    public record UserProfileResponse(Long id, String name, String email, String photoUrl) {}
    public record UpdateProfileRequest(String name, String password) {}
}
