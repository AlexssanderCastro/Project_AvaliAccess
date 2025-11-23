import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { EstablishmentAPI } from '../../services/establishmentApi';
import { ReviewAPI } from '../../services/reviewApi';
import { EstablishmentResponse } from '../../services/establishmentApi';
import { ReviewResponse, ReviewData, AccessibilityFeatures } from '../../types/review';
import { useAuth } from '../../contexts/AuthContext';
import StarRating from '../../components/review/StarRating';
import AccessibilityIcons from '../../components/review/AccessibilityIcons';
import ReviewForm from '../../components/review/ReviewForm';
import ReviewCard from '../../components/review/ReviewCard';
import styles from './EstablishmentDetailPage.module.css';

const EstablishmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [establishment, setEstablishment] = useState<EstablishmentResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<AccessibilityFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewResponse | null>(null);

  const establishmentId = Number(id);

  useEffect(() => {
    loadEstablishmentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEstablishmentData = async () => {
    setLoading(true);
    setError('');

    try {
      const [estData, reviewsData, featuresData] = await Promise.all([
        EstablishmentAPI.getById(establishmentId),
        ReviewAPI.getByEstablishment(establishmentId),
        ReviewAPI.getAccessibilityFeatures(establishmentId),
      ]);

      setEstablishment(estData);
      setReviews(reviewsData);
      setAccessibilityFeatures(featuresData);
    } catch (err: any) {
      setError('Erro ao carregar informações do estabelecimento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (data: ReviewData) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (editingReview) {
        await ReviewAPI.update(editingReview.id, data);
      } else {
        await ReviewAPI.create(establishmentId, data);
      }

      await loadEstablishmentData();
      setShowReviewForm(false);
      setEditingReview(null);
    } catch (err: any) {
      throw err;
    }
  };

  const handleEditReview = (review: ReviewResponse) => {
    setEditingReview(review);
    setShowReviewForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return;
    }

    try {
      await ReviewAPI.delete(reviewId);
      await loadEstablishmentData();
    } catch (err: any) {
      alert('Erro ao excluir avaliação');
    }
  };

  const handleCancelEdit = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const userHasReviewed = reviews.some((review) => review.userId === user?.id);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Carregando...</p>
      </Container>
    );
  }

  if (error || !establishment) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Estabelecimento não encontrado'}</Alert>
        <Button variant="success" onClick={() => navigate('/explore')}>
          Voltar para Explorar
        </Button>
      </Container>
    );
  }

  const photoUrl = establishment.photoUrl
    ? `${process.env.REACT_APP_API_URL}/api/establishments/photo/${establishment.photoUrl.split('/').pop()}`
    : null;

  return (
    <Container className={styles.pageContainer}>
      <Button
        variant="link"
        className={styles.backButton}
        onClick={() => navigate('/explore')}
      >
        <i className="bi bi-arrow-left" /> Voltar para Explorar
      </Button>

      <Card className={styles.establishmentCard}>
        <Row className="g-0">
          <Col md={5}>
            {photoUrl ? (
              <img src={photoUrl} alt={establishment.name} className={styles.photo} />
            ) : (
              <div className={styles.noPhoto}>
                <i className="bi bi-image" />
              </div>
            )}
          </Col>
          <Col md={7}>
            <Card.Body className={styles.establishmentInfo}>
              <h1 className={styles.establishmentName}>{establishment.name}</h1>

              <div className={styles.ratingSection}>
                <StarRating rating={establishment.averageRating} readOnly size="large" />
                <span className={styles.ratingText}>
                  {establishment.averageRating.toFixed(1)} ({establishment.totalRatings}{' '}
                  {establishment.totalRatings === 1 ? 'avaliação' : 'avaliações'})
                </span>
              </div>

              <div className={styles.infoItem}>
                <i className="bi bi-geo-alt" />
                <span>{establishment.address}</span>
              </div>

              <div className={styles.infoItem}>
                <i className="bi bi-pin-map" />
                <span>
                  {establishment.city}, {establishment.state}
                </span>
              </div>

              <div className={styles.infoItem}>
                <i className="bi bi-building" />
                <span className={styles.typeBadge}>{establishment.type}</span>
              </div>

              {accessibilityFeatures && (
                <div className={styles.accessibilitySection}>
                  <h5>Características de Acessibilidade</h5>
                  <AccessibilityIcons
                    features={accessibilityFeatures}
                    size="large"
                    showLabels
                  />
                </div>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Card>

      <div className={styles.reviewsSection}>
        <h3 className={styles.sectionTitle}>Avaliações</h3>

        {token && !userHasReviewed && !showReviewForm && (
          <Button
            variant="success"
            className={styles.addReviewButton}
            onClick={() => setShowReviewForm(true)}
          >
            <i className="bi bi-plus-circle" /> Adicionar Avaliação
          </Button>
        )}

        {showReviewForm && (
          <ReviewForm
            onSubmit={handleSubmitReview}
            initialData={
              editingReview
                ? {
                    rating: editingReview.rating,
                    comment: editingReview.comment,
                    hasRamp: editingReview.hasRamp,
                    hasAccessibleRestroom: editingReview.hasAccessibleRestroom,
                    hasAccessibleParking: editingReview.hasAccessibleParking,
                    hasElevator: editingReview.hasElevator,
                    hasAccessibleEntrance: editingReview.hasAccessibleEntrance,
                    hasTactileFloor: editingReview.hasTactileFloor,
                    hasSignLanguageService: editingReview.hasSignLanguageService,
                    hasAccessibleSeating: editingReview.hasAccessibleSeating,
                  }
                : undefined
            }
            onCancel={handleCancelEdit}
          />
        )}

        {reviews.length === 0 ? (
          <Card className={styles.noReviews}>
            <Card.Body>
              <p>
                <i className="bi bi-chat-left-text" /> Ainda não há avaliações para este
                estabelecimento.
              </p>
              {token && (
                <p>Seja o primeiro a avaliar!</p>
              )}
            </Card.Body>
          </Card>
        ) : (
          <div className={styles.reviewsList}>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={user?.id}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export default EstablishmentDetailPage;
