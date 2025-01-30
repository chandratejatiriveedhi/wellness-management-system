import React, { useState, useEffect } from 'react';

const EvaluationControlPage = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [students, setStudents] = useState([]);
  const [mode, setMode] = useState('list');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ date: '', activity: '' });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    activityId: '',
    studentId: '',
    bmi: '',
    bioimpedance: '',
    painLevel: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
      setUserId(payload.sub);
    }
    fetchActivities();
    fetchStudents();
    fetchEvaluations();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/users/students', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchEvaluations = async () => {
    try {
      let url = '/api/evaluations';
      if (userRole === 'STUDENT') {
        url += `/student/${userId}`;
      }
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEvaluations(data);
      }
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    }
  };

  const handleModeChange = (newMode, evaluation = null) => {
    setMode(newMode);
    setSelectedEvaluation(evaluation);
    if (evaluation) {
      setFormData({
        date: evaluation.date,
        activityId: evaluation.activityId,
        studentId: evaluation.studentId,
        bmi: evaluation.bmi,
        bioimpedance: evaluation.bioimpedance,
        painLevel: evaluation.painLevel,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        activityId: '',
        studentId: userRole === 'STUDENT' ? userId : '',
        bmi: '',
        bioimpedance: '',
        painLevel: '',
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = mode === 'change' 
        ? `/api/evaluations/${selectedEvaluation.id}` 
        : '/api/evaluations';
      const method = mode === 'change' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMode('list');
        fetchEvaluations();
      }
    } catch (error) {
      console.error('Error saving evaluation record:', error);
    }
  };

  const handleDelete = async (evaluationId) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        const response = await fetch(`/api/evaluations/${evaluationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          fetchEvaluations();
        }
      } catch (error) {
        console.error('Error deleting evaluation:', error);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderSearchFilters = () => (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={searchFilters.date}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Activity</label>
          <select
            name="activity"
            value={searchFilters.activity}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Activities</option>
            {activities.map(activity => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderEvaluationForm = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        {mode === 'add' ? 'Add New Evaluation' : mode === 'change' ? 'Edit Evaluation' : 'View Evaluation'}
      </h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            disabled={mode === 'consult'}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Activity *</label>
          <select
            name="activityId"
            value={formData.activityId}
            onChange={(e) => setFormData({ ...formData, activityId: e.target.value })}
            disabled={mode === 'consult'}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
            required
          >
            <option value="">Select Activity</option>
            {activities.map(activity => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>

        {userRole !== 'STUDENT' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              disabled={mode === 'consult'}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
              required
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            onChange={(e) => setFormData({ ...formData, bmi: e.target.value })}
            disabled={mode === 'consult'}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bioimpedance</label>
          <input
            type="number"
            name="bioimpedance"
            value={formData.bioimpedance}
            onChange={(e) => setFormData({ ...formData, bioimpedance: e.target.value })}
            disabled={mode === 'consult'}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pain Level (1-10)</label>
          <input
            type="number"
            name="painLevel"
            value={formData.painLevel}
            onChange={(e) => setFormData({ ...formData, painLevel: e.target.value })}
            disabled={mode === 'consult'}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border-gray-300"
            min="1"
            max="10"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => handleModeChange('list')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </button>
          {mode !== 'consult' && (
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {mode === 'add' ? 'Create' : 'Update'}
            </button>
          )}
        </div>
      </form>
    </div>
  );

  const renderEvaluationList = () => {
    const filteredEvaluations = evaluations.filter(evaluation => {
      const matchesDate = !searchFilters.date || evaluation.date === searchFilters.date;
      const matchesActivity = !searchFilters.activity || evaluation.activityId === searchFilters.activity;
      return matchesDate && matchesActivity;
    });

    return (
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
              {userRole !== 'STUDENT' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bioimpedance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pain Level</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEvaluations.map((evaluation) => (
              <tr key={evaluation.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(evaluation.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {activities.find(a => a.id === evaluation.activityId)?.name}
                </td>
                {userRole !== 'STUDENT' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {students.find(s => s.id === evaluation.studentId)?.name}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  {evaluation.bmi || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {evaluation.bioimpedance || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {evaluation.painLevel !== null ? evaluation.painLevel : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button
                    onClick={() => handleModeChange('consult', evaluation)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  {userRole !== 'STUDENT' && (
                    <>
                      <button
                        onClick={() => handleModeChange('change', evaluation)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(evaluation.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Evaluation Control</h1>
        {mode === 'list' && userRole !== 'STUDENT' && (
          <button
            onClick={() => handleModeChange('add')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Evaluation
          </button>
        )}
      </div>
      {mode === 'list' && renderSearchFilters()}
      {(mode === 'add' || mode === 'change' || mode === 'consult') && renderEvaluationForm()}
      {mode === 'list' && renderEvaluationList()}
    </div>
  );
};

export default EvaluationControlPage;
