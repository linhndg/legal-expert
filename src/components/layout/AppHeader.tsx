import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import Button from '../ui/Button';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  onLogout: () => void;
  showLogout?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  userName,
  onLogout,
  showLogout = true
}) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>
          </div>
          {showLogout && (
            <div className="flex items-center space-x-4">
              {userName && (
                <span className="text-sm text-gray-600">Welcome, {userName}</span>
              )}
              <Button
                variant="danger"
                icon={LogOut}
                onClick={onLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
