package com.avaliaccess.aa_backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "establishment_id", nullable = false)
    private Establishment establishment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer rating; // 0 a 5

    @Column(length = 1000)
    private String comment;

    // Características de acessibilidade
    @Column(nullable = false)
    private Boolean hasRamp = false;

    @Column(nullable = false)
    private Boolean hasAccessibleRestroom = false;

    @Column(nullable = false)
    private Boolean hasAccessibleParking = false;

    @Column(nullable = false)
    private Boolean hasElevator = false;

    @Column(nullable = false)
    private Boolean hasAccessibleEntrance = false;

    @Column(nullable = false)
    private Boolean hasTactileFloor = false;

    @Column(nullable = false)
    private Boolean hasSignLanguageService = false;

    @Column(nullable = false)
    private Boolean hasAccessibleSeating = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Establishment getEstablishment() {
        return establishment;
    }

    public void setEstablishment(Establishment establishment) {
        this.establishment = establishment;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Boolean getHasRamp() {
        return hasRamp;
    }

    public void setHasRamp(Boolean hasRamp) {
        this.hasRamp = hasRamp;
    }

    public Boolean getHasAccessibleRestroom() {
        return hasAccessibleRestroom;
    }

    public void setHasAccessibleRestroom(Boolean hasAccessibleRestroom) {
        this.hasAccessibleRestroom = hasAccessibleRestroom;
    }

    public Boolean getHasAccessibleParking() {
        return hasAccessibleParking;
    }

    public void setHasAccessibleParking(Boolean hasAccessibleParking) {
        this.hasAccessibleParking = hasAccessibleParking;
    }

    public Boolean getHasElevator() {
        return hasElevator;
    }

    public void setHasElevator(Boolean hasElevator) {
        this.hasElevator = hasElevator;
    }

    public Boolean getHasAccessibleEntrance() {
        return hasAccessibleEntrance;
    }

    public void setHasAccessibleEntrance(Boolean hasAccessibleEntrance) {
        this.hasAccessibleEntrance = hasAccessibleEntrance;
    }

    public Boolean getHasTactileFloor() {
        return hasTactileFloor;
    }

    public void setHasTactileFloor(Boolean hasTactileFloor) {
        this.hasTactileFloor = hasTactileFloor;
    }

    public Boolean getHasSignLanguageService() {
        return hasSignLanguageService;
    }

    public void setHasSignLanguageService(Boolean hasSignLanguageService) {
        this.hasSignLanguageService = hasSignLanguageService;
    }

    public Boolean getHasAccessibleSeating() {
        return hasAccessibleSeating;
    }

    public void setHasAccessibleSeating(Boolean hasAccessibleSeating) {
        this.hasAccessibleSeating = hasAccessibleSeating;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
