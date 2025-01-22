import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userRole = null;

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userRole = payload.role;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                <Link to="/">Wellness Management</Link>
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Show User Maintenance link for ADMIN, CLIENT, and TEACHER */}
              {(['ADMIN', 'CLIENT', 'TEACHER'].includes(userRole)) && (
                <Link
                  to="/users"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-500"
                >
                  User Maintenance
                </Link>
              )}
              {/* Add more navigation links based on roles here */}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}