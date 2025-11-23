import api from './api';
import { ReviewData, ReviewResponse, AccessibilityFeatures } from '../types/review';

export const ReviewAPI = {
  create: async (establishmentId: number, data: ReviewData): Promise<ReviewResponse> => {
    const response = await api.post(`/api/reviews/establishment/${establishmentId}`, data);
    return response.data as ReviewResponse;
  },

  update: async (reviewId: number, data: ReviewData): Promise<ReviewResponse> => {
    const response = await api.put(`/api/reviews/${reviewId}`, data);
    return response.data as ReviewResponse;
  },

  delete: async (reviewId: number): Promise<void> => {
    await api.delete(`/api/reviews/${reviewId}`);
  },

  getByEstablishment: async (establishmentId: number): Promise<ReviewResponse[]> => {
    const response = await api.get(`/api/reviews/establishment/${establishmentId}`);
    return response.data as ReviewResponse[];
  },

  getAccessibilityFeatures: async (establishmentId: number): Promise<AccessibilityFeatures> => {
    const response = await api.get(`/api/reviews/establishment/${establishmentId}/accessibility`);
    return response.data as AccessibilityFeatures;
  },
};
