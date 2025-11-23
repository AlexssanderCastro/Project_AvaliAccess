import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { EstablishmentAPI } from '../../services/establishmentApi';
import styles from './RegisterEstablishmentPage.module.css';

const ESTADOS_BRASILEIROS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const TIPOS_ESTABELECIMENTO = [
  'Restaurante',
  'Café',
  'Bar',
  'Hotel',
  'Pousada',
  'Shopping',
  'Supermercado',
  'Farmácia',
  'Hospital',
  'Clínica',
  'Escola',
  'Universidade',
  'Biblioteca',
  'Museu',
  'Teatro',
  'Cinema',
  'Parque',
  'Academia',
  'Banco',
  'Correios',
  'Outro'
];

const RegisterEstablishmentPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    type: '',
  });
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A foto deve ter no máximo 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError('O arquivo deve ser uma imagem');
        return;
      }

      setPhoto(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Você precisa estar logado para cadastrar um estabelecimento');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await EstablishmentAPI.create(formData, photo);
      setSuccess('Estabelecimento cadastrado com sucesso!');
      
      // Resetar formulário
      setFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        type: '',
      });
      setPhoto(null);
      setPhotoPreview(null);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Erro ao cadastrar estabelecimento. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Você precisa estar logado para cadastrar um estabelecimento.{' '}
          <Alert.Link href="/login">Faça login aqui</Alert.Link>
        </Alert>
      </Container>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className={styles.formCard}>
              <Card.Body>
                <h2 className="text-center mb-4">Cadastrar Estabelecimento</h2>
                
                {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome do Estabelecimento *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      maxLength={200}
                      placeholder="Ex: Restaurante Acessível"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Endereço Completo *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      maxLength={300}
                      placeholder="Rua, número, bairro, CEP"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Cidade *</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          maxLength={100}
                          placeholder="Ex: São Paulo"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Estado *</Form.Label>
                        <Form.Select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecione</option>
                          {ESTADOS_BRASILEIROS.map(estado => (
                            <option key={estado} value={estado}>{estado}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Estabelecimento *</Form.Label>
                    <Form.Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione</option>
                      {TIPOS_ESTABELECIMENTO.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Foto do Estabelecimento (opcional)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                    <Form.Text className="text-muted">
                      Tamanho máximo: 5MB. Formatos aceitos: JPG, PNG, GIF
                    </Form.Text>
                    
                    {photoPreview && (
                      <div className={styles.photoPreview}>
                        <img src={photoPreview} alt="Preview" />
                      </div>
                    )}
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Cadastrando...' : 'Cadastrar Estabelecimento'}
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate('/')}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterEstablishmentPage;
