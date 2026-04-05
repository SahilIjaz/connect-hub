import { create } from 'zustand';
import api from '@/lib/api';
import { User, AuthResponse } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: true,

  login: async (email: string, password: string) => {
    console.log('[STORE] Starting login for:', email);
    try {
      console.log('[STORE] Calling login API');
      const { data } = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      console.log('[STORE] Login response received:', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token });
      console.log('[STORE] Login complete');
    } catch (error: any) {
      console.error('[STORE] Login failed:', error.message);
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    console.log('[STORE] Starting registration for:', email);
    try {
      console.log('[STORE] Calling API with:', { name, email });
      const { data } = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      });
      console.log('[STORE] Registration response received:', data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token });
      console.log('[STORE] Registration complete');
    } catch (error: any) {
      console.error('[STORE] Registration failed:', error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const { data } = await api.get('/auth/me');
      set({ user: data, token, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
