package com.avaliaccess.aa_backend.dto;

import java.time.LocalDateTime;

public record EstablishmentResponse(
    Long id,
    String name,
    String address,
    String city,
    String state,
    String type,
    String photoUrl,
    Double averageRating,
    Integer totalRatings,
    String createdByName,
    Long createdById,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
