import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserMaintenance() {
  // State management
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profile: '',
    location: '',
    customerId: '',
  });
  const [searchFilters, setSearchFilters] = useState({
    username: '',
    profile: '',
    location: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState('list'); // list, add, change, consult

  // Fetch initial data
  useEffect(() => {
    fetchUsers();
    fetchCustomers();
  }, []);

  // API calls
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', {
        params: searchFilters
      });
      setUsers(response.data);
    } catch (err) {
      setError('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error loading customers:', err);
    }
  };

  // Event handlers
  const handleAdd = () => {
    setMode('add');
    setSelectedUser(null);
    resetForm();
  };

  const handleChange = (user) => {
    setMode('change');
    setSelectedUser(user);
    setFormData({
      ...user,
      customerId: user.customer?.id || ''
    });
  };

  const handleConsult = (user) => {
    setMode('consult');
    setSelectedUser(user);
    setFormData({
      ...user,
      customerId: user.customer?.id || ''
    });
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        fetchUsers();
      } catch (err) {
        setError('Error deleting user');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'add') {
        await axios.post('/api/users', formData);
      } else if (mode === 'change') {
        await axios.put(`/api/users/${selectedUser.id}`, formData);
      }
      fetchUsers();
      setMode('list');
      resetForm();
    } catch (err) {
      setError(`Error ${mode === 'add' ? 'creating' : 'updating'} user`);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      profile: '',
      location: '',
      customerId: ''
    });
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
          readOnly={mode === 'consult'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
          readOnly={mode === 'consult'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Profile</label>
        <select
          value={formData.profile}
          onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          readOnly={mode === 'consult'}
        />
      </div>

      {formData.profile === 'CLIENT' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer</label>
          <select
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
            disabled={mode === 'consult'}
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.customerName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex space-x-4">
        {mode !== 'consult' && (
          <button
            type="submit"
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {mode === 'add' ? 'Add User' : 'Save Changes'}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setMode('list');
            resetForm();
          }}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to List
        </button>
      </div>
    </form>
  );

  const renderSearchFilters = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Search Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">User</label>
          <input
            type="text"
            value={searchFilters.username}
            onChange={(e) => setSearchFilters({ ...searchFilters, username: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Profile</label>
          <select
            value={searchFilters.profile}
            onChange={(e) => setSearchFilters({ ...searchFilters, profile: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">All Profiles</option>
            <option value="ADMIN">Administrator</option>
            <option value="CLIENT">Client</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={searchFilters.location}
            onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={fetchUsers}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Maintenance</h2>
        {mode === 'list' && (
          <button
            onClick={handleAdd}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Add User
          </button>
        )}
      </div>

      {mode === 'list' && renderSearchFilters()}

      {mode !== 'list' && renderForm()}

      {mode === 'list' && (
        <>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div className="mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    <td className="px-6 py-4 whitespace-nowrap">{user.profile}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleConsult(user)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        Consult
                      </button>
                      <button
                        onClick={() => handleChange(user)}
                        className="text-green-600 hover:text-green-900 mr-2"
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
        </>
      )}
    </div>
  );
}