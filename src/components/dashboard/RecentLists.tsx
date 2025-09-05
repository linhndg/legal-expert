import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Plus } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

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

interface RecentListsProps {
  recentCustomers: Customer[];
  recentMatters: Matter[];
}

const RecentLists: React.FC<RecentListsProps> = ({ recentCustomers, recentMatters }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Recent Customers */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Customers</h2>
          <div className="flex space-x-2">
            <Link to="/customers/new">
              <Button variant="outline" size="sm" icon={Plus}>
                Add Customer
              </Button>
            </Link>
            <Link to="/customers">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
        <div className="space-y-3">
          {recentCustomers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No customers yet</p>
          ) : (
            recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {formatDate(customer.createdAt)}
                  </p>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Recent Matters */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Matters</h2>
          <div className="flex space-x-2">
            <Link to="/matters/new">
              <Button variant="outline" size="sm" icon={Plus}>
                Add Matter
              </Button>
            </Link>
            <Link to="/matters">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
        <div className="space-y-3">
          {recentMatters.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No matters yet</p>
          ) : (
            recentMatters.map((matter) => (
              <div key={matter.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{matter.name}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(matter.status)}`}>
                      {matter.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{matter.customerName}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {matter.caseType} • {formatDate(matter.startDate)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default RecentLists;
