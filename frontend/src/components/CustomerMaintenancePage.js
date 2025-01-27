import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CustomerMaintenancePage() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [mode, setMode] = useState('list'); // list, add, change, consult
  const [error, setError] = useState('');
  
  // State for form data
  const [formData, setFormData] = useState({
    customerName: '',
    industry: ''
  });

  // State for filters
  const [filters, setFilters] = useState({
    customerName: '',
    industry: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCustomers(response.data);
    } catch (err) {
      setError('Error loading customers');
      console.error('Error:', err);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('http://localhost:8080/api/customers', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await fetchCustomers();
      setMode('list');
      resetForm();
    } catch (err) {
      setError('Error adding customer');
      console.error('Error:', err);
    }
  };

  const handleChange = async () => {
    try {
      await axios.put(`http://localhost:8080/api/customers/${selectedCustomer.id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await fetchCustomers();
      setMode('list');
      resetForm();
    } catch (err) {
      setError('Error updating customer');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:8080/api/customers/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        await fetchCustomers();
      } catch (err) {
        setError('Error deleting customer');
        console.error('Error:', err);
      }
    }
  };

  const handleConsult = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      customerName: customer.customerName,
      industry: customer.industry
    });
    setMode('consult');
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      industry: ''
    });
    setSelectedCustomer(null);
  };

  const handleSearch = () => {
    const filtered = customers.filter(customer => {
      const matchName = !filters.customerName || 
                      customer.customerName.toLowerCase().includes(filters.customerName.toLowerCase());
      const matchIndustry = !filters.industry || 
                          customer.industry.toLowerCase().includes(filters.industry.toLowerCase());
      return matchName && matchIndustry;
    });
    setCustomers(filtered);
  };

  const renderSearchFilters2 = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6" role="search">
      <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="filter-customer" className="block text-sm font-medium mb-1">
            Customer
          </label>
          <input
            id="filter-customer"
            name="filter-customer"
            type="text"
            value={filters.customerName}
            onChange={(e) => setFilters({...filters, customerName: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Search by customer name"
          />
        </div>
        <div>
          <label htmlFor="filter-industry" className="block text-sm font-medium mb-1">
            Industry
          </label>
          <input
            id="filter-industry"
            name="filter-industry"
            type="text"
            value={filters.industry}
            onChange={(e) => setFilters({...filters, industry: e.target.value})}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Search by industry"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          aria-label="Search customers"
        >
          Search
        </button>
      </div>
    </div>
  );

  const renderCustomerForm = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {mode === 'add' ? 'Add Customer' : mode === 'change' ? 'Edit Customer' : 'View Customer'}
      </h2>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === 'add') handleAdd();
          else if (mode === 'change') handleChange();
        }}
        aria-label={`${mode === 'add' ? 'Add' : mode === 'change' ? 'Edit' : 'View'} customer form`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customer-name" className="block text-sm font-medium mb-1">
              Customer Name
            </label>
            <input
              id="customer-name"
              name="customerName"
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
              readOnly={mode === 'consult'}
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium mb-1">
              Industry
            </label>
            <input
              id="industry"
              name="industry"
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              required
              readOnly={mode === 'consult'}
              aria-required="true"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          {mode !== 'consult' && (
            <>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                aria-label={mode === 'add' ? 'Add Customer' : 'Save Changes'}
              >
                {mode === 'add' ? 'Add Customer' : 'Save Changes'}
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

  const renderCustomerList = () => (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Customers</h2>
        <button
          onClick={() => {
            setMode('add');
            resetForm();
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          aria-label="Add new customer"
        >
          Add Customer
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full" role="grid" aria-label="Customers list">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap">{customer.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.industry}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleConsult(customer)}
                    className="text-blue-600 hover:text-blue-900"
                    aria-label={`Consult customer ${customer.customerName}`}
                  >
                    Consult
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setFormData({
                        customerName: customer.customerName,
                        industry: customer.industry
                      });
                      setMode('change');
                    }}
                    className="text-yellow-600 hover:text-yellow-900"
                    aria-label={`Change customer ${customer.customerName}`}
                  >
                    Change
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label={`Delete customer ${customer.customerName}`}
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      
      {mode === 'list' && renderSearchFilters2()}
      {(mode === 'add' || mode === 'change' || mode === 'consult') && renderCustomerForm()}
      {mode === 'list' && renderCustomerList()}
    </div>
  );
}