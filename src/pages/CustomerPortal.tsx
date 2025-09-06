import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axios';
import { PageLayout, AppHeader } from '@/components/layout';
import { CustomerInfoCard, CustomerMattersList } from '@/components/customer';

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  lastLogin?: string;
  createdAt: string;
}

interface Matter {
  id: string;
  customerId: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerPortal() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Set up axiosInstance defaults for customer token
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    loadCustomerData();
  }, [navigate]);

  const loadCustomerData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [profileResponse, mattersResponse] = await Promise.all([
        axiosInstance.get('/customer/profile'),
        axiosInstance.get('/customer/matters')
      ]);

      setCustomer(profileResponse.data);
      setMatters(mattersResponse.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        // Extract meaningful error message
        let errorMessage = 'Failed to load your data. Please try again.';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.errors) {
          // Handle validation errors
          const errors = error.response.data.errors;
          if (errors.Description && errors.Description.length > 0) {
            errorMessage = errors.Description[0];
          } else {
            errorMessage = 'Validation error occurred.';
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    delete axiosInstance.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  if (!customer && !error) {
    return (
      <PageLayout isLoading={isLoading}>
        <div />
      </PageLayout>
    );
  }

  return (
    <PageLayout isLoading={isLoading}>
      <AppHeader
        title="Customer Portal"
        subtitle={customer ? `Welcome back, ${customer.name}` : "Customer Portal"}
        userName={customer?.name || "Guest"}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => loadCustomerData()}
                  className="text-sm text-red-600 hover:text-red-500 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {customer && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Customer Information */}
            <div className="lg:col-span-1">
              <CustomerInfoCard customer={customer} />
            </div>

            {/* Customer Matters */}
            <div className="lg:col-span-2">
              <CustomerMattersList matters={matters} />
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
