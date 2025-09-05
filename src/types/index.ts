export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  firmName: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Matter {
  id: string;
  customerId: string;
  name: string;
  description: string;
  status: string;
  caseType?: string;
  customerName?: string;
  startDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalMatters: number;
  activeMatters: number;
  recentCustomers: Customer[];
  recentMatters: Matter[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData extends LoginFormData {
  firstName: string;
  lastName: string;
  firmName: string;
  confirmPassword: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  password: string;
}

export interface MatterFormData {
  name: string;
  description: string;
  status: string;
  customerId: string;
  caseType?: string;
}
