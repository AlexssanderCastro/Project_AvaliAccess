import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Pagination, Badge } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EstablishmentAPI, EstablishmentResponse, PageResponse } from '../../services/establishmentApi';
import styles from './ExplorePage.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8083';

const ESTADOS_BRASILEIROS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const TIPOS_ESTABELECIMENTO = [
  'Restaurante', 'Café', 'Bar', 'Hotel', 'Pousada', 'Shopping',
  'Supermercado', 'Farmácia', 'Hospital', 'Clínica', 'Escola',
  'Universidade', 'Biblioteca', 'Museu', 'Teatro', 'Cinema',
  'Parque', 'Academia', 'Banco', 'Correios', 'Outro'
];

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [establishments, setEstablishments] = useState<EstablishmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Filtros - inicializar com parâmetros da URL
  const [filters, setFilters] = useState({
    name: searchParams.get('name') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    type: searchParams.get('type') || '',
    minRating: searchParams.get('minRating') || '',
    sortBy: 'createdAt',
    sortDirection: 'desc' as 'asc' | 'desc',
  });

  // Atualizar filtros quando os parâmetros da URL mudarem
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      name: searchParams.get('name') || '',
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
      type: searchParams.get('type') || '',
      minRating: searchParams.get('minRating') || '',
    }));
    setCurrentPage(0);
  }, [searchParams]);

  const fetchEstablishments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PageResponse = await EstablishmentAPI.search({
        ...filters,
        page: currentPage,
        size: 12,
      });
      
      setEstablishments(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err: any) {
      setError('Erro ao carregar estabelecimentos. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstablishments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(0); // Reset para primeira página ao filtrar
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      city: '',
      state: '',
      type: '',
      minRating: '',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });
    setCurrentPage(0);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxVisible = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    if (currentPage > 0) {
      items.push(
        <Pagination.First key="first" onClick={() => setCurrentPage(0)} />,
        <Pagination.Prev key="prev" onClick={() => setCurrentPage(currentPage - 1)} />
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages - 1) {
      items.push(
        <Pagination.Next key="next" onClick={() => setCurrentPage(currentPage + 1)} />,
        <Pagination.Last key="last" onClick={() => setCurrentPage(totalPages - 1)} />
      );
    }

    return <Pagination className="justify-content-center mt-4">{items}</Pagination>;
  };

  return (
    <div className={styles.pageContainer}>
      <Container className="py-4">
        <h1 className={styles.pageTitle}>Explorar Estabelecimentos</h1>
        
        {/* Filtros */}
        <Card className={styles.filterCard}>
          <Card.Body>
            <Row>
              <Col md={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Buscar por nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nome do estabelecimento"
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6} lg={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite a cidade"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6} lg={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  >
                    <option value="">Todos</option>
                    {ESTADOS_BRASILEIROS.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6} lg={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="">Todos</option>
                    {TIPOS_ESTABELECIMENTO.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6} lg={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Nota Mínima</Form.Label>
                  <Form.Select
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="1">⭐ 1+</option>
                    <option value="2">⭐ 2+</option>
                    <option value="3">⭐ 3+</option>
                    <option value="4">⭐ 4+</option>
                    <option value="5">⭐ 5</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6} lg={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Ordenar por</Form.Label>
                  <Form.Select
                    value={`${filters.sortBy}-${filters.sortDirection}`}
                    onChange={(e) => {
                      const [sortBy, sortDirection] = e.target.value.split('-');
                      setFilters(prev => ({ 
                        ...prev, 
                        sortBy, 
                        sortDirection: sortDirection as 'asc' | 'desc' 
                      }));
                      setCurrentPage(0);
                    }}
                  >
                    <option value="createdAt-desc">Mais recentes</option>
                    <option value="createdAt-asc">Mais antigos</option>
                    <option value="averageRating-desc">Maior nota</option>
                    <option value="averageRating-asc">Menor nota</option>
                    <option value="name-asc">Nome (A-Z)</option>
                    <option value="name-desc">Nome (Z-A)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6} lg={1} className="d-flex align-items-end">
                <Button 
                  variant="outline-secondary" 
                  className="mb-3 w-100"
                  onClick={handleClearFilters}
                >
                  Limpar
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Resultados */}
        <div className="mt-4">
          <p className="text-muted">
            {totalElements} estabelecimento(s) encontrado(s)
          </p>
          
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          ) : (
            <>
              <Row>
                {establishments.map((establishment) => (
                  <Col key={establishment.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card 
                      className={styles.establishmentCard}
                      onClick={() => navigate(`/establishment/${establishment.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {establishment.photoUrl ? (
                        <Card.Img
                          variant="top"
                          src={`${API_URL}${establishment.photoUrl}`}
                          className={styles.cardImage}
                          alt={establishment.name}
                        />
                      ) : (
                        <div className={styles.noImage}>
                          <i className="bi bi-image"></i>
                          <p>Sem foto</p>
                        </div>
                      )}
                      <Card.Body>
                        <Card.Title className={styles.cardTitle}>
                          {establishment.name}
                        </Card.Title>
                        <Card.Text className={styles.cardText}>
                          <small className="text-muted">
                            <i className="bi bi-geo-alt"></i> {establishment.city}, {establishment.state}
                          </small>
                          <br />
                          <Badge bg="secondary" className="mt-1">
                            {establishment.type}
                          </Badge>
                        </Card.Text>
                        <div className={styles.rating}>
                          <i className="bi bi-star-fill text-warning"></i>
                          <span className="ms-1">
                            {establishment.averageRating.toFixed(1)} 
                            <small className="text-muted"> ({establishment.totalRatings})</small>
                          </span>
                        </div>
                        <div className={styles.createdBy}>
                          <small className="text-muted">
                            Cadastrado por: {establishment.createdByName}
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              
              {establishments.length === 0 && !loading && (
                <div className="text-center py-5">
                  <p className="text-muted">Nenhum estabelecimento encontrado.</p>
                </div>
              )}
              
              {renderPagination()}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ExplorePage;
