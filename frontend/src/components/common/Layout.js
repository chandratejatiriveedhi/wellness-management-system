import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-4">
                <img
                  className="h-8 w-auto"
                  src="/wellness-logo.svg"
                  alt="Wellness Management"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Wellness Management
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Decorative elements representing wellness activities */}
      <div className="fixed top-0 right-0 -z-10 opacity-10">
        <svg className="h-64 w-64" viewBox="0 0 100 100">
          <path
            d="M50 15 C30 15 15 30 15 50 C15 70 30 85 50 85 C70 85 85 70 85 50 C85 30 70 15 50 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Yoga pose silhouette */}
          <path
            d="M50 35 C45 35 40 40 40 45 C40 50 45 55 50 55 C55 55 60 50 60 45 C60 40 55 35 50 35"
            fill="currentColor"
          />
        </svg>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Wellness Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}