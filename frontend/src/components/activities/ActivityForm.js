import React, { useState } from 'react';
import { validateRequired } from '../../utils/validation';

export default function ActivityForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    faceToFace: false,
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!validateRequired(formData.name)) {
      newErrors.name = 'Activity name is required';
    }
    if (!validateRequired(formData.type)) {
      newErrors.type = 'Activity type is required';
    }

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({ name: '', type: '', faceToFace: false, description: '' });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Activity Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
          id="faceToFace"
          checked={formData.faceToFace}
          onChange={(e) => setFormData({ ...formData, faceToFace: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="faceToFace" className="ml-2 block text-sm text-gray-700">
          Face-to-face Activity
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows="3"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Save Activity
      </button>
    </form>
  );
}