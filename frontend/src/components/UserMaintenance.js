import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserMaintenance() {
  // State for users and selected user
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState('list'); // list, add, change, consult
  const [error, setError] = useState('');
  
  // State for form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    location: '',
    customer: null
  });

  // State for filters
  const [filters, setFilters] = useState({
    username: '',
    profile: '',
    location: ''
  });

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // API calls
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError('Error loading users');
      console.error('Error:', err);
    }
  };

  // Handler functions
  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:8080/api/users', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await fetchUsers();
      setMode('list');
      resetForm();
    } catch (err) {
      setError('Error adding user');
      console.error('Error:', err);
    }
  };

  const handleChange = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/${selectedUser.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await fetchUsers();
      setMode('list');
      resetForm();
    } catch (err) {
      setError('Error updating user');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        await fetchUsers();
      } catch (err) {
        setError('Error deleting user');
        console.error('Error:', err);
      }
    }
  };

  const handleConsult = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      location: user.location,
      customer: user.customer
    });
    setMode('consult');
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: '',
      location: '',
      customer: null
    });
    setSelectedUser(null);
  };

  const handleSearch = () => {
    const filtered = users.filter(user => {
      const matchUsername = !filters.username || 
                          user.username.toLowerCase().includes(filters.username.toLowerCase());
      const matchProfile = !filters.profile || user.role === filters.profile;
      const matchLocation = !filters.location || 
                          (user.location && user.location.toLowerCase().includes(filters.location.toLowerCase()));
      return matchUsername && matchProfile && matchLocation;
    });
    setUsers(filtered);
  };

  // Render functions
  const renderSearchFilters = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">User</label>
          <input
            type="text"
            value={filters.username}
            onChange={(e) => setFilters({...filters, username: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Search by username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profile</label>
          <select
            value={filters.profile}
            onChange={(e) => setFilters({...filters, profile: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">All Profiles</option>
            <option value="ADMIN">Administrator</option>
            <option value="CLIENT">Client</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Search by location"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </div>
  );

  const renderUserForm = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {mode === 'add' ? 'Add User' : mode === 'change' ? 'Edit User' : 'View User'}
      </h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (mode === 'add') handleAdd();
        else if (mode === 'change') handleChange();
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
              readOnly={mode === 'consult'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
              readOnly={mode === 'consult'}
            />
          </div>
          {mode !== 'consult' && (
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required={mode === 'add'}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Profile</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
              disabled={mode === 'consult'}
            >
              <option value="">Select Profile</option>
              <option value="ADMIN">Administrator</option>
              <option value="CLIENT">Client</option>
              <option value="TEACHER">Teacher</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              readOnly={mode === 'consult'}
            />
          </div>
        </div>

        {mode !== 'consult' && (
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {mode === 'add' ? 'Add User' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('list');
                resetForm();
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}

        {mode === 'consult' && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                setMode('list');
                resetForm();
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Back to List
            </button>
          </div>
        )}
      </form>
    </div>
  );

  const renderUserList = () => (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Users</h3>
        <button
          onClick={() => {
            setMode('add');
            resetForm();
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.location}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleConsult(user)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Consult
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData({
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        location: user.location,
                        customer: user.customer
                      });
                      setMode('change');
                    }}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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
    </div>
  );

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {mode === 'list' && renderSearchFilters()}
      {(mode === 'add' || mode === 'change' || mode === 'consult') && renderUserForm()}
      {mode === 'list' && renderUserList()}
    </div>
  );
}