import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Eye, EyeOff, LogIn, User, Building } from 'lucide-react';
import axios from '@/utils/axios';

type LoginType = 'law-firm' | 'customer';

export default function Login() {
  const [loginType, setLoginType] = useState<LoginType>('law-firm');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Auto-fill test credentials when customer type is selected
  const handleLoginTypeChange = (type: LoginType) => {
    setLoginType(type);
    if (type === 'customer') {
      setEmail('john@test.com');
      setPassword('test123');
    } else {
      setEmail('');
      setPassword('');
    }
    setErrors({}); // Clear any existing errors
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setErrors({}); // Clear previous errors
      
      if (loginType === 'customer') {
        // Handle customer login
        console.log('Attempting customer login with:', { email });
        const response = await axios.post('/api/customer/login', { email, password });
        
        console.log('Customer login response:', response.data);
        
        // Store customer token and data
        localStorage.setItem('customerToken', response.data.token);
        localStorage.setItem('customerData', JSON.stringify(response.data.customer));
        
        // Redirect to customer portal
        navigate('/customer-portal');
        return;
      }
      
      // Handle law firm login
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (loginType === 'customer') {
        if (error.response?.status === 400) {
          setErrors({ general: 'Invalid email or password' });
        } else {
          setErrors({ general: 'Customer login failed. Please try again.' });
        }
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            {loginType === 'customer' ? 'Sign in to your customer portal' : 'Sign in to your Legal SaaS account'}
          </p>
          {loginType === 'customer' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                <strong>Test Account:</strong> john@test.com / test123
              </p>
            </div>
          )}
        </div>

        {/* Login Type Selection */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleLoginTypeChange('law-firm')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                loginType === 'law-firm'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <Building className="w-5 h-5" />
              <span className="font-medium">Law Firm</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoginTypeChange('customer')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-colors ${
                loginType === 'customer'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Customer</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={loginType === 'customer' ? 'Enter your email (e.g., john@test.com)' : 'Enter your email'}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={loginType === 'customer' ? 'Enter your password (e.g., test123)' : 'Enter your password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Signing In...' : `Sign In ${loginType === 'customer' ? 'to Portal' : ''}`}
          </button>
        </form>

        {loginType === 'law-firm' && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        )}

        {loginType === 'customer' && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Customer accounts are created by your legal representative.{' '}
              <br />
              Contact your law firm if you need portal access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}