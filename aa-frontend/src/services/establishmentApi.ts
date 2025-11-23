import api from './api';

export interface EstablishmentData {
  name: string;
  address: string;
  city: string;
  state: string;
  type: string;
}

export interface EstablishmentResponse {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  type: string;
  photoUrl: string | null;
  averageRating: number;
  totalRatings: number;
  createdByName: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse {
  content: EstablishmentResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface SearchParams {
  name?: string;
  city?: string;
  state?: string;
  type?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export const EstablishmentAPI = {
  create: async (data: EstablishmentData, photo: File | null): Promise<EstablishmentResponse> => {
    const formData = new FormData();
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('establishment', blob);
    
    if (photo) {
      formData.append('photo', photo);
    }

    const response = await api.post<EstablishmentResponse>('/api/establishments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (): Promise<EstablishmentResponse[]> => {
    const response = await api.get<EstablishmentResponse[]>('/api/establishments');
    return response.data;
  },

  getById: async (id: number): Promise<EstablishmentResponse> => {
    const response = await api.get<EstablishmentResponse>(`/api/establishments/${id}`);
    return response.data;
  },

  getByCity: async (city: string): Promise<EstablishmentResponse[]> => {
    const response = await api.get<EstablishmentResponse[]>(`/api/establishments/city/${city}`);
    return response.data;
  },

  getByType: async (type: string): Promise<EstablishmentResponse[]> => {
    const response = await api.get<EstablishmentResponse[]>(`/api/establishments/type/${type}`);
    return response.data;
  },

  update: async (id: number, data: EstablishmentData, photo: File | null): Promise<EstablishmentResponse> => {
    const formData = new FormData();
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    formData.append('establishment', blob);
    
    if (photo) {
      formData.append('photo', photo);
    }

    const response = await api.put<EstablishmentResponse>(`/api/establishments/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/establishments/${id}`);
  },

  search: async (params: SearchParams): Promise<PageResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.name) queryParams.append('name', params.name);
    if (params.city) queryParams.append('city', params.city);
    if (params.state) queryParams.append('state', params.state);
    if (params.type) queryParams.append('type', params.type);
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);

    const response = await api.get<PageResponse>(`/api/establishments/search?${queryParams.toString()}`);
    return response.data;
  },
};
