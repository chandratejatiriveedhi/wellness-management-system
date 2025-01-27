import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { validateRequired, validateEmail } from './validation';

export default function UserMaintenance() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profile: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      setError('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', formData);
      fetchUsers();
      setFormData({ username: '', email: '', profile: '', location: '' });
    } catch (err) {
      setError('Error creating user');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">User Maintenance</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6" aria-label="User creation form">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="profile" className="block text-sm font-medium text-gray-700">Profile</label>
          <select
            id="profile"
            name="profile"
            value={formData.profile}
            onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
            aria-required="true"
          >
            <option value="">Select Profile</option>
            <option value="ADMIN">Administrator</option>
            <option value="CLIENT">Client</option>
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          aria-label="Add new user"
        >
          Add User
        </button>
      </form>

      {loading && <div role="status">Loading...</div>}
      {error && <div role="alert" className="text-red-500">{error}</div>}

      <div className="mt-6">
        <table className="min-w-full divide-y divide-gray-200" role="grid" aria-label="Users table">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.profile}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                    aria-label={`Edit user ${user.username}`}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    aria-label={`Delete user ${user.username}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}