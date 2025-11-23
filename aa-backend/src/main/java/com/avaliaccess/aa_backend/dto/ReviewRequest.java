package com.avaliaccess.aa_backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReviewRequest(
    @NotNull(message = "Nota é obrigatória")
    @Min(value = 0, message = "Nota mínima é 0")
    @Max(value = 5, message = "Nota máxima é 5")
    Integer rating,
    
    String comment,
    
    @NotNull Boolean hasRamp,
    @NotNull Boolean hasAccessibleRestroom,
    @NotNull Boolean hasAccessibleParking,
    @NotNull Boolean hasElevator,
    @NotNull Boolean hasAccessibleEntrance,
    @NotNull Boolean hasTactileFloor,
    @NotNull Boolean hasSignLanguageService,
    @NotNull Boolean hasAccessibleSeating
) {}
