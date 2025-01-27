import React, { useState, useEffect } from 'react';

const MaintenanceControlPage = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [activities, setActivities] = useState([]);
  const [mode, setMode] = useState('list');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    date: '',
    activity: ''
  });
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    activityId: '',
    userId: '',
    notes: ''
  });

  // Fetch initial data
  useEffect(() => {
    fetchMaintenanceRecords();
    fetchActivities();
    // Get user info from token
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
      setUserId(payload.sub);
    }
  }, []);

  const fetchMaintenanceRecords = async () => {
    try {
      const response = await fetch('/api/maintenance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMaintenanceRecords(data);
      }
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleModeChange = (newMode, record = null) => {
    setMode(newMode);
    setSelectedRecord(record);
    if (record) {
      setFormData({
        date: record.date,
        activityId: record.activityId,
        userId: record.userId,
        notes: record.notes || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        activityId: '',
        userId: userRole === 'STUDENT' ? userId : '',
        notes: ''
      });
    }
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`/api/maintenance/${recordId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          fetchMaintenanceRecords();
        }
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = mode === 'change' 
        ? `/api/maintenance/${selectedRecord.id}`
        : '/api/maintenance';
      const method = mode === 'change' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMode('list');
        fetchMaintenanceRecords();
      }
    } catch (error) {
      console.error('Error saving maintenance record:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const canModifyRecord = (record) => {
    switch (userRole) {
      case 'ADMIN':
        return true;
      case 'TEACHER':
      case 'CLIENT':
        return true; // Assuming they can modify any student's record
      case 'STUDENT':
        return record.userId === userId;
      default:
        return false;
    }
  };

  const renderSearchFilters = () => (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={searchFilters.date}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Activity</label>
          <select
            name="activity"
            value={searchFilters.activity}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Activities</option>
            {activities.map(activity => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        {mode === 'add' ? 'Add New Record' : mode === 'change' ? 'Edit Record' : 'View Record'}
      </h2>
      
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              disabled={mode === 'consult'}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Activity *</label>
            <select
              name="activityId"
              value={formData.activityId}
              onChange={handleInputChange}
              disabled={mode === 'consult'}
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Activity</option>
              {activities.map(activity => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </div>

          {userRole !== 'STUDENT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">User/Group</label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                disabled={mode === 'consult' || userRole === 'STUDENT'}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              disabled={mode === 'consult'}
              rows="3"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => handleModeChange('list')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </button>
          {mode !== 'consult' && (
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {mode === 'add' ? 'Create' : 'Update'}
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderMaintenanceList = () => {
    const filteredRecords = maintenanceRecords.filter(record => {
      const matchesDate = !searchFilters.date || record.date === searchFilters.date;
      const matchesActivity = !searchFilters.activity || record.activityId === searchFilters.activity;
      return matchesDate && matchesActivity;
    });

    return (
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User/Group
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record) => {
              const activity = activities.find(a => a.id === record.activityId);
              return (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {activity ? activity.name : 'Unknown Activity'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => handleModeChange('consult', record)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    {canModifyRecord(record) && (
                      <>
                        <button
                          onClick={() => handleModeChange('change', record)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Control</h1>
        {mode === 'list' && (
          <button
            onClick={() => handleModeChange('add')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Record
          </button>
        )}
      </div>

      {mode === 'list' && renderSearchFilters()}
      {(mode === 'add' || mode === 'change' || mode === 'consult') && renderMaintenanceForm()}
      {mode === 'list' && renderMaintenanceList()}
    </div>
  );
};

export default MaintenanceControlPage;