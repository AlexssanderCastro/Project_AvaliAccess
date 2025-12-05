package com.avaliaccess.aa_backend.dto;

import java.time.LocalDateTime;

import com.avaliaccess.aa_backend.entity.ReportReason;
import com.avaliaccess.aa_backend.entity.ReportStatus;
import com.avaliaccess.aa_backend.entity.ReportType;

public record ReportResponse(
    Long id,
    Long reporterId,
    String reporterName,
    ReportType type,
    ReportReason reason,
    String description,
    Long establishmentId,
    String establishmentName,
    Long establishmentOwnerId,
    String establishmentOwnerName,
    Long reviewId,
    String reviewComment,
    Long reviewUserId,
    String reviewUserName,
    Long reviewEstablishmentId,
    String reviewEstablishmentName,
    ReportStatus status,
    Long resolvedById,
    String resolvedByName,
    String resolutionNotes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
