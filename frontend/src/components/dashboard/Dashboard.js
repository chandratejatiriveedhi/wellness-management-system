import React from 'react';
import ManagementCharts from './ManagementCharts';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Total Activities</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Active Students</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Today's Sessions</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
          </div>
        </div>
      </div>

      <ManagementCharts />
    </div>
  );
}