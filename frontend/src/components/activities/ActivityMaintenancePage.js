import React, { useState, useEffect } from 'react';
import ActivityForm from './ActivityForm';

const ActivityMaintenancePage = () => {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    activity: '',
    inPerson: ''
  });

  // Fetch activities from backend
  useEffect(() => {
    console.log('ActivityMaintenancePage - Component mounted');
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    console.log('ActivityMaintenancePage - Fetching activities');
    try {
      const response = await fetch('http://localhost:8080/api/activities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      console.log('ActivityMaintenancePage - Fetch response status:', response.status);
  
      // Handle unauthorized access
      if (response.status === 401 || response.status === 403) {
        console.error('Unauthorized access - Redirecting to login');
        alert('Session expired. Please log in again.');
        window.location.href = '/login';  // Redirect to login page
        return;
      }
  
      // Read response as text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);
  
      // Check if response is JSON
      try {
        const data = JSON.parse(responseText);
        console.log('ActivityMaintenancePage - Fetched activities:', data);
        setActivities(data);
      } catch (error) {
        console.error('Error: Response is not valid JSON. Server might be returning an error page.', error);
        console.error('Response Text:', responseText);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };
  

  const handleAdd = () => {
    console.log('ActivityMaintenancePage - Opening add form');
    setSelectedActivity(null);
    setShowForm(true);
  };

  const handleEdit = (activity) => {
    console.log('ActivityMaintenancePage - Opening edit form for activity:', activity);
    setSelectedActivity(activity);
    setShowForm(true);
  };

  const handleDelete = async (activityId) => {
    console.log('ActivityMaintenancePage - Attempting to delete activity:', activityId);
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/activities/${activityId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        console.log('ActivityMaintenancePage - Delete response status:', response.status);
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error deleting activity:', errorText);
          return;
        }
  
        console.log('ActivityMaintenancePage - Activity deleted successfully');
        fetchActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
  };
  
  const handleFormSubmit = async (formData) => {
    console.log('ActivityMaintenancePage - Form submitted with data:', formData);
    try {
      
      const url = selectedActivity
      ? `http://localhost:8080/api/activities/${selectedActivity.id}`  // Update existing
      : `http://localhost:8080/api/activities`;  // Use full backend URL
      const method = selectedActivity ? 'PUT' : 'POST';

      console.log(`ActivityMaintenancePage - Making ${method} request to:`, url);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      console.log('ActivityMaintenancePage - Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return;
      }

      const savedActivity = await response.json();
      console.log('ActivityMaintenancePage - Saved activity:', savedActivity);

      setShowForm(false);
      fetchActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(`ActivityMaintenancePage - Filter changed: ${name} = ${value}`);
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredActivities = activities.filter(activity => {
    const matchesName = activity.name.toLowerCase().includes(searchFilters.activity.toLowerCase());
    const matchesInPerson = searchFilters.inPerson === '' || 
      activity.inPerson === (searchFilters.inPerson === 'true');
    return matchesName && matchesInPerson;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Activity Maintenance</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Activity
        </button>
      </div>

      {/* Search Filters */}
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

      {/* Activities Table */}
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
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleEdit(activity)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
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

      {/* Activity Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <ActivityForm
            activity={selectedActivity}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ActivityMaintenancePage;