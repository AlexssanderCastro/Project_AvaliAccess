package com.avaliaccess.aa_backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.avaliaccess.aa_backend.entity.Report;
import com.avaliaccess.aa_backend.entity.ReportStatus;
import com.avaliaccess.aa_backend.entity.ReportType;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    Page<Report> findByStatus(ReportStatus status, Pageable pageable);
    
    Page<Report> findByType(ReportType type, Pageable pageable);
    
    Page<Report> findByStatusAndType(ReportStatus status, ReportType type, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.reporter.id = :userId")
    Page<Report> findByReporterId(Long userId, Pageable pageable);
    
    @Query("SELECT r FROM Report r WHERE r.establishment.id = :establishmentId")
    List<Report> findByEstablishmentId(Long establishmentId);
    
    @Query("SELECT r FROM Report r WHERE r.review.id = :reviewId")
    List<Report> findByReviewId(Long reviewId);
    
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = 'PENDING'")
    Long countPendingReports();
}
