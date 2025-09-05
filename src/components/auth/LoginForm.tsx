import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: { email?: string; password?: string; general?: string };
  isLoading: boolean;
  loginType: 'law-firm' | 'customer';
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  errors,
  isLoading,
  loginType
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        error={errors.email}
        required
        autoComplete="email"
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          error={errors.password}
          required
          autoComplete="current-password"
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>

      {errors.general && (
        <div className="text-red-600 text-sm">{errors.general}</div>
      )}

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Sign in to {loginType === 'law-firm' ? 'Dashboard' : 'Customer Portal'}
      </Button>
    </form>
  );
};

export default LoginForm;
