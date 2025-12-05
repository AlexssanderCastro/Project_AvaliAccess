import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Form, Row, Col, Pagination, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ReportAPI } from '../../services/reportApi';
import { AuthAPI, PageResponse } from '../../services/api';
import UserProfileModal from '../../components/admin/UserProfileModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import { 
  ReportResponse, 
  ReportStatus, 
  ReportType, 
  REPORT_REASON_LABELS, 
  REPORT_STATUS_LABELS,
  ResolveReportRequest
} from '../../types/report';
import styles from './AdminReportsPage.module.css';

const AdminReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<PageResponse<ReportResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | ''>('');
  const [filterType, setFilterType] = useState<ReportType | ''>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveStatus, setResolveStatus] = useState<ReportStatus>(ReportStatus.RESOLVED);
  const [resolveNotes, setResolveNotes] = useState('');
  const [error, setError] = useState('');
  const [banLoading, setBanLoading] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  // Estado para modal de confirmação de exclusão
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await ReportAPI.getAll(
        currentPage,
        20,
        filterStatus || undefined,
        filterType || undefined
      );
      setReports(data);
    } catch (err) {
      console.error('Erro ao carregar denúncias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [currentPage, filterStatus, filterType]);

  const handleResolve = async () => {
    if (!selectedReport) return;

    try {
      const data: ResolveReportRequest = {
        status: resolveStatus,
        resolutionNotes: resolveNotes || undefined
      };
      await ReportAPI.resolve(selectedReport.id, data);
      setShowResolveModal(false);
      setSelectedReport(null);
      setResolveNotes('');
      setError('');
      loadReports();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao resolver denúncia');
    }
  };

  const handleOpenUserProfile = (userId: number) => {
    setSelectedUserId(userId);
    setShowUserProfileModal(true);
  };

  const handleDeleteEstablishment = async (establishmentId: number, establishmentName: string) => {
    setDeleteTarget({ id: establishmentId, name: establishmentName });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteEstablishment = async () => {
    if (!deleteTarget) return;

    try {
      const { EstablishmentAPI } = await import('../../services/establishmentApi');
      await EstablishmentAPI.delete(deleteTarget.id);
      alert('Estabelecimento desativado com sucesso!');
      setDeleteTarget(null);
      loadReports();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao desativar estabelecimento');
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    const variants: Record<ReportStatus, string> = {
      PENDING: 'warning',
      UNDER_REVIEW: 'info',
      RESOLVED: 'success',
      REJECTED: 'danger'
    };
    return <Badge bg={variants[status]}>{REPORT_STATUS_LABELS[status]}</Badge>;
  };

  const getTypeBadge = (type: ReportType) => {
    return (
      <Badge bg={type === ReportType.ESTABLISHMENT ? 'primary' : 'secondary'}>
        {type === ReportType.ESTABLISHMENT ? 'Estabelecimento' : 'Avaliação'}
      </Badge>
    );
  };

  if (loading && !reports) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4">
        <i className="bi bi-shield-exclamation me-2" />
        Gerenciar Denúncias
      </h2>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as ReportStatus | '');
                    setCurrentPage(0);
                  }}
                >
                  <option value="">Todos</option>
                  {Object.entries(REPORT_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tipo</Form.Label>
                <Form.Select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value as ReportType | '');
                    setCurrentPage(0);
                  }}
                >
                  <option value="">Todos</option>
                  <option value={ReportType.ESTABLISHMENT}>Estabelecimento</option>
                  <option value={ReportType.REVIEW}>Avaliação</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={loadReports}>
                <i className="bi bi-arrow-clockwise me-2" />
                Atualizar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {reports && reports.content.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }} />
              <p className="mt-3">Nenhuma denúncia encontrada</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tipo</th>
                      <th>Motivo</th>
                      <th>Denunciante</th>
                      <th>Alvo</th>
                      <th>Status</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports?.content.map((report) => (
                      <tr key={report.id}>
                        <td>#{report.id}</td>
                        <td>{getTypeBadge(report.type)}</td>
                        <td>{REPORT_REASON_LABELS[report.reason]}</td>
                        <td>{report.reporterName}</td>
                        <td>
                          {report.type === ReportType.ESTABLISHMENT ? (
                            <small>{report.establishmentName}</small>
                          ) : (
                            <small>Por: {report.reviewUserName}</small>
                          )}
                        </td>
                        <td>{getStatusBadge(report.status)}</td>
                        <td>
                          <small>{new Date(report.createdAt).toLocaleDateString('pt-BR')}</small>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedReport(report);
                              setShowResolveModal(true);
                              setResolveStatus(ReportStatus.RESOLVED);
                              setResolveNotes('');
                            }}
                          >
                            <i className="bi bi-eye" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {reports && reports.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.Prev
                      disabled={currentPage === 0}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                    {[...Array(Math.min(reports.totalPages, 5))].map((_, idx) => {
                      const pageNum = Math.max(0, currentPage - 2) + idx;
                      if (pageNum >= reports.totalPages) return null;
                      return (
                        <Pagination.Item
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum + 1}
                        </Pagination.Item>
                      );
                    })}
                    <Pagination.Next
                      disabled={currentPage >= reports.totalPages - 1}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Modal de Resolução */}
      <Modal show={showResolveModal} onHide={() => setShowResolveModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalhes da Denúncia #{selectedReport?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {selectedReport && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Tipo:</strong> {getTypeBadge(selectedReport.type)}
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> {getStatusBadge(selectedReport.status)}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Motivo:</strong> {REPORT_REASON_LABELS[selectedReport.reason]}
                </Col>
                <Col md={6}>
                  <strong>Data:</strong> {new Date(selectedReport.createdAt).toLocaleString('pt-BR')}
                </Col>
              </Row>

              <div className="mb-3">
                <strong>Denunciante:</strong> {selectedReport.reporterName}
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="ms-2"
                  onClick={() => handleOpenUserProfile(selectedReport.reporterId)}
                >
                  <i className="bi bi-person-circle me-1" />
                  Ver Perfil
                </Button>
              </div>

              <div className="mb-3">
                <strong>Alvo:</strong>{' '}
                {selectedReport.type === ReportType.ESTABLISHMENT ? (
                  <>
                    {selectedReport.establishmentName}
                    <Button
                      size="sm"
                      variant="link"
                      onClick={() => navigate(`/establishment/${selectedReport.establishmentId}`)}
                      className="p-0 ms-2"
                    >
                      <i className="bi bi-box-arrow-up-right" /> Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => navigate(`/establishment/${selectedReport.establishmentId}/edit`)}
                      className="ms-2"
                    >
                      <i className="bi bi-pencil me-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteEstablishment(selectedReport.establishmentId!, selectedReport.establishmentName!)}
                      className="ms-2"
                    >
                      <i className="bi bi-trash me-1" />
                      Excluir
                    </Button>
                  </>
                ) : (
                  <>
                    Avaliação de {selectedReport.reviewUserName}
                    {selectedReport.reviewEstablishmentId && (
                      <Button
                        size="sm"
                        variant="link"
                        onClick={() => navigate(`/establishment/${selectedReport.reviewEstablishmentId}`)}
                        className="p-0 ms-2"
                      >
                        <i className="bi bi-box-arrow-up-right" /> Ver Estabelecimento: {selectedReport.reviewEstablishmentName}
                      </Button>
                    )}
                  </>
                )}
              </div>

              {selectedReport.establishmentOwnerName && (
                <div className="mb-3">
                  <strong>Cadastrado por:</strong> {selectedReport.establishmentOwnerName}
                  {selectedReport.establishmentOwnerId && (
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="ms-2"
                      onClick={() => handleOpenUserProfile(selectedReport.establishmentOwnerId!)}
                    >
                      <i className="bi bi-person-circle me-1" />
                      Ver Perfil
                    </Button>
                  )}
                </div>
              )}

              {selectedReport.reviewUserName && selectedReport.type === ReportType.REVIEW && (
                <div className="mb-3">
                  <strong>Autor da Avaliação:</strong> {selectedReport.reviewUserName}
                  {selectedReport.reviewUserId && (
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="ms-2"
                      onClick={() => handleOpenUserProfile(selectedReport.reviewUserId!)}
                    >
                      <i className="bi bi-person-circle me-1" />
                      Ver Perfil
                    </Button>
                  )}
                </div>
              )}

              <div className="mb-3">
                <strong>Descrição:</strong>
                <p className={styles.description}>{selectedReport.description}</p>
              </div>

              {selectedReport.reviewComment && (
                <div className="mb-3">
                  <strong>Comentário da Avaliação:</strong>
                  <p className={styles.reviewComment}>{selectedReport.reviewComment}</p>
                </div>
              )}

              {selectedReport.resolvedByName && (
                <div className="mb-3">
                  <strong>Resolvido por:</strong> {selectedReport.resolvedByName}
                  {selectedReport.resolutionNotes && (
                    <>
                      <br />
                      <strong>Notas:</strong> {selectedReport.resolutionNotes}
                    </>
                  )}
                </div>
              )}

              <hr />

              <Form.Group className="mb-3">
                <Form.Label>Ação</Form.Label>
                <Form.Select
                  value={resolveStatus}
                  onChange={(e) => setResolveStatus(e.target.value as ReportStatus)}
                >
                  <option value={ReportStatus.UNDER_REVIEW}>Em Análise</option>
                  <option value={ReportStatus.RESOLVED}>Resolver</option>
                  <option value={ReportStatus.REJECTED}>Rejeitar</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Notas de Resolução (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="Adicione observações sobre a resolução..."
                  maxLength={1000}
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResolveModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleResolve}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Perfil do Usuário */}
      {selectedUserId && (
        <UserProfileModal
          show={showUserProfileModal}
          onHide={() => {
            setShowUserProfileModal(false);
            setSelectedUserId(null);
          }}
          userId={selectedUserId}
          onUserBanned={() => {
            loadReports();
          }}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        show={showDeleteConfirm}
        onHide={() => {
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDeleteEstablishment}
        title="Desativar Estabelecimento"
        message={`Tem certeza que deseja DESATIVAR o estabelecimento "${deleteTarget?.name}"? O estabelecimento não será mais visível para os usuários, mas os dados serão preservados.`}
        confirmText="Desativar"
        cancelText="Cancelar"
        variant="danger"
      />
    </Container>
  );
};

export default AdminReportsPage;
