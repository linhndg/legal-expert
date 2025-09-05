import React from 'react';
import { TrendingUp, Users, FileText, Activity } from 'lucide-react';
import Card from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = ''
}) => {
  return (
    <Card className={className}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {trend && (
              <div className={`flex items-center text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend.value}%
              </div>
            )}
          </div>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

interface DashboardStatsProps {
  totalCustomers: number;
  totalMatters: number;
  activeMatters: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalCustomers,
  totalMatters,
  activeMatters
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Total Customers"
        value={totalCustomers}
        icon={<Users className="w-5 h-5 text-blue-600" />}
      />
      <StatsCard
        title="Total Matters"
        value={totalMatters}
        icon={<FileText className="w-5 h-5 text-blue-600" />}
      />
      <StatsCard
        title="Active Matters"
        value={activeMatters}
        icon={<Activity className="w-5 h-5 text-blue-600" />}
      />
    </div>
  );
};

export default DashboardStats;
