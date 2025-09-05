import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/utils/axios';
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

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Set up axios defaults for customer token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    loadCustomerData();
  }, [navigate]);

  const loadCustomerData = async () => {
    try {
      setIsLoading(true);
      const [profileResponse, mattersResponse] = await Promise.all([
        axios.get('/api/customer/profile'),
        axios.get('/api/customer/matters')
      ]);

      setCustomer(profileResponse.data);
      setMatters(mattersResponse.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        alert('Failed to load your data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerData');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  if (!customer) {
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
        subtitle={`Welcome back, ${customer.name}`}
        userName={customer.name}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    </PageLayout>
  );
}
