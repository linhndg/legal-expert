import axios from '@/utils/axios';
import { LoginFormData, SignupFormData, User } from '@/types';

export const authService = {
  // Login
  login: async (credentials: LoginFormData) => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  },

  // Signup
  signup: async (userData: SignupFormData) => {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await axios.get('/api/auth/profile');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await axios.post('/api/auth/refresh');
    return response.data;
  },

  // Logout
  logout: async () => {
    await axios.post('/api/auth/logout');
  }
};
