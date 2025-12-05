export enum ReportType {
  ESTABLISHMENT = 'ESTABLISHMENT',
  REVIEW = 'REVIEW'
}

export enum ReportReason {
  INCORRECT_INFORMATION = 'INCORRECT_INFORMATION',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  SPAM = 'SPAM',
  FAKE_REVIEW = 'FAKE_REVIEW',
  DUPLICATE = 'DUPLICATE',
  OFFENSIVE_LANGUAGE = 'OFFENSIVE_LANGUAGE',
  ESTABLISHMENT_CLOSED = 'ESTABLISHMENT_CLOSED',
  OTHER = 'OTHER'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

export interface ReportRequest {
  type: ReportType;
  reason: ReportReason;
  description: string;
  establishmentId?: number;
  reviewId?: number;
}

export interface ReportResponse {
  id: number;
  reporterId: number;
  reporterName: string;
  type: ReportType;
  reason: ReportReason;
  description: string;
  establishmentId?: number;
  establishmentName?: string;
  establishmentOwnerId?: number;
  establishmentOwnerName?: string;
  reviewId?: number;
  reviewComment?: string;
  reviewUserId?: number;
  reviewUserName?: string;
  reviewEstablishmentId?: number;
  reviewEstablishmentName?: string;
  status: ReportStatus;
  resolvedById?: number;
  resolvedByName?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResolveReportRequest {
  status: ReportStatus;
  resolutionNotes?: string;
}

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  [ReportReason.INCORRECT_INFORMATION]: 'Informação Incorreta',
  [ReportReason.INAPPROPRIATE_CONTENT]: 'Conteúdo Inapropriado',
  [ReportReason.SPAM]: 'Spam',
  [ReportReason.FAKE_REVIEW]: 'Avaliação Falsa',
  [ReportReason.DUPLICATE]: 'Duplicado',
  [ReportReason.OFFENSIVE_LANGUAGE]: 'Linguagem Ofensiva',
  [ReportReason.ESTABLISHMENT_CLOSED]: 'Estabelecimento Fechado',
  [ReportReason.OTHER]: 'Outro'
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.PENDING]: 'Pendente',
  [ReportStatus.UNDER_REVIEW]: 'Em Análise',
  [ReportStatus.RESOLVED]: 'Resolvido',
  [ReportStatus.REJECTED]: 'Rejeitado'
};
