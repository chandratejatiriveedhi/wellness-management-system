import React, { useState } from 'react';
import { validateNumber } from '../../utils/validation';

export default function EnhancedEvaluationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    bmi: '',
    bioimpedance: '',
    painLevel: '',
    painLocation: '',
    activity: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateNumber(formData.bmi, 10, 50)) {
      newErrors.bmi = 'BMI must be between 10 and 50';
    }
    if (!validateNumber(formData.bioimpedance, 0, 100)) {
      newErrors.bioimpedance = 'Bioimpedance must be between 0 and 100';
    }
    if (!validateNumber(formData.painLevel, 0, 10)) {
      newErrors.painLevel = 'Pain level must be between 0 and 10';
    }

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
      setFormData({
        bmi: '',
        bioimpedance: '',
        painLevel: '',
        painLocation: '',
        activity: '',
        notes: ''
      });
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Activity</label>
        <select
          value={formData.activity}
          onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Select Activity</option>
          <option value="PILATES">Pilates</option>
          <option value="MASSAGE">Massage</option>
          <option value="NUTRITION">Nutrition</option>
          <option value="YOGA">Yoga</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">BMI</label>
        <input
          type="number"
          step="0.1"
          value={formData.bmi}
          onChange={(e) => setFormData({ ...formData, bmi: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
        {errors.bmi && <p className="text-red-500 text-sm mt-1">{errors.bmi}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Bioimpedance (%)</label>
        <input
          type="number"
          step="0.1"
          value={formData.bioimpedance}
          onChange={(e) => setFormData({ ...formData, bioimpedance: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
        {errors.bioimpedance && <p className="text-red-500 text-sm mt-1">{errors.bioimpedance}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Pain Level (0-10)</label>
        <input
          type="number"
          min="0"
          max="10"
          value={formData.painLevel}
          onChange={(e) => setFormData({ ...formData, painLevel: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
        {errors.painLevel && <p className="text-red-500 text-sm mt-1">{errors.painLevel}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Pain Location</label>
        <input
          type="text"
          value={formData.painLocation}
          onChange={(e) => setFormData({ ...formData, painLocation: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows="3"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Save Evaluation
      </button>
    </form>
  );
}