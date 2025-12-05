import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Form, Button, Row, Col, Pagination, Spinner } from 'react-bootstrap';
import { AuthAPI, PageResponse, UserProfile } from '../../services/api';
import UserProfileModal from '../../components/admin/UserProfileModal';
import styles from './AdminUsersPage.module.css';

const AdminUsersPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'id'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [usersPage, setUsersPage] = useState<PageResponse<UserProfile> | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const loadUsers = async (p = page, q = query, sBy = sortBy, sDir = sortDirection) => {
    setLoading(true);
    try {
      const data = await AuthAPI.getUsers(p, pageSize, q || undefined, sBy, sDir);
      setUsersPage(data);
    } catch (err) {
      console.error('Erro ao carregar usuários', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(0, '');
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setPage(0);
    loadUsers(0, query, sortBy, sortDirection);
  };

  const openUserModal = (userId: number) => {
    setSelectedUserId(userId);
    setShowUserModal(true);
  };

  const onUserBanned = () => {
    // refresh current page after ban/unban
    loadUsers(page, query);
  };

  const renderPagination = () => {
    if (!usersPage) return null;
    const items = [];
    for (let i = 0; i < usersPage.totalPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === usersPage.number} onClick={() => { setPage(i); loadUsers(i, query); }}>
          {i + 1}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4"><i className="bi bi-people-fill me-2"/>Gerenciar Usuários</h2>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-center">
              <Col md={8} className="mb-2">
                <Form.Control
                  placeholder="Pesquisar por nome ou email"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Col>
              <Col md={4} className="mb-2">
                <div className="d-flex gap-2">
                  <Form.Select value={sortBy} onChange={(e) => { setSortBy(e.target.value as any); setPage(0); loadUsers(0, query, e.target.value as any, sortDirection); }}>
                    <option value="name">Ordenar por: Nome</option>
                    <option value="email">Ordenar por: Email</option>
                    <option value="id">Ordenar por: ID</option>
                  </Form.Select>
                  <Form.Select value={sortDirection} onChange={(e) => { setSortDirection(e.target.value as any); setPage(0); loadUsers(0, query, sortBy, e.target.value as any); }}>
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                  </Form.Select>
                  <Button variant="primary" onClick={() => handleSearch()} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm"/> : 'Buscar'}
                  </Button>
                  <Button variant="secondary" onClick={() => { setQuery(''); setPage(0); setSortBy('name'); setSortDirection('asc'); loadUsers(0, ''); }}>
                    Limpar
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {loading && !usersPage ? (
            <div className="text-center py-4"><Spinner animation="border"/></div>
          ) : (
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usersPage && usersPage.content.length > 0 ? usersPage.content.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.roles?.join(', ')}</td>
                    <td>{u.banned ? <span className={styles.banned}>BANIDO</span> : <span className={styles.active}>ATIVO</span>}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary" onClick={() => openUserModal(u.id)}>Ver</Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center">Nenhum usuário encontrado</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}

          <div className="d-flex justify-content-center mt-3">
            {renderPagination()}
          </div>
        </Card.Body>
      </Card>

      {selectedUserId && (
        <UserProfileModal
          show={showUserModal}
          onHide={() => setShowUserModal(false)}
          userId={selectedUserId}
          onUserBanned={onUserBanned}
        />
      )}
    </Container>
  );
};

export default AdminUsersPage;
