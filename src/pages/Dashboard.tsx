import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import axiosInstance from '@/utils/axios';
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
  customerId: string;
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
      
      // Debug: Check if user is authenticated
      const { token, isAuthenticated } = useAuthStore.getState();
      console.log('Dashboard: Authentication status:', { isAuthenticated, hasToken: !!token });
      
      // First get all customers
      const customersResponse = await axiosInstance.get('/customers');
      const customers = customersResponse.data;

      // Then get matters for each customer
      let allMatters: Matter[] = [];
      if (customers.length > 0) {
        const matterPromises = customers.map((customer: Customer) => 
          axiosInstance.get(`/customers/${customer.id}/matters`).catch(() => ({ data: [] }))
        );
        const mattersResponses = await Promise.all(matterPromises);
        allMatters = mattersResponses.flatMap(response => response.data);
      }

      setDashboardData({
        totalCustomers: customers.length,
        totalMatters: allMatters.length,
        activeMatters: allMatters.filter((m: Matter) => m.status.toLowerCase() === 'active').length,
        recentCustomers: customers.slice(0, 5),
        recentMatters: allMatters.slice(0, 5),
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
        />
      </div>
    </PageLayout>
  );
}