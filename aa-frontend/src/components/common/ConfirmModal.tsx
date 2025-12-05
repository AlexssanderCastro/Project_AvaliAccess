import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered
      className={styles.confirmModal}
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>
          {variant === 'danger' && <i className="bi bi-exclamation-triangle-fill me-2"></i>}
          {variant === 'warning' && <i className="bi bi-exclamation-circle-fill me-2"></i>}
          {variant === 'primary' && <i className="bi bi-info-circle-fill me-2"></i>}
          {variant === 'success' && <i className="bi bi-check-circle-fill me-2"></i>}
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <p className={styles.modalMessage}>{message}</p>
      </Modal.Body>
      <Modal.Footer className={styles.modalFooter}>
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          className={styles.cancelButton}
        >
          {cancelText}
        </Button>
        <Button 
          variant={variant} 
          onClick={handleConfirm}
          className={styles.confirmButton}
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
