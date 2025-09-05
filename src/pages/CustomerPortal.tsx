import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, Calendar, LogOut, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import axios from '@/utils/axios';

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
      navigate('/customer-login');
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
    navigate('/customer-login');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load customer data.</p>
          <button
            onClick={() => navigate('/customer-login')}
            className="mt-4 text-blue-600 hover:text-blue-500"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
                <p className="text-gray-600">Welcome back, {customer.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition-colors rounded-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{customer.phoneNumber}</p>
                  </div>
                </div>
                {customer.address && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{customer.address}</p>
                    </div>
                  </div>
                )}
                {customer.lastLogin && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="font-medium">{formatDate(customer.lastLogin)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Matters/Cases */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Your Cases</h2>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">{matters.length} total</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {matters.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No cases found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Your legal matters will appear here once they are created.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matters.map((matter) => (
                      <div key={matter.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {matter.name}
                            </h3>
                            <p className="text-gray-600 mb-3">{matter.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Created: {formatDate(matter.createdAt)}</span>
                              <span>Updated: {formatDate(matter.updatedAt)}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(matter.status)}`}>
                              {matter.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
