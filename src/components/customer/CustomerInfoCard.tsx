import React from 'react';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Card from '../ui/Card';

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  lastLogin?: string;
  createdAt: string;
}

interface CustomerInfoCardProps {
  customer: CustomerData;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ customer }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card title="Your Information">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{customer.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{customer.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-900">{customer.phoneNumber}</p>
          </div>
        </div>

        {customer.address && (
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-gray-900">{customer.address}</p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium text-gray-900">
              {customer.lastLogin ? formatDate(customer.lastLogin) : 'First time login'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CustomerInfoCard;
