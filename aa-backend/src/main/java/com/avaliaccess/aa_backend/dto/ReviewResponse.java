package com.avaliaccess.aa_backend.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
    Long id,
    Long establishmentId,
    Long userId,
    String userName,
    Integer rating,
    String comment,
    Boolean hasRamp,
    Boolean hasAccessibleRestroom,
    Boolean hasAccessibleParking,
    Boolean hasElevator,
    Boolean hasAccessibleEntrance,
    Boolean hasTactileFloor,
    Boolean hasSignLanguageService,
    Boolean hasAccessibleSeating,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
