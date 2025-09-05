// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout'
  },
  CUSTOMERS: {
    BASE: '/api/customers',
    BY_ID: (id: string) => `/api/customers/${id}`,
    LOGIN: '/api/customer/login',
    PROFILE: '/api/customer/profile',
    MATTERS: '/api/customer/matters'
  },
  MATTERS: {
    BASE: '/api/matters',
    BY_ID: (id: string) => `/api/matters/${id}`,
    BY_CUSTOMER: (customerId: string) => `/api/matters/customer/${customerId}`
  }
} as const;

// Application routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/customers',
  CUSTOMER_NEW: '/customers/new',
  CUSTOMER_EDIT: (id: string) => `/customers/${id}/edit`,
  MATTERS: '/matters',
  MATTER_NEW: '/matters/new',
  MATTER_EDIT: (id: string) => `/matters/${id}/edit`,
  CUSTOMER_PORTAL: '/customer-portal'
} as const;

// Matter status options
export const MATTER_STATUSES = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'closed', label: 'Closed', color: 'gray' },
  { value: 'urgent', label: 'Urgent', color: 'red' }
] as const;

// Case types
export const CASE_TYPES = [
  'Corporate Law',
  'Criminal Law',
  'Family Law',
  'Real Estate Law',
  'Personal Injury',
  'Employment Law',
  'Intellectual Property',
  'Immigration Law',
  'Tax Law',
  'Environmental Law',
  'Other'
] as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  CUSTOMER_TOKEN: 'customerToken',
  CUSTOMER_DATA: 'customerData'
} as const;

// Application configuration
export const APP_CONFIG = {
  NAME: 'Legal Expert',
  VERSION: '1.0.0',
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5207',
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:5174'
} as const;
