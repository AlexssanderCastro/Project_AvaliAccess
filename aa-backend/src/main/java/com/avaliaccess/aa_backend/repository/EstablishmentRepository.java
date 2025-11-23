package com.avaliaccess.aa_backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.avaliaccess.aa_backend.entity.Establishment;

@Repository
public interface EstablishmentRepository extends JpaRepository<Establishment, Long> {
    List<Establishment> findByCity(String city);
    List<Establishment> findByState(String state);
    List<Establishment> findByType(String type);
    List<Establishment> findByCreatedById(Long userId);
    
    @Query("SELECT e FROM Establishment e WHERE " +
           "(:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:city IS NULL OR e.city = :city) AND " +
           "(:state IS NULL OR e.state = :state) AND " +
           "(:type IS NULL OR e.type = :type)")
    Page<Establishment> searchEstablishments(
        @Param("name") String name,
        @Param("city") String city,
        @Param("state") String state,
        @Param("type") String type,
        Pageable pageable
    );
}
