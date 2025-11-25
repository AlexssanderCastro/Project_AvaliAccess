package com.avaliaccess.aa_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.avaliaccess.aa_backend.dto.AccessibilityFeaturesResponse;
import com.avaliaccess.aa_backend.dto.ReviewRequest;
import com.avaliaccess.aa_backend.dto.ReviewResponse;
import com.avaliaccess.aa_backend.entity.Establishment;
import com.avaliaccess.aa_backend.entity.Review;
import com.avaliaccess.aa_backend.entity.User;
import com.avaliaccess.aa_backend.repository.EstablishmentRepository;
import com.avaliaccess.aa_backend.repository.ReviewRepository;
import com.avaliaccess.aa_backend.repository.UserRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private EstablishmentRepository establishmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(Long establishmentId, ReviewRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Establishment establishment = establishmentRepository.findById(establishmentId)
            .orElseThrow(() -> new RuntimeException("Estabelecimento não encontrado"));

        // Verificar se o usuário já avaliou este estabelecimento
        reviewRepository.findByEstablishmentIdAndUserId(establishmentId, user.getId())
            .ifPresent(r -> {
                throw new RuntimeException("Você já avaliou este estabelecimento");
            });

        Review review = new Review();
        review.setEstablishment(establishment);
        review.setUser(user);
        review.setRating(request.rating());
        review.setComment(request.comment());
        review.setHasRamp(request.hasRamp());
        review.setHasAccessibleRestroom(request.hasAccessibleRestroom());
        review.setHasAccessibleParking(request.hasAccessibleParking());
        review.setHasElevator(request.hasElevator());
        review.setHasAccessibleEntrance(request.hasAccessibleEntrance());
        review.setHasTactileFloor(request.hasTactileFloor());
        review.setHasSignLanguageService(request.hasSignLanguageService());
        review.setHasAccessibleSeating(request.hasAccessibleSeating());

        Review savedReview = reviewRepository.save(review);

        // Atualizar a nota média do estabelecimento
        updateEstablishmentRating(establishmentId);

        return mapToResponse(savedReview);
    }

    @Transactional
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Você não tem permissão para editar esta avaliação");
        }

        review.setRating(request.rating());
        review.setComment(request.comment());
        review.setHasRamp(request.hasRamp());
        review.setHasAccessibleRestroom(request.hasAccessibleRestroom());
        review.setHasAccessibleParking(request.hasAccessibleParking());
        review.setHasElevator(request.hasElevator());
        review.setHasAccessibleEntrance(request.hasAccessibleEntrance());
        review.setHasTactileFloor(request.hasTactileFloor());
        review.setHasSignLanguageService(request.hasSignLanguageService());
        review.setHasAccessibleSeating(request.hasAccessibleSeating());

        Review updatedReview = reviewRepository.save(review);

        // Atualizar a nota média do estabelecimento
        updateEstablishmentRating(review.getEstablishment().getId());

        return mapToResponse(updatedReview);
    }

    @Transactional
    public void deleteReview(Long reviewId, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new RuntimeException("Avaliação não encontrada"));

        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Você não tem permissão para deletar esta avaliação");
        }

        Long establishmentId = review.getEstablishment().getId();
        reviewRepository.delete(review);

        // Atualizar a nota média do estabelecimento
        updateEstablishmentRating(establishmentId);
    }

    public List<ReviewResponse> getReviewsByEstablishment(Long establishmentId) {
        List<Review> reviews = reviewRepository.findByEstablishmentIdOrderByCreatedAtDesc(establishmentId);
        return reviews.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public AccessibilityFeaturesResponse getAccessibilityFeatures(Long establishmentId) {
        // Calcular porcentagem de cada característica e retornar true se >= 50%
        Double rampPercentage = reviewRepository.calculateRampPercentage(establishmentId);
        Double restroomPercentage = reviewRepository.calculateAccessibleRestroomPercentage(establishmentId);
        Double parkingPercentage = reviewRepository.calculateAccessibleParkingPercentage(establishmentId);
        Double elevatorPercentage = reviewRepository.calculateElevatorPercentage(establishmentId);
        Double entrancePercentage = reviewRepository.calculateAccessibleEntrancePercentage(establishmentId);
        Double tactileFloorPercentage = reviewRepository.calculateTactileFloorPercentage(establishmentId);
        Double signLanguagePercentage = reviewRepository.calculateSignLanguageServicePercentage(establishmentId);
        Double seatingPercentage = reviewRepository.calculateAccessibleSeatingPercentage(establishmentId);

        return new AccessibilityFeaturesResponse(
            rampPercentage != null && rampPercentage >= 50.0,
            restroomPercentage != null && restroomPercentage >= 50.0,
            parkingPercentage != null && parkingPercentage >= 50.0,
            elevatorPercentage != null && elevatorPercentage >= 50.0,
            entrancePercentage != null && entrancePercentage >= 50.0,
            tactileFloorPercentage != null && tactileFloorPercentage >= 50.0,
            signLanguagePercentage != null && signLanguagePercentage >= 50.0,
            seatingPercentage != null && seatingPercentage >= 50.0
        );
    }

    private void updateEstablishmentRating(Long establishmentId) {
        Double averageRating = reviewRepository.calculateAverageRating(establishmentId);
        Integer totalRatings = reviewRepository.countByEstablishmentId(establishmentId);

        Establishment establishment = establishmentRepository.findById(establishmentId)
            .orElseThrow(() -> new RuntimeException("Estabelecimento não encontrado"));

        establishment.setAverageRating(averageRating != null ? averageRating : 0.0);
        establishment.setTotalRatings(totalRatings != null ? totalRatings : 0);

        establishmentRepository.save(establishment);
    }

    private ReviewResponse mapToResponse(Review review) {
        return new ReviewResponse(
            review.getId(),
            review.getEstablishment().getId(),
            review.getUser().getId(),
            review.getUser().getName(),
            review.getUser().getPhotoUrl(),
            review.getRating(),
            review.getComment(),
            review.getHasRamp(),
            review.getHasAccessibleRestroom(),
            review.getHasAccessibleParking(),
            review.getHasElevator(),
            review.getHasAccessibleEntrance(),
            review.getHasTactileFloor(),
            review.getHasSignLanguageService(),
            review.getHasAccessibleSeating(),
            review.getCreatedAt(),
            review.getUpdatedAt()
        );
    }
}
