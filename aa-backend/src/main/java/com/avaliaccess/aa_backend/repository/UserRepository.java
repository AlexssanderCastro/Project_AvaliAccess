package com.avaliaccess.aa_backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.avaliaccess.aa_backend.entity.Role;
import com.avaliaccess.aa_backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // Search users by name or email prefix (case-insensitive)
    Page<User> findByNameStartingWithIgnoreCaseOrEmailStartingWithIgnoreCase(String namePrefix, String emailPrefix, Pageable pageable);

    // Search only non-admin users (exclude those with ADMINISTRADOR role), optional prefix q
    @Query("SELECT u FROM User u WHERE :role NOT MEMBER OF u.roles AND ( :q IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT(:q, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT(:q, '%')) )")
    Page<User> searchNonAdminUsers(@Param("role") Role role, @Param("q") String q, Pageable pageable);
}
