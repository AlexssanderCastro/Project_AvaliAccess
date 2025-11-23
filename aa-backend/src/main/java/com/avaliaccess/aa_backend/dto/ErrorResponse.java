package com.avaliaccess.aa_backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
    String message,
    LocalDateTime timestamp,
    List<String> details
) {
    public ErrorResponse(String message) {
        this(message, LocalDateTime.now(), List.of());
    }

    public ErrorResponse(String message, List<String> details) {
        this(message, LocalDateTime.now(), details);
    }
}
