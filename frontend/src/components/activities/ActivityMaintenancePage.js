import React, { useState, useEffect } from 'react';

const ActivityMaintenancePage = () => {
  const [activities, setActivities] = useState([]);
  const [mode, setMode] = useState('list');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    activity: '',
    inPerson: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    inPerson: false
  });

  useEffect(() => {
    fetchActivities();
  }, []);

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

  const handleModeChange = (newMode, activity = null) => {
    setMode(newMode);
    setSelectedActivity(activity);
    if (activity) {
      setFormData({
        name: activity.name,
        inPerson: activity.inPerson
      });
    } else {
      setFormData({
        name: '',
        inPerson: false
      });
    }
  };

  const handleDelete = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        const response = await fetch(`/api/activities/${activityId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          fetchActivities();
        }
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = mode === 'change' 
        ? `/api/activities/${selectedActivity.id}`
        : '/api/activities';
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
        fetchActivities();
      }
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderSearchFilters = () => (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Activity Name</label>
          <input
            type="text"
            name="activity"
            value={searchFilters.activity}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">In-Person</label>
          <select
            name="inPerson"
            value={searchFilters.inPerson}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderActivityForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        {mode === 'add' ? 'Add New Activity' : mode === 'change' ? 'Edit Activity' : 'View Activity'}
      </h2>
      
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Activity Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={mode === 'consult'}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="inPerson"
              checked={formData.inPerson}
              onChange={handleInputChange}
              disabled={mode === 'consult'}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-700">Face-to-face Activity</span>
          </label>
        </div>

        <div className="flex justify-end space-x-4">
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

  const renderActivityList = () => {
    const filteredActivities = activities.filter(activity => {
      const matchesName = activity.name.toLowerCase().includes(searchFilters.activity.toLowerCase());
      const matchesInPerson = searchFilters.inPerson === '' || 
        activity.inPerson === (searchFilters.inPerson === 'true');
      return matchesName && matchesInPerson;
    });

    return (
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                In-Person
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredActivities.map((activity) => (
              <tr key={activity.id}>
                <td className="px-6 py-4 whitespace-nowrap">{activity.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activity.inPerson ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button
                    onClick={() => handleModeChange('consult', activity)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleModeChange('change', activity)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activity Maintenance</h1>
        {mode === 'list' && (
          <button
            onClick={() => handleModeChange('add')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Activity
          </button>
        )}
      </div>

      {mode === 'list' && renderSearchFilters()}
      {(mode === 'add' || mode === 'change' || mode === 'consult') && renderActivityForm()}
      {mode === 'list' && renderActivityList()}
    </div>
  );
};

export default ActivityMaintenancePage;