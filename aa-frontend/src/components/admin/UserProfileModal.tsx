import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Spinner } from 'react-bootstrap';
import { AuthAPI } from '../../services/api';
import styles from './UserProfileModal.module.css';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  photoUrl?: string;
  roles?: string[];
  banned?: boolean;
}

interface UserProfileModalProps {
  show: boolean;
  onHide: () => void;
  userId: number;
  onUserBanned?: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ show, onHide, userId, onUserBanned }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [banLoading, setBanLoading] = useState(false);

  useEffect(() => {
    if (show && userId) {
      loadUserProfile();
    }
  }, [show, userId]);

  const loadUserProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await AuthAPI.getUserById(userId);
      setUser(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!user) return;
    
    const action = user.banned ? 'desbanir' : 'banir';
    if (!window.confirm(`Tem certeza que deseja ${action} o usuário ${user.name}?`)) return;

    setBanLoading(true);
    try {
      if (user.banned) {
        await AuthAPI.unbanUser(user.id);
      } else {
        await AuthAPI.banUser(user.id);
      }
      setError('');
      await loadUserProfile();
      if (onUserBanned) onUserBanned();
    } catch (err: any) {
      setError(err.response?.data?.message || `Erro ao ${action} usuário`);
    } finally {
      setBanLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Perfil do Usuário</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {user && !loading && (
          <div className={styles.profileContainer}>
            <div className="text-center mb-4">
              {user.photoUrl ? (
                <img
                  src={`http://localhost:8083${user.photoUrl}`}
                  alt={user.name}
                  className={styles.profilePhoto}
                />
              ) : (
                <div className={styles.profilePhotoPlaceholder}>
                  <i className="bi bi-person-circle" />
                </div>
              )}
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoRow}>
                <strong>Nome:</strong>
                <span>{user.name}</span>
              </div>
              <div className={styles.infoRow}>
                <strong>Email:</strong>
                <span>{user.email}</span>
              </div>
              <div className={styles.infoRow}>
                <strong>ID:</strong>
                <span>#{user.id}</span>
              </div>
              {user.roles && user.roles.length > 0 && (
                <div className={styles.infoRow}>
                  <strong>Roles:</strong>
                  <span>{user.roles.join(', ')}</span>
                </div>
              )}
              <div className={styles.infoRow}>
                <strong>Status:</strong>
                <span className={user.banned ? styles.banned : styles.active}>
                  {user.banned ? 'BANIDO' : 'ATIVO'}
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant={user.banned ? 'success' : 'danger'}
                onClick={handleBanUser}
                disabled={banLoading}
              >
                {banLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <i className={`bi ${user.banned ? 'bi-check-circle' : 'bi-ban'} me-2`} />
                    {user.banned ? 'Desbanir Usuário' : 'Banir Usuário'}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserProfileModal;
