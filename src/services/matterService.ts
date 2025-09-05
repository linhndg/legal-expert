import axios from '@/utils/axios';
import { Matter, MatterFormData } from '@/types';

export const matterService = {
  // Get all matters
  getAll: async (): Promise<Matter[]> => {
    const response = await axios.get('/api/matters');
    return response.data;
  },

  // Get matter by ID
  getById: async (id: string): Promise<Matter> => {
    const response = await axios.get(`/api/matters/${id}`);
    return response.data;
  },

  // Create new matter
  create: async (matterData: MatterFormData): Promise<Matter> => {
    const response = await axios.post('/api/matters', matterData);
    return response.data;
  },

  // Update matter
  update: async (id: string, matterData: Partial<MatterFormData>): Promise<Matter> => {
    const response = await axios.put(`/api/matters/${id}`, matterData);
    return response.data;
  },

  // Delete matter
  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/matters/${id}`);
  },

  // Get matters by customer ID
  getByCustomerId: async (customerId: string): Promise<Matter[]> => {
    const response = await axios.get(`/api/matters/customer/${customerId}`);
    return response.data;
  }
};
