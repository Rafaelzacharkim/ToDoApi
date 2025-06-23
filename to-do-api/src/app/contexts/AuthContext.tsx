'use client';
import { createContext, ReactNode, useState, useEffect } from 'react';
import api from '../../services/api';

interface AuthContextData {
  token: string | null;
  login(email: string, senha: string): Promise<void>;
  logout(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) setToken(stored);
  }, []);

  async function login(email: string, senha: string) {
    const response = await api.post('/auth/login', { email, senha });
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}