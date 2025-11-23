package com.avaliaccess.aa_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.avaliaccess.aa_backend.dto.AccessibilityFeaturesResponse;
import com.avaliaccess.aa_backend.dto.ReviewRequest;
import com.avaliaccess.aa_backend.dto.ReviewResponse;
import com.avaliaccess.aa_backend.service.ReviewService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/establishment/{establishmentId}")
    public ResponseEntity<?> createReview(
            @PathVariable Long establishmentId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ReviewResponse response = reviewService.createReview(establishmentId, request, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            ReviewResponse response = reviewService.updateReview(reviewId, request, userEmail);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            reviewService.deleteReview(reviewId, userEmail);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/establishment/{establishmentId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByEstablishment(
            @PathVariable Long establishmentId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByEstablishment(establishmentId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/establishment/{establishmentId}/accessibility")
    public ResponseEntity<AccessibilityFeaturesResponse> getAccessibilityFeatures(
            @PathVariable Long establishmentId) {
        AccessibilityFeaturesResponse features = reviewService.getAccessibilityFeatures(establishmentId);
        return ResponseEntity.ok(features);
    }
}
