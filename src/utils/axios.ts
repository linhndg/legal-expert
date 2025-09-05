import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5207',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check for customer token first
    const customerToken = localStorage.getItem('customerToken');
    if (customerToken) {
      config.headers.Authorization = `Bearer ${customerToken}`;
      return config;
    }

    // Then check for law firm token
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this is a customer request
      const customerToken = localStorage.getItem('customerToken');
      if (customerToken) {
        // Clear customer auth data and redirect to customer login
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerData');
        window.location.href = '/customer-login';
      } else {
        // Clear law firm auth data and redirect to login
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Set axios defaults for the entire app
axios.defaults.baseURL = 'http://localhost:5207';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to default axios instance as well
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
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

// Add response interceptor to default axios instance
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);