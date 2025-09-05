import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerForm from './pages/CustomerForm';
import Matters from './pages/Matters';
import MatterForm from './pages/MatterForm';
import CustomerPortal from './pages/CustomerPortal';

// Protected Route Component for regular users
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

// Protected Route Component for customers
function CustomerProtectedRoute({ children }: { children: React.ReactNode }) {
  const customerToken = localStorage.getItem('customerToken');
  return customerToken ? <>{children}</> : <Navigate to="/login" replace />;
}

// Public Route Component (redirect based on token type)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  const customerToken = localStorage.getItem('customerToken');
  
  // If user has law firm token, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If customer has token, redirect to customer portal
  if (customerToken) {
    return <Navigate to="/customer-portal" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          
          {/* Customer Routes */}
          <Route path="/customer-portal" element={
            <CustomerProtectedRoute>
              <CustomerPortal />
            </CustomerProtectedRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          } />
          <Route path="/customers/new" element={
            <ProtectedRoute>
              <CustomerForm />
            </ProtectedRoute>
          } />
          <Route path="/customers/:id/edit" element={
            <ProtectedRoute>
              <CustomerForm />
            </ProtectedRoute>
          } />
          <Route path="/customers/:customerId/matters" element={
            <ProtectedRoute>
              <Matters />
            </ProtectedRoute>
          } />
          <Route path="/customers/:customerId/matters/new" element={
            <ProtectedRoute>
              <MatterForm />
            </ProtectedRoute>
          } />
          <Route path="/customers/:customerId/matters/:matterId/edit" element={
            <ProtectedRoute>
              <MatterForm />
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
