import React from 'react';
import { Building, User } from 'lucide-react';

type LoginType = 'law-firm' | 'customer';

interface LoginTypeSelectorProps {
  selectedType: LoginType;
  onTypeChange: (type: LoginType) => void;
}

const LoginTypeSelector: React.FC<LoginTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Login as:
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onTypeChange('law-firm')}
          className={`flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
            selectedType === 'law-firm'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Building className="w-4 h-4 mr-2" />
          Law Firm
        </button>
        <button
          type="button"
          onClick={() => onTypeChange('customer')}
          className={`flex items-center justify-center px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
            selectedType === 'customer'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <User className="w-4 h-4 mr-2" />
          Customer
        </button>
      </div>
    </div>
  );
};

export default LoginTypeSelector;
