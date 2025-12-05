import api, { PageResponse } from './api';
import { ReportRequest, ReportResponse, ResolveReportRequest, ReportStatus, ReportType } from '../types/report';

export const ReportAPI = {
  create: async (data: ReportRequest): Promise<ReportResponse> => {
    const response = await api.post<ReportResponse>('/api/reports', data);
    return response.data;
  },

  getAll: async (
    page: number = 0,
    size: number = 20,
    status?: ReportStatus,
    type?: ReportType
  ): Promise<PageResponse<ReportResponse>> => {
    const params: any = { page, size };
    if (status) params.status = status;
    if (type) params.type = type;
    const response = await api.get<PageResponse<ReportResponse>>('/api/reports', { params });
    return response.data;
  },

  getMyReports: async (page: number = 0, size: number = 20): Promise<PageResponse<ReportResponse>> => {
    const response = await api.get<PageResponse<ReportResponse>>('/api/reports/my-reports', {
      params: { page, size }
    });
    return response.data;
  },

  getById: async (id: number): Promise<ReportResponse> => {
    const response = await api.get<ReportResponse>(`/api/reports/${id}`);
    return response.data;
  },

  resolve: async (id: number, data: ResolveReportRequest): Promise<ReportResponse> => {
    const response = await api.put<ReportResponse>(`/api/reports/${id}/resolve`, data);
    return response.data;
  },

  getPendingCount: async (): Promise<number> => {
    const response = await api.get<number>('/api/reports/pending-count');
    return response.data;
  },
};
