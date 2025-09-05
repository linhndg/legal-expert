import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LogIn } from 'lucide-react';
import axios from '@/utils/axios';
import { LoginTypeSelector, LoginForm } from '@/components/auth';
import { PageLayout } from '@/components/layout';

type LoginType = 'law-firm' | 'customer';

export default function Login() {
  const [loginType, setLoginType] = useState<LoginType>('law-firm');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    
    if (!validateForm()) {
      return;
    }

    try {
      if (loginType === 'law-firm') {
        // Use auth store for law firm login
        await login(email, password);
        navigate('/dashboard');
      } else {
        // Direct API call for customer login
        console.log('Attempting customer login with:', { email });
        
        const response = await axios.post('/api/customer/login', {
          email,
          password
        });
        
        console.log('Customer login response:', response.data);
        
        // Store customer token and data
        localStorage.setItem('customerToken', response.data.token);
        localStorage.setItem('customerData', JSON.stringify(response.data.customer));
        
        // Redirect to customer portal
        navigate('/customer-portal');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.status === 400 || error.response?.status === 401) {
        setErrors({ general: 'Invalid email or password' });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    }
  };

  return (
    <PageLayout>
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

          <LoginTypeSelector
            selectedType={loginType}
            onTypeChange={handleLoginTypeChange}
          />

          <LoginForm
            email={email}
            password={password}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
            errors={errors}
            isLoading={isLoading}
            loginType={loginType}
          />

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
    </PageLayout>
  );
}
