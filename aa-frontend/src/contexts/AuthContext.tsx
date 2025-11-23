import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI, setAuthToken, UserProfile } from '../services/api';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState<boolean>(!!token);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      AuthAPI.me()
        .then(setUser)
        .catch(() => {
          setUser(null);
          setToken(null);
          setAuthToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const { token } = await AuthAPI.login({ email, password });
    setToken(token);
    setAuthToken(token);
    const profile = await AuthAPI.me();
    setUser(profile);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token } = await AuthAPI.register({ name, email, password });
    setToken(token);
    setAuthToken(token);
    const profile = await AuthAPI.me();
    setUser(profile);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  const refreshProfile = async () => {
    if (token) {
      const profile = await AuthAPI.me();
      setUser(profile);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
