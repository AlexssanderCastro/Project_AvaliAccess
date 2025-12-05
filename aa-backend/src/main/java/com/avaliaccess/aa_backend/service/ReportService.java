package com.avaliaccess.aa_backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.avaliaccess.aa_backend.dto.ReportRequest;
import com.avaliaccess.aa_backend.dto.ReportResponse;
import com.avaliaccess.aa_backend.dto.ResolveReportRequest;
import com.avaliaccess.aa_backend.entity.Establishment;
import com.avaliaccess.aa_backend.entity.Report;
import com.avaliaccess.aa_backend.entity.ReportStatus;
import com.avaliaccess.aa_backend.entity.ReportType;
import com.avaliaccess.aa_backend.entity.Review;
import com.avaliaccess.aa_backend.entity.User;
import com.avaliaccess.aa_backend.repository.EstablishmentRepository;
import com.avaliaccess.aa_backend.repository.ReportRepository;
import com.avaliaccess.aa_backend.repository.ReviewRepository;
import com.avaliaccess.aa_backend.repository.UserRepository;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final EstablishmentRepository establishmentRepository;
    private final ReviewRepository reviewRepository;

    public ReportService(
            ReportRepository reportRepository,
            UserRepository userRepository,
            EstablishmentRepository establishmentRepository,
            ReviewRepository reviewRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.establishmentRepository = establishmentRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional
    public ReportResponse createReport(ReportRequest request, String userEmail) {
        request.validate();

        User reporter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Report report = new Report();
        report.setReporter(reporter);
        report.setType(request.type());
        report.setReason(request.reason());
        report.setDescription(request.description());

        if (request.type() == ReportType.ESTABLISHMENT) {
            Establishment establishment = establishmentRepository.findById(request.establishmentId())
                    .orElseThrow(() -> new RuntimeException("Estabelecimento não encontrado"));
            report.setEstablishment(establishment);
        } else {
            Review review = reviewRepository.findById(request.reviewId())
                    .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));
            report.setReview(review);
        }

        Report savedReport = reportRepository.save(report);
        return mapToResponse(savedReport);
    }

    @Transactional(readOnly = true)
    public Page<ReportResponse> getAllReports(Pageable pageable) {
        return reportRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReportResponse> getReportsByStatus(ReportStatus status, Pageable pageable) {
        return reportRepository.findByStatus(status, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReportResponse> getReportsByType(ReportType type, Pageable pageable) {
        return reportRepository.findByType(type, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReportResponse> getReportsByStatusAndType(ReportStatus status, ReportType type, Pageable pageable) {
        return reportRepository.findByStatusAndType(status, type, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReportResponse> getMyReports(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return reportRepository.findByReporterId(user.getId(), pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report não encontrado"));
        return mapToResponse(report);
    }

    @Transactional
    public ReportResponse resolveReport(Long id, ResolveReportRequest request, String adminEmail) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report não encontrado"));

        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Administrador não encontrado"));

        report.setStatus(request.status());
        report.setResolvedBy(admin);
        report.setResolutionNotes(request.resolutionNotes());

        Report updatedReport = reportRepository.save(report);
        return mapToResponse(updatedReport);
    }

    @Transactional(readOnly = true)
    public Long countPendingReports() {
        return reportRepository.countPendingReports();
    }

    private ReportResponse mapToResponse(Report report) {
        return new ReportResponse(
                report.getId(),
                report.getReporter().getId(),
                report.getReporter().getName(),
                report.getType(),
                report.getReason(),
                report.getDescription(),
                report.getEstablishment() != null ? report.getEstablishment().getId() : null,
                report.getEstablishment() != null ? report.getEstablishment().getName() : null,
                report.getEstablishment() != null ? report.getEstablishment().getCreatedBy().getId() : null,
                report.getEstablishment() != null ? report.getEstablishment().getCreatedBy().getName() : null,
                report.getReview() != null ? report.getReview().getId() : null,
                report.getReview() != null ? report.getReview().getComment() : null,
                report.getReview() != null ? report.getReview().getUser().getId() : null,
                report.getReview() != null ? report.getReview().getUser().getName() : null,
                report.getReview() != null ? report.getReview().getEstablishment().getId() : null,
                report.getReview() != null ? report.getReview().getEstablishment().getName() : null,
                report.getStatus(),
                report.getResolvedBy() != null ? report.getResolvedBy().getId() : null,
                report.getResolvedBy() != null ? report.getResolvedBy().getName() : null,
                report.getResolutionNotes(),
                report.getCreatedAt(),
                report.getUpdatedAt()
        );
    }
}
