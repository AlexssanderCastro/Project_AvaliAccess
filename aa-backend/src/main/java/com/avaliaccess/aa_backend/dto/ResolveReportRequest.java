package com.avaliaccess.aa_backend.dto;

import com.avaliaccess.aa_backend.entity.ReportStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ResolveReportRequest(
    @NotNull(message = "Status é obrigatório")
    ReportStatus status,
    
    @Size(max = 1000, message = "Notas de resolução devem ter no máximo 1000 caracteres")
    String resolutionNotes
) {}
