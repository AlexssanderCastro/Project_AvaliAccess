package com.avaliaccess.aa_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.avaliaccess.aa_backend.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEstablishmentIdOrderByCreatedAtDesc(Long establishmentId);
    
    Optional<Review> findByEstablishmentIdAndUserId(Long establishmentId, Long userId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.establishment.id = :establishmentId")
    Double calculateAverageRating(@Param("establishmentId") Long establishmentId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.establishment.id = :establishmentId")
    Integer countByEstablishmentId(@Param("establishmentId") Long establishmentId);
    
    // Calcular porcentagem de cada característica
    @Query("SELECT CASE WHEN (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId) = 0 THEN 0.0 " +
           "ELSE (COUNT(r) * 100.0 / (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId)) END " +
           "FROM Review r WHERE r.establishment.id = :establishmentId AND r.hasRamp = true")
    Double calculateRampPercentage(@Param("establishmentId") Long establishmentId);
    
    @Query("SELECT CASE WHEN (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId) = 0 THEN 0.0 " +
           "ELSE (COUNT(r) * 100.0 / (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId)) END " +
           "FROM Review r WHERE r.establishment.id = :establishmentId AND r.hasAccessibleRestroom = true")
    Double calculateAccessibleRestroomPercentage(@Param("establishmentId") Long establishmentId);
    
    @Query("SELECT CASE WHEN (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId) = 0 THEN 0.0 " +
           "ELSE (COUNT(r) * 100.0 / (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId)) END " +
           "FROM Review r WHERE r.establishment.id = :establishmentId AND r.hasAccessibleParking = true")
    Double calculateAccessibleParkingPercentage(@Param("establishmentId") Long establishmentId);
    
    @Query("SELECT CASE WHEN (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId) = 0 THEN 0.0 " +
           "ELSE (COUNT(r) * 100.0 / (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId)) END " +
           "FROM Review r WHERE r.establishment.id = :establishmentId AND r.hasElevator = true")
    Double calculateElevatorPercentage(@Param("establishmentId") Long establishmentId);
    
    @Query("SELECT CASE WHEN (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId) = 0 THEN 0.0 " +
           "ELSE (COUNT(r) * 100.0 / (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId)) END " +
           "FROM Review r WHERE r.establishment.id = :establishmentId AND r.hasAccessibleEntrance = true")
    Double calculateAccessibleEntrancePercentage(@Param("establishmentId") Long establishmentId);
    
    @Query("SELECT CASE WHEN (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId) = 0 THEN 0.0 " +
           "ELSE (COUNT(r) * 100.0 / (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId)) END " +
           "FROM Review r WHERE r.establishment.id = :establishmentId AND r.hasTactileFloor = true")
    Double calculateTactileFloorPercentage(@Param("establishmentId") Long establishmentId);
    
    @Query("SELECT CASE WHEN (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId) = 0 THEN 0.0 " +
           "ELSE (COUNT(r) * 100.0 / (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId)) END " +
           "FROM Review r WHERE r.establishment.id = :establishmentId AND r.hasSignLanguageService = true")
    Double calculateSignLanguageServicePercentage(@Param("establishmentId") Long establishmentId);
    
    @Query("SELECT CASE WHEN (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId) = 0 THEN 0.0 " +
           "ELSE (COUNT(r) * 100.0 / (SELECT COUNT(r2) FROM Review r2 WHERE r2.establishment.id = :establishmentId)) END " +
           "FROM Review r WHERE r.establishment.id = :establishmentId AND r.hasAccessibleSeating = true")
    Double calculateAccessibleSeatingPercentage(@Param("establishmentId") Long establishmentId);
}
