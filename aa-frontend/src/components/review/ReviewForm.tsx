import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import StarRating from './StarRating';
import { ReviewData, ACCESSIBILITY_FEATURES } from '../../types/review';
import styles from './ReviewForm.module.css';

interface ReviewFormProps {
  onSubmit: (data: ReviewData) => Promise<void>;
  initialData?: ReviewData;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ReviewData>(
    initialData || {
      rating: 0,
      comment: '',
      hasRamp: false,
      hasAccessibleRestroom: false,
      hasAccessibleParking: false,
      hasElevator: false,
      hasAccessibleEntrance: false,
      hasTactileFloor: false,
      hasSignLanguageService: false,
      hasAccessibleSeating: false,
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.rating === 0) {
      setError('Por favor, selecione uma avaliação em estrelas');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data || 'Erro ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (key: keyof ReviewData) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Card className={styles.reviewFormCard}>
      <Card.Body>
        <h5 className={styles.formTitle}>
          {initialData ? 'Editar Avaliação' : 'Deixe sua Avaliação'}
        </h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Avaliação <span className="text-danger">*</span>
            </Form.Label>
            <div>
              <StarRating
                rating={formData.rating}
                onChange={(rating) => setFormData({ ...formData, rating })}
                size="large"
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Comentário (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Compartilhe sua experiência..."
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              maxLength={1000}
            />
            <Form.Text className="text-muted">
              {formData.comment.length}/1000 caracteres
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Características de Acessibilidade</Form.Label>
            <div className={styles.checkboxGrid}>
              {ACCESSIBILITY_FEATURES.map((feature) => (
                <Form.Check
                  key={feature.key}
                  type="checkbox"
                  id={`check-${feature.key}`}
                  label={
                    <span>
                      <i className={`bi ${feature.icon} ${styles.checkIcon}`} />{' '}
                      {feature.label}
                    </span>
                  }
                  checked={formData[feature.key] as boolean}
                  onChange={() => handleCheckboxChange(feature.key)}
                  className={styles.checkbox}
                />
              ))}
            </div>
          </Form.Group>

          <div className={styles.actions}>
            {onCancel && (
              <Button variant="secondary" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>
            )}
            <Button type="submit" variant="success" disabled={loading}>
              {loading ? 'Enviando...' : initialData ? 'Atualizar' : 'Enviar Avaliação'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ReviewForm;
