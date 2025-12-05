import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table, Badge, Form } from 'react-bootstrap';
import { EstablishmentAPI, EstablishmentResponse } from '../../services/establishmentApi';
import { SponsorAPI } from '../../services/sponsorApi';
import styles from './AdminSponsoredPage.module.css';

const AdminSponsoredPage: React.FC = () => {
  const [allEstablishments, setAllEstablishments] = useState<EstablishmentResponse[]>([]);
  const [sponsoredEstablishments, setSponsoredEstablishments] = useState<EstablishmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [all, sponsored] = await Promise.all([
        EstablishmentAPI.getAll(),
        SponsorAPI.getSponsored()
      ]);
      setAllEstablishments(all);
      setSponsoredEstablishments(sponsored);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar estabelecimentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSponsor = async (id: number) => {
    try {
      await SponsorAPI.sponsor(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao patrocinar estabelecimento');
    }
  };

  const handleUnsponsor = async (id: number) => {
    try {
      await SponsorAPI.unsponsor(id);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao remover patrocínio');
    }
  };

  const filteredEstablishments = allEstablishments.filter(est => 
    !est.sponsored && 
    est.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className={styles.container}>
      <h2 className={styles.title}>
        <i className="bi bi-star-fill me-2"></i>
        Gerenciar Estabelecimentos Patrocinados
      </h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Lista de Patrocinados */}
      <Card className={styles.card}>
        <Card.Header className={styles.cardHeader}>
          <h5 className="mb-0">
            <i className="bi bi-star me-2"></i>
            Estabelecimentos Patrocinados ({sponsoredEstablishments.length})
          </h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : sponsoredEstablishments.length === 0 ? (
            <p className="text-center text-muted">Nenhum estabelecimento patrocinado ainda</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Cidade</th>
                  <th>Tipo</th>
                  <th>Avaliação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sponsoredEstablishments.map(est => (
                  <tr key={est.id}>
                    <td>{est.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {est.photoUrl && (
                          <img 
                            src={est.photoUrl} 
                            alt={est.name}
                            className={styles.thumbnail}
                          />
                        )}
                        <span>{est.name}</span>
                      </div>
                    </td>
                    <td>{est.city} - {est.state}</td>
                    <td><Badge bg="info">{est.type}</Badge></td>
                    <td>
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      {est.averageRating.toFixed(1)} ({est.totalRatings})
                    </td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleUnsponsor(est.id)}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Remover
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Lista para Adicionar */}
      <Card className={styles.card}>
        <Card.Header className={styles.cardHeader}>
          <h5 className="mb-0">
            <i className="bi bi-building me-2"></i>
            Adicionar Estabelecimento como Patrocinado
          </h5>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Buscar estabelecimento por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>

          {loading ? (
            <p className="text-center">Carregando...</p>
          ) : filteredEstablishments.length === 0 ? (
            <p className="text-center text-muted">
              {searchQuery ? 'Nenhum estabelecimento encontrado' : 'Todos os estabelecimentos já são patrocinados'}
            </p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Cidade</th>
                  <th>Tipo</th>
                  <th>Avaliação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEstablishments.map(est => (
                  <tr key={est.id}>
                    <td>{est.id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        {est.photoUrl && (
                          <img 
                            src={est.photoUrl} 
                            alt={est.name}
                            className={styles.thumbnail}
                          />
                        )}
                        <span>{est.name}</span>
                      </div>
                    </td>
                    <td>{est.city} - {est.state}</td>
                    <td><Badge bg="info">{est.type}</Badge></td>
                    <td>
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      {est.averageRating.toFixed(1)} ({est.totalRatings})
                    </td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleSponsor(est.id)}
                      >
                        <i className="bi bi-star me-1"></i>
                        Patrocinar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminSponsoredPage;
