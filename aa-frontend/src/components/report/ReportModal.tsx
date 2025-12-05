import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { ReportType, ReportReason, ReportRequest, REPORT_REASON_LABELS } from '../../types/report';
import { ReportAPI } from '../../services/reportApi';
import styles from './ReportModal.module.css';

interface ReportModalProps {
  show: boolean;
  onHide: () => void;
  type: ReportType;
  targetId: number;
  targetName: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ show, onHide, type, targetId, targetName }) => {
  const [reason, setReason] = useState<ReportReason>(ReportReason.INCORRECT_INFORMATION);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (description.length < 10) {
      setError('A descrição deve ter pelo menos 10 caracteres');
      return;
    }

    setLoading(true);
    try {
      const data: ReportRequest = {
        type,
        reason,
        description,
        ...(type === ReportType.ESTABLISHMENT ? { establishmentId: targetId } : { reviewId: targetId })
      };

      await ReportAPI.create(data);
      setSuccess(true);
      setTimeout(() => {
        onHide();
        setDescription('');
        setReason(ReportReason.INCORRECT_INFORMATION);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar denúncia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-flag-fill text-danger me-2" />
          Denunciar {type === ReportType.ESTABLISHMENT ? 'Estabelecimento' : 'Avaliação'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Denúncia enviada com sucesso!</Alert>}

          <div className={styles.targetInfo}>
            <strong>{type === ReportType.ESTABLISHMENT ? 'Estabelecimento' : 'Avaliação'}:</strong>
            <p className="text-muted">{targetName}</p>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Motivo da Denúncia <span className="text-danger">*</span></Form.Label>
            <Form.Select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              required
            >
              {Object.entries(REPORT_REASON_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Descreva o problema com detalhes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              required
            />
            <Form.Text className="text-muted">
              {description.length}/1000 caracteres (mínimo 10)
            </Form.Text>
          </Form.Group>

          <Alert variant="info" className="mb-0">
            <small>
              <i className="bi bi-info-circle me-2" />
              Sua denúncia será analisada por nossa equipe. Denúncias falsas podem resultar em penalidades.
            </small>
          </Alert>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Denúncia'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ReportModal;
