import React, { useState } from 'react';
import axios from 'axios';

export default function EvaluationForm({ studentId, onSubmit }) {
  const [evaluation, setEvaluation] = useState({
    bmi: '',
    bioimpedance: '',
    painLevel: '',
    painLocation: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/evaluations', {
        ...evaluation,
        studentId,
        evaluationDate: new Date().toISOString()
      });
      if (onSubmit) onSubmit(response.data);
      setEvaluation({
        bmi: '',
        bioimpedance: '',
        painLevel: '',
        painLocation: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating evaluation:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">New Evaluation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            BMI
          </label>
          <input
            type="number"
            step="0.1"
            value={evaluation.bmi}
            onChange={(e) => setEvaluation({ ...evaluation, bmi: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bioimpedance
          </label>
          <input
            type="number"
            step="0.1"
            value={evaluation.bioimpedance}
            onChange={(e) => setEvaluation({ ...evaluation, bioimpedance: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pain Level (0-10)
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={evaluation.painLevel}
            onChange={(e) => setEvaluation({ ...evaluation, painLevel: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pain Location
          </label>
          <input
            type="text"
            value={evaluation.painLocation}
            onChange={(e) => setEvaluation({ ...evaluation, painLocation: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            value={evaluation.notes}
            onChange={(e) => setEvaluation({ ...evaluation, notes: e.target.value })}
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
    </div>
  );
}