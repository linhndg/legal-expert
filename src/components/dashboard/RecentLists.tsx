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

interface RecentListsProps {
  recentCustomers: Customer[];
}

const RecentLists: React.FC<RecentListsProps> = ({ recentCustomers }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl">
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
                    <Link to={`/customers/${customer.id}/edit`} className="hover:text-blue-600 transition-colors">
                      <p className="font-medium text-gray-900 hover:text-blue-600">{customer.name}</p>
                    </Link>
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
    </div>
  );
};

export default RecentLists;
