// src/app/contexts/AuthContext.tsx
'use client';
import { createContext, ReactNode, useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

// Tipos para os dados
type User = {
  nome: string;
  email: string;
};

interface AuthContextData {
  token: string | null;
  user: User | null;
  login(email: string, senha: string): Promise<void>;
  logout(): void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const carregarDadosDoUtilizador = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
        setToken(storedToken);
      } catch (error) {
        console.error("Sessão inválida, limpando...", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    carregarDadosDoUtilizador();
  }, [carregarDadosDoUtilizador]);

  async function login(email: string, senha: string) {
    const response = await api.post('/auth/login', { email, senha });
    const { token: newToken } = response.data;
    
    localStorage.setItem('token', newToken);
    api.defaults.headers.Authorization = `Bearer ${newToken}`;

    const userResponse = await api.get('/auth/me');
    setUser(userResponse.data);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}