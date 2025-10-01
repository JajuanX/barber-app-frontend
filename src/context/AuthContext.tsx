import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, AuthUser, AuthResponse } from '../services/AuthService';

type AuthState = {
  user?: AuthUser;
  token?: string;
  loading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'admin' | 'student') => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ loading: true });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token') || undefined;
    const user = localStorage.getItem('auth_user');
    setState({ loading: false, token, user: user ? JSON.parse(user) : undefined });
  }, []);

  const persist = (data: AuthResponse) => {
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setState({ loading: false, token: data.token, user: data.user });
  };

  const login = async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true }));
    const data = await apiLogin(email, password);
    persist(data);
  };

  const register = async (name: string, email: string, password: string, role: 'admin' | 'student' = 'student') => {
    setState((s) => ({ ...s, loading: true }));
    const data = await apiRegister(name, email, password, role);
    persist(data);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setState({ loading: false });
    navigate('/', { replace: true });
  };

  const value = useMemo(() => ({ ...state, login, register, logout }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getAuthToken() {
  return localStorage.getItem('auth_token') || undefined;
}
