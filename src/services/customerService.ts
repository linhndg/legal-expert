import axios from '@/utils/axios';
import { Customer, CustomerFormData } from '@/types';

export const customerService = {
  // Get all customers
  getAll: async (): Promise<Customer[]> => {
    const response = await axios.get('/api/customers');
    return response.data;
  },

  // Get customer by ID
  getById: async (id: string): Promise<Customer> => {
    const response = await axios.get(`/api/customers/${id}`);
    return response.data;
  },

  // Create new customer
  create: async (customerData: CustomerFormData): Promise<Customer> => {
    const response = await axios.post('/api/customers', customerData);
    return response.data;
  },

  // Update customer
  update: async (id: string, customerData: Partial<CustomerFormData>): Promise<Customer> => {
    const response = await axios.put(`/api/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/customers/${id}`);
  },

  // Customer portal specific endpoints
  login: async (email: string, password: string) => {
    const response = await axios.post('/api/customer/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await axios.get('/api/customer/profile');
    return response.data;
  },

  getMatters: async () => {
    const response = await axios.get('/api/customer/matters');
    return response.data;
  }
};
