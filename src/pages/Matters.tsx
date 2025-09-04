import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Matter {
  id: string;
  customerId: string;
  name: string;
  description: string;
  caseType: string;
  status: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

const statusColors = {
  Active: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Closed: 'bg-gray-100 text-gray-800',
  OnHold: 'bg-red-100 text-red-800'
};

const caseTypeColors = {
  Corporate: 'bg-blue-100 text-blue-800',
  Litigation: 'bg-purple-100 text-purple-800',
  RealEstate: 'bg-green-100 text-green-800',
  Family: 'bg-pink-100 text-pink-800',
  Criminal: 'bg-red-100 text-red-800',
  Immigration: 'bg-indigo-100 text-indigo-800',
  Other: 'bg-gray-100 text-gray-800'
};

export default function Matters() {
  const { customerId } = useParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [matters, setMatters] = useState<Matter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      fetchCustomerAndMatters();
    }
  }, [customerId]);

  const fetchCustomerAndMatters = async () => {
    if (!customerId) return;
    
    try {
      setIsLoading(true);
      
      // Fetch customer info and matters in parallel
      const [customerResponse, mattersResponse] = await Promise.all([
        axios.get(`/api/customers/${customerId}`),
        axios.get(`/api/customers/${customerId}/matters`)
      ]);
      
      setCustomer(customerResponse.data);
      setMatters(mattersResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMatter = async (matterId: string) => {
    if (!customerId) return;
    
    try {
      await axios.delete(`/api/customers/${customerId}/matters/${matterId}`);
      setMatters(matters.filter(m => m.id !== matterId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete matter:', error);
      alert('Failed to delete matter. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCaseType = (caseType: string) => {
    switch (caseType) {
      case 'RealEstate': return 'Real Estate';
      case 'OnHold': return 'On Hold';
      default: return caseType;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading matters...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Customer Not Found</h2>
          <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist.</p>
          <Link
            to="/customers"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                to="/customers"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {customer.name}'s Matters
                </h1>
                <p className="text-gray-600">{customer.email}</p>
              </div>
            </div>
            <Link
              to={`/customers/${customerId}/matters/new`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Matter</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Matters List */}
        {matters.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matters.map((matter) => (
              <div key={matter.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {matter.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          statusColors[matter.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {matter.status === 'OnHold' ? 'On Hold' : matter.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          caseTypeColors[matter.caseType as keyof typeof caseTypeColors] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {formatCaseType(matter.caseType)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Link
                        to={`/customers/${customerId}/matters/${matter.id}/edit`}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded"
                        title="Edit matter"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(matter.id)}
                        className="text-red-600 hover:text-red-700 p-1 rounded"
                        title="Delete matter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {matter.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {matter.description}
                    </p>
                  )}

                  {/* Dates */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Started: {formatDate(matter.startDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Created: {formatDate(matter.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No matters yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding the first matter for {customer.name}
            </p>
            <Link
              to={`/customers/${customerId}/matters/new`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Matter</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Matter
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this matter? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMatter(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}