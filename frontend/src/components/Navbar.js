import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userRole = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Navigation items based on role
  const navigationItems = [
    {
      name: 'User Maintenance',
      path: '/users',
      allowedRoles: ['ADMIN', 'CLIENT', 'TEACHER'],
      className: 'bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium'
    }
  ];

  const authorizedNavItems = navigationItems.filter(item => 
    item.allowedRoles.includes(userRole)
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold text-gray-800">
                Wellness Management
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {authorizedNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={item.className}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {authorizedNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block ${item.className}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}