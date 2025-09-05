import React from 'react';
import { FileText } from 'lucide-react';
import Card from '../ui/Card';
import Empty from '../Empty';

interface Matter {
  id: string;
  customerId: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerMattersListProps {
  matters: Matter[];
}

const CustomerMattersList: React.FC<CustomerMattersListProps> = ({ matters }) => {
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
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Your Cases</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FileText className="w-4 h-4" />
          <span>{matters.length} total</span>
        </div>
      </div>

      {matters.length === 0 ? (
        <Empty
          title="No cases found"
          description="Your legal matters will appear here once they are created."
        />
      ) : (
        <div className="space-y-4">
          {matters.map((matter) => (
            <div
              key={matter.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{matter.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{matter.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Created: {formatDate(matter.createdAt)}</span>
                    <span>Updated: {formatDate(matter.updatedAt)}</span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    matter.status
                  )}`}
                >
                  {matter.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CustomerMattersList;
