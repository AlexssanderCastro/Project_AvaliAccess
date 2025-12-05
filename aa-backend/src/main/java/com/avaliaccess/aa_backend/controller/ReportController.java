package com.avaliaccess.aa_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.avaliaccess.aa_backend.dto.ReportRequest;
import com.avaliaccess.aa_backend.dto.ReportResponse;
import com.avaliaccess.aa_backend.dto.ResolveReportRequest;
import com.avaliaccess.aa_backend.entity.ReportStatus;
import com.avaliaccess.aa_backend.entity.ReportType;
import com.avaliaccess.aa_backend.service.ReportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ReportResponse> createReport(
            @Valid @RequestBody ReportRequest request,
            Authentication authentication) {
        ReportResponse response = reportService.createReport(request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    public ResponseEntity<Page<ReportResponse>> getAllReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(required = false) ReportType type,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        
        Page<ReportResponse> reports;
        
        if (status != null && type != null) {
            reports = reportService.getReportsByStatusAndType(status, type, pageable);
        } else if (status != null) {
            reports = reportService.getReportsByStatus(status, pageable);
        } else if (type != null) {
            reports = reportService.getReportsByType(type, pageable);
        } else {
            reports = reportService.getAllReports(pageable);
        }
        
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/my-reports")
    public ResponseEntity<Page<ReportResponse>> getMyReports(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            Authentication authentication) {
        Page<ReportResponse> reports = reportService.getMyReports(authentication.getName(), pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        ReportResponse report = reportService.getReportById(id);
        return ResponseEntity.ok(report);
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    public ResponseEntity<ReportResponse> resolveReport(
            @PathVariable Long id,
            @Valid @RequestBody ResolveReportRequest request,
            Authentication authentication) {
        ReportResponse response = reportService.resolveReport(id, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending-count")
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    public ResponseEntity<Long> getPendingCount() {
        Long count = reportService.countPendingReports();
        return ResponseEntity.ok(count);
    }
}
