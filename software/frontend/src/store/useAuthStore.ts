import { create } from 'zustand';
import { User, AuthResponse } from '../types';
import { fetchApi } from '../api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: { usernameOrEmail: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateUserData: (updatedUser: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchApi<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      localStorage.setItem('token', response.token);
      set({
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });

      await get().fetchProfile();
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchApi<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      localStorage.setItem('token', response.token);
      set({
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });

      await get().fetchProfile();
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  fetchProfile: async () => {
    if (!get().token) return;
    set({ isLoading: true });
    try {
      const profile = await fetchApi<User>('/users/me');
      set({ user: profile, isLoading: false, isAuthenticated: true });
    } catch (err: any) {
      set({ isLoading: false });
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        get().logout();
      }
    }
  },

  updateUserData: (updatedUser) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    }));
  },

  clearError: () => set({ error: null }),
}));
