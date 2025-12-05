import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import StarRating from './StarRating';
import AccessibilityIcons from './AccessibilityIcons';
import UserAvatar from '../UserAvatar/UserAvatar';
import ReportModal from '../report/ReportModal';
import { ReviewResponse } from '../../types/review';
import { ReportType } from '../../types/report';
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
  const [showReportModal, setShowReportModal] = useState(false);
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
          <div className={styles.userInfo}>
            <UserAvatar 
              photoUrl={review.userPhotoUrl} 
              userName={review.userName} 
              size="small" 
            />
            <div>
              <strong className={styles.userName}>{review.userName}</strong>
              <span className={styles.reviewDate}> • {reviewDate}</span>
            </div>
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
              hasAccessibleSeating: review.hasAccessibleSeating,
            }}
            size="small"
          />
        </div>

        <div className={styles.actions}>
          {isOwner && onEdit && (
            <button
              className={`btn btn-sm btn-outline-primary ${styles.actionBtn}`}
              onClick={() => onEdit(review)}
            >
              <i className="bi bi-pencil" /> Editar
            </button>
          )}
          {isOwner && onDelete && (
            <button
              className={`btn btn-sm btn-outline-danger ${styles.actionBtn}`}
              onClick={() => onDelete(review.id)}
            >
              <i className="bi bi-trash" /> Excluir
            </button>
          )}
          {!isOwner && currentUserId && (
            <button
              className={`btn btn-sm btn-outline-warning ${styles.actionBtn}`}
              onClick={() => setShowReportModal(true)}
            >
              <i className="bi bi-flag" /> Denunciar
            </button>
          )}
        </div>
      </Card.Body>

      <ReportModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        type={ReportType.REVIEW}
        targetId={review.id}
        targetName={`Avaliação de ${review.userName}`}
      />
    </Card>
  );
};

export default ReviewCard;
