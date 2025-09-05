import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Calendar, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

interface MatterFormData {
  name: string;
  description: string;
  caseType: string;
  status: string;
  startDate: string;
}

interface Matter extends MatterFormData {
  id: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

const caseTypes = [
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Litigation', label: 'Litigation' },
  { value: 'RealEstate', label: 'Real Estate' },
  { value: 'Family', label: 'Family' },
  { value: 'Criminal', label: 'Criminal' },
  { value: 'Immigration', label: 'Immigration' },
  { value: 'Other', label: 'Other' }
];

const statuses = [
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'OnHold', label: 'On Hold' },
  { value: 'Closed', label: 'Closed' }
];

export default function MatterForm() {
  const navigate = useNavigate();
  const { customerId, matterId } = useParams<{ customerId: string; matterId?: string }>();
  const { logout } = useAuthStore();
  const isEditing = Boolean(matterId);
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<MatterFormData>({
    name: '',
    description: '',
    caseType: 'Other',
    status: 'Active',
    startDate: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  });
  
  const [errors, setErrors] = useState<Partial<MatterFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customerId) {
      fetchCustomer();
      if (isEditing && matterId) {
        fetchMatter();
      }
    }
  }, [customerId, isEditing, matterId]);

  const fetchCustomer = async () => {
    if (!customerId) return;
    
    try {
      const response = await axios.get<Customer>(`/api/customers/${customerId}`);
      setCustomer(response.data);
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      alert('Failed to load customer data. Please try again.');
      navigate('/customers');
    }
  };

  const fetchMatter = async () => {
    if (!customerId || !matterId) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get<Matter>(`/api/customers/${customerId}/matters/${matterId}`);
      const matter = response.data;
      setFormData({
        name: matter.name,
        description: matter.description,
        caseType: matter.caseType,
        status: matter.status,
        startDate: matter.startDate.split('T')[0] // Convert to YYYY-MM-DD format
      });
    } catch (error) {
      console.error('Failed to fetch matter:', error);
      alert('Failed to load matter data. Please try again.');
      navigate(`/customers/${customerId}/matters`);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<MatterFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Matter name is required';
    }

    if (!formData.caseType) {
      newErrors.caseType = 'Case type is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const startDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate > today) {
        newErrors.startDate = 'Start date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !customerId) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert date to ISO string for API
      const submitData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString()
      };
      
      if (isEditing && matterId) {
        await axios.put(`/api/customers/${customerId}/matters/${matterId}`, submitData);
      } else {
        await axios.post(`/api/customers/${customerId}/matters`, submitData);
      }
      
      navigate(`/customers/${customerId}/matters`);
    } catch (error: any) {
      console.error('Failed to save matter:', error);
      
      if (error.response?.status === 400) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          setErrors(validationErrors);
        } else {
          alert('Please check your input and try again.');
        }
      } else {
        alert('Failed to save matter. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof MatterFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading matter...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate(`/customers/${customerId}/matters`)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Matter' : 'Add New Matter'}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? 'Update matter information' : `Create a new matter for ${customer.name}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Matter Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Matter Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter matter name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the matter details..."
              />
            </div>

            {/* Case Type and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Case Type */}
              <div>
                <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-2">
                  Case Type *
                </label>
                <select
                  id="caseType"
                  name="caseType"
                  value={formData.caseType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.caseType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {caseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.caseType && (
                  <p className="mt-1 text-sm text-red-600">{errors.caseType}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(`/customers/${customerId}/matters`)}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEditing ? 'Update Matter' : 'Create Matter'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}