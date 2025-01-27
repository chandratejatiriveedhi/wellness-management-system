import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ForgotPassword from './components/ForgotPassword';
import Navbar from './components/Navbar';
import UserMaintenance from './components/UserMaintenance';
import CustomerMaintenancePage from './components/CustomerMaintenancePage';

// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Decode token to get user role
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userRole = payload.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Layout component for the dashboard
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

// Dashboard component
const Dashboard = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-2xl font-bold mb-4">Welcome to Wellness Management System</h2>
    <p className="text-gray-600">Select an option from the menu to get started.</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['ADMIN', 'CLIENT', 'TEACHER']}>
            <DashboardLayout>
              <UserMaintenance />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/customer" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout>
              <CustomerMaintenancePage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}