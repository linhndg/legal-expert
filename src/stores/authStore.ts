import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../utils/axios';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  firmName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    firmName: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

const API_BASE_URL = 'http://localhost:5000/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post('/auth/login', {
            email,
            password,
          });

          const { token, user } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Token will be automatically added to requests via axios interceptor
          return { success: true };
        } catch (error: any) {
          set({ isLoading: false });
          const errorMessage = error.response?.data?.message || 'Login failed';
          return { success: false, error: errorMessage };
        }
      },

      signup: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post('/auth/signup', userData);
          
          const { token, user } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          // Token will be automatically added to requests via axios interceptor
          return { success: true };
        } catch (error: any) {
          set({ isLoading: false });
          const errorMessage = error.response?.data?.message || 'Signup failed';
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        // Token removal will be handled by axios interceptor
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
        // Token will be automatically added to requests via axios interceptor
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Token will be automatically added to requests via axios interceptor
        // No need to set headers manually
      },
    }
  )
);