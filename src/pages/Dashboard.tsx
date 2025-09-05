import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Users, FileText, Plus, TrendingUp, LogOut } from 'lucide-react';
import axios from 'axios';

interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

interface Matter {
  id: string;
  name: string;
  caseType: string;
  status: string;
  customerName: string;
  startDate: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalMatters: number;
  activeMatters: number;
  recentCustomers: Customer[];
  recentMatters: Matter[];
}

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalMatters: 0,
    activeMatters: 0,
    recentCustomers: [],
    recentMatters: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch customers
      const customersResponse = await axios.get('/api/customers');
      const customers = customersResponse.data;
      
      // Fetch all matters for all customers
      const mattersPromises = customers.map((customer: Customer) =>
        axios.get(`/api/customers/${customer.id}/matters`).catch(() => ({ data: [] }))
      );
      
      const mattersResponses = await Promise.all(mattersPromises);
      const allMatters = mattersResponses.flatMap(response => response.data);
      
      const activeMatters = allMatters.filter((matter: Matter) => 
        matter.status === 'Active' || matter.status === 'In Progress'
      );
      
      setStats({
        totalCustomers: customers.length,
        totalMatters: allMatters.length,
        activeMatters: activeMatters.length,
        recentCustomers: customers.slice(0, 5),
        recentMatters: allMatters.slice(0, 5),
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in progress':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/customers/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Customer</span>
              </Link>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Matters</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMatters}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Matters</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeMatters}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Customers */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Customers</h2>
                <Link
                  to="/customers"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats.recentCustomers.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {formatDate(customer.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No customers yet</p>
                  <Link
                    to="/customers/new"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add your first customer
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Matters */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Matters</h2>
                <Link
                  to="/customers"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats.recentMatters.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentMatters.map((matter) => (
                    <div key={matter.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{matter.name}</p>
                        <p className="text-sm text-gray-600">
                          {matter.customerName} • {matter.caseType}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(matter.status)}`}>
                          {matter.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No matters yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add customers first, then create matters for them
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}