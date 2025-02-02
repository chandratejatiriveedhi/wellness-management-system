import React, { useState } from 'react';
import { validateRequired } from '../../utils/validation';

export default function ActivityForm({ activity, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: activity?.name || '',
    type: activity?.type || '',
    inPerson: activity?.inPerson || false,
    description: activity?.description || ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    console.log('ActivityForm - Starting form submission');
    
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Activity name is required';
    }
    if (!validateRequired(formData.type)) {
      newErrors.type = 'Activity type is required';
    }

    console.log('ActivityForm - Validation errors:', newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('ActivityForm - Submitting formData:', formData);
      onSubmit(formData);
      if (!activity) {  // Only reset if it's a new activity
        setFormData({ name: '', type: '', inPerson: false, description: '' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    console.log(`ActivityForm - Field change: ${name} = ${newValue}`);
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Activity Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Type</option>
            <option value="PILATES">Pilates</option>
            <option value="MASSAGE">Massage</option>
            <option value="NUTRITION">Nutrition</option>
            <option value="YOGA">Yoga</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="inPerson"
            id="inPerson"
            checked={formData.inPerson}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="inPerson" className="ml-2 block text-sm text-gray-700">
            In-Person Activity
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {activity ? 'Update' : 'Save'} Activity
          </button>
        </div>
      </form>
    </div>
  );
}