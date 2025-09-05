import axios from 'axios';
// import { APP_CONFIG, STORAGE_KEYS } from '@/constants';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5207', // APP_CONFIG.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Check for customer token first
    const customerToken = localStorage.getItem('customerToken');
    if (customerToken) {
      config.headers.Authorization = `Bearer ${customerToken}`;
      return config;
    }

    // Then check for law firm token (stored in zustand persist)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const authData = JSON.parse(authStorage);
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Check if this is a customer request
      const customerToken = localStorage.getItem('customerToken');
      if (customerToken) {
        // Clear customer auth data
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerData');
      } else {
        // Clear law firm auth data
        localStorage.removeItem('auth-storage');
      }
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
