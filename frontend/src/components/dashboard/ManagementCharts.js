import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

export default function ManagementCharts() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [evaluationData, setEvaluationData] = useState([]);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (periodStart && periodEnd) {
      fetchData();
    }
  }, [periodStart, periodEnd]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [attendanceRes, evaluationRes] = await Promise.all([
        axios.get('/api/analytics/attendance', {
          params: { start: periodStart, end: periodEnd }
        }),
        axios.get('/api/analytics/evaluations', {
          params: { start: periodStart, end: periodEnd }
        })
      ]);

      setAttendanceData(attendanceRes.data);
      setEvaluationData(evaluationRes.data);
    } catch (err) {
      setError('Error fetching analytics data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Management Analytics</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}

      {!loading && !error && (
        <div className="space-y-8">
          {/* Attendance Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Membership/Attendance Trends</h3>
            <div className="h-64">
              <LineChart width={800} height={240} data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="#8884d8" />
                <Line type="monotone" dataKey="membership" stroke="#82ca9d" />
              </LineChart>
            </div>
          </div>

          {/* Pain Evaluation Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pain Evaluation Trends</h3>
            <div className="h-64">
              <BarChart width={800} height={240} data={evaluationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="painLevel" fill="#8884d8" />
                <Bar dataKey="improvement" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}