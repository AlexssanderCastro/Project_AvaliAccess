import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthAPI } from '../services/api';
import UserAvatar from '../components/UserAvatar/UserAvatar';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await AuthAPI.me();
      setUser(profile);
      setName(profile.name);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    setLoading(true);
    setMessage(null);

    try {
      const updatedUser = await AuthAPI.uploadProfilePhoto(photoFile);
      console.log('Foto atualizada, resposta:', updatedUser);
      setUser(updatedUser);
      setPhotoFile(null);
      setPhotoPreview(null);
      setMessage({ type: 'success', text: 'Foto atualizada com sucesso!' });
      // Recarregar perfil para garantir que está atualizado
      await loadUserProfile();
    } catch (error: any) {
      console.error('Erro ao fazer upload da foto:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao atualizar foto' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const updateData: any = { name };
      if (password) {
        updateData.password = password;
      }

      const updatedUser = await AuthAPI.updateProfile(updateData);
      setUser(updatedUser);
      setPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao atualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className={styles.pageTitle}>Meu Perfil</h1>

      {message && (
        <Alert variant={message.type === 'success' ? 'success' : 'danger'} dismissible onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-4">Foto de Perfil</h5>
          
          <div className={styles.photoSection}>
            <div className={styles.currentPhoto}>
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className={styles.photoPreview} />
              ) : (
                <UserAvatar photoUrl={user.photoUrl} userName={user.name} size="large" />
              )}
            </div>

            <div className={styles.photoControls}>
              <Form.Group>
                <Form.Label htmlFor="photoUpload" className={styles.uploadButton}>
                  📷 Escolher Foto
                </Form.Label>
                <Form.Control
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className={styles.hiddenInput}
                />
              </Form.Group>

              {photoFile && (
                <Button variant="success" onClick={handlePhotoUpload} disabled={loading}>
                  {loading ? 'Enviando...' : 'Salvar Foto'}
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h5 className="mb-4">Informações da Conta</h5>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={user.email}
                disabled
                readOnly
              />
              <Form.Text className="text-muted">
                O email não pode ser alterado
              </Form.Text>
            </Form.Group>

            <hr className="my-4" />

            <h6 className="mb-3">Alterar Senha</h6>

            <Form.Group className="mb-3">
              <Form.Label>Nova Senha</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Deixe em branco para não alterar"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Nova Senha</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                disabled={!password}
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
