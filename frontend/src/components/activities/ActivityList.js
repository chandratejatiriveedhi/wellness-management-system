import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('/api/activities');
        setActivities(response.data);
      } catch (err) {
        setError('Error loading activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold">{activity.name}</h3>
            <p className="text-gray-600">{activity.type}</p>
            <p className="text-sm">
              {activity.inPerson ? 'inPerson' : 'Remote'}
            </p>
            <p className="mt-2">{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}