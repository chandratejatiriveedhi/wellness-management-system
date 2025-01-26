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

  // API calls and handler functions remain the same
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

  // Handler functions remain the same
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

  // Other handler functions remain the same...

  // Render functions with accessibility improvements
  const renderSearchFilters = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6" role="search">
      <h3 className="text-lg font-semibold mb-4">Search Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search-username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="search-username"
            type="text"
            value={filters.username}
            onChange={(e) => setFilters({...filters, username: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Search by username"
            aria-label="Search by username"
          />
        </div>
        <div>
          <label htmlFor="search-profile" className="block text-sm font-medium mb-1">
            Profile
          </label>
          <select
            id="search-profile"
            value={filters.profile}
            onChange={(e) => setFilters({...filters, profile: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
            aria-label="Filter by profile"
          >
            <option value="">All Profiles</option>
            <option value="ADMIN">Administrator</option>
            <option value="CLIENT">Client</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>
        <div>
          <label htmlFor="search-location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            id="search-location"
            type="text"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Search by location"
            aria-label="Search by location"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          aria-label="Search users"
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
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === 'add') handleAdd();
          else if (mode === 'change') handleChange();
        }}
        aria-label={`${mode === 'add' ? 'Add' : mode === 'change' ? 'Edit' : 'View'} user form`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
              readOnly={mode === 'consult'}
              aria-required="true"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
              readOnly={mode === 'consult'}
              aria-required="true"
              autoComplete="email"
            />
          </div>
          {mode !== 'consult' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                required={mode === 'add'}
                aria-required={mode === 'add'}
                autoComplete={mode === 'add' ? 'new-password' : 'current-password'}
              />
            </div>
          )}
          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Profile
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
              disabled={mode === 'consult'}
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
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              readOnly={mode === 'consult'}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          {mode !== 'consult' && (
            <>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                aria-label={mode === 'add' ? 'Add User' : 'Save Changes'}
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
                aria-label="Cancel"
              >
                Cancel
              </button>
            </>
          )}
          {mode === 'consult' && (
            <button
              type="button"
              onClick={() => {
                setMode('list');
                resetForm();
              }}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              aria-label="Back to List"
            >
              Back to List
            </button>
          )}
        </div>
      </form>
    </div>
  );

  // Rest of the component remains the same...

  return (
    <div className="p-6">
      {error && (
        <div 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
      
      {mode === 'list' && renderSearchFilters()}
      {(mode === 'add' || mode === 'change' || mode === 'consult') && renderUserForm()}
      {mode === 'list' && renderUserList()}
    </div>
  );
}
