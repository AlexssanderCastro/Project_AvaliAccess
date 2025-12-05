import api from './api';
import { EstablishmentResponse } from './establishmentApi';

export const SponsorAPI = {
  getSponsored: async (): Promise<EstablishmentResponse[]> => {
    const response = await api.get<EstablishmentResponse[]>('/api/establishments/sponsored');
    return response.data;
  },

  sponsor: async (id: number): Promise<EstablishmentResponse> => {
    const response = await api.post<EstablishmentResponse>(`/api/establishments/${id}/sponsor`);
    return response.data;
  },

  unsponsor: async (id: number): Promise<EstablishmentResponse> => {
    const response = await api.delete<EstablishmentResponse>(`/api/establishments/${id}/sponsor`);
    return response.data;
  }
};
