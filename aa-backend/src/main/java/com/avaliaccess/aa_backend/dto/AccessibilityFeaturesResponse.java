package com.avaliaccess.aa_backend.dto;

public record AccessibilityFeaturesResponse(
    Boolean hasRamp,
    Boolean hasAccessibleRestroom,
    Boolean hasAccessibleParking,
    Boolean hasElevator,
    Boolean hasAccessibleEntrance,
    Boolean hasTactileFloor,
    Boolean hasSignLanguageService,
    Boolean hasAccessibleSeating
) {}
