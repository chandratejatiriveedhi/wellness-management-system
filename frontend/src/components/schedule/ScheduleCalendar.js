import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ScheduleCalendar() {
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const start = new Date(selectedDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(selectedDate);
        end.setHours(23, 59, 59, 999);

        const response = await axios.get(`/api/schedules/range`, {
          params: {
            start: start.toISOString(),
            end: end.toISOString()
          }
        });
        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, [selectedDate]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Schedule</h2>
      <div className="grid gap-4">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {schedule.activity.name}
              </h3>
              <span className="text-gray-600">
                {new Date(schedule.scheduleDateTime).toLocaleTimeString()}
              </span>
            </div>
            <p>Teacher: {schedule.teacher.username}</p>
            <p>Student: {schedule.student.username}</p>
            <p className={schedule.attended ? 'text-green-600' : 'text-red-600'}>
              {schedule.attended ? 'Attended' : 'Not Attended'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}