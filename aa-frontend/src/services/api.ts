import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8083';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  photoUrl?: string;
  roles?: string[];
  banned?: boolean;
}

export interface UpdateProfileData {
  name: string;
  password?: string;
}

export const AuthAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  me: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/api/users/me');
    return response.data;
  },

  getUserById: async (userId: number): Promise<UserProfile> => {
    const response = await api.get<UserProfile>(`/api/users/${userId}`);
    return response.data;
  },

  getUsers: async (page = 0, size = 20, q?: string, sortBy?: string, sortDirection?: string): Promise<PageResponse<UserProfile>> => {
    const params: any = { page, size };
    if (q && q.trim().length > 0) params.q = q.trim();
    if (sortBy) params.sortBy = sortBy;
    if (sortDirection) params.sortDirection = sortDirection;
    const response = await api.get<PageResponse<UserProfile>>('/api/users', { params });
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await api.put<UserProfile>('/api/users/profile', data);
    return response.data;
  },

  uploadProfilePhoto: async (file: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.put<UserProfile>('/api/users/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  banUser: async (userId: number): Promise<void> => {
    await api.post(`/api/users/${userId}/ban`);
  },

  unbanUser: async (userId: number): Promise<void> => {
    await api.post(`/api/users/${userId}/unban`);
  },
};

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export default api;
