import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
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
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}