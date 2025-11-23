import React from 'react';
import { Card } from 'react-bootstrap';
import StarRating from './StarRating';
import AccessibilityIcons from './AccessibilityIcons';
import { ReviewResponse } from '../../types/review';
import styles from './ReviewCard.module.css';

interface ReviewCardProps {
  review: ReviewResponse;
  currentUserId?: number;
  onEdit?: (review: ReviewResponse) => void;
  onDelete?: (reviewId: number) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const isOwner = currentUserId === review.userId;
  const reviewDate = new Date(review.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Card className={styles.reviewCard}>
      <Card.Body>
        <div className={styles.reviewHeader}>
          <div>
            <strong className={styles.userName}>{review.userName}</strong>
            <span className={styles.reviewDate}> • {reviewDate}</span>
          </div>
          <StarRating rating={review.rating} readOnly size="small" />
        </div>

        {review.comment && (
          <p className={styles.comment}>{review.comment}</p>
        )}

        <div className={styles.accessibilitySection}>
          <AccessibilityIcons
            features={{
              hasRamp: review.hasRamp,
              hasAccessibleRestroom: review.hasAccessibleRestroom,
              hasAccessibleParking: review.hasAccessibleParking,
              hasElevator: review.hasElevator,
              hasAccessibleEntrance: review.hasAccessibleEntrance,
              hasTactileFloor: review.hasTactileFloor,
              hasSignLanguageService: review.hasSignLanguageService,
              hasAccessibleSeating: review.hasAccessibleSeating,
            }}
            size="small"
          />
        </div>

        {isOwner && (onEdit || onDelete) && (
          <div className={styles.actions}>
            {onEdit && (
              <button
                className={`btn btn-sm btn-outline-primary ${styles.actionBtn}`}
                onClick={() => onEdit(review)}
              >
                <i className="bi bi-pencil" /> Editar
              </button>
            )}
            {onDelete && (
              <button
                className={`btn btn-sm btn-outline-danger ${styles.actionBtn}`}
                onClick={() => onDelete(review.id)}
              >
                <i className="bi bi-trash" /> Excluir
              </button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
