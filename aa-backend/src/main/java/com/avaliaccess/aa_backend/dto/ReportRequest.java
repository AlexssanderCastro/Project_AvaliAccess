package com.avaliaccess.aa_backend.dto;

import com.avaliaccess.aa_backend.entity.ReportReason;
import com.avaliaccess.aa_backend.entity.ReportType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReportRequest(
    @NotNull(message = "Tipo é obrigatório")
    ReportType type,
    
    @NotNull(message = "Motivo é obrigatório")
    ReportReason reason,
    
    @NotNull(message = "Descrição é obrigatória")
    @Size(min = 10, max = 1000, message = "Descrição deve ter entre 10 e 1000 caracteres")
    String description,
    
    Long establishmentId,
    
    Long reviewId
) {
    public void validate() {
        if (type == ReportType.ESTABLISHMENT && establishmentId == null) {
            throw new IllegalArgumentException("ID do estabelecimento é obrigatório para reports de estabelecimento");
        }
        if (type == ReportType.REVIEW && reviewId == null) {
            throw new IllegalArgumentException("ID da avaliação é obrigatório para reports de avaliação");
        }
        if (establishmentId != null && reviewId != null) {
            throw new IllegalArgumentException("Report deve ser de estabelecimento OU avaliação, não ambos");
        }
    }
}
