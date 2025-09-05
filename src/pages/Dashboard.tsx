import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import { PageLayout, AppHeader } from '@/components/layout';
import { DashboardStats, RecentLists } from '@/components/dashboard';

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

interface DashboardData {
  totalCustomers: number;
  totalMatters: number;
  activeMatters: number;
  recentCustomers: Customer[];
  recentMatters: Matter[];
}

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
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
      
      // Simulate API calls - replace with actual endpoints
      const [customersResponse, mattersResponse] = await Promise.all([
        axios.get('/api/customers'),
        axios.get('/api/matters')
      ]);

      const customers = customersResponse.data;
      const matters = mattersResponse.data;

      setDashboardData({
        totalCustomers: customers.length,
        totalMatters: matters.length,
        activeMatters: matters.filter((m: Matter) => m.status.toLowerCase() === 'active').length,
        recentCustomers: customers.slice(0, 5),
        recentMatters: matters.slice(0, 5),
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <PageLayout isLoading={isLoading}>
      <AppHeader
        title="Dashboard"
        subtitle="Legal Practice Management"
        userName={user ? `${user.firstName} ${user.lastName}` : undefined}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats
          totalCustomers={dashboardData.totalCustomers}
          totalMatters={dashboardData.totalMatters}
          activeMatters={dashboardData.activeMatters}
        />

        <RecentLists
          recentCustomers={dashboardData.recentCustomers}
          recentMatters={dashboardData.recentMatters}
        />
      </div>
    </PageLayout>
  );
}
