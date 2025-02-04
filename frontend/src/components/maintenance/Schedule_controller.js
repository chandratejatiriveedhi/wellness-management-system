import React, { useState, useEffect } from "react";

const ScheduleController = () => {
  const [schedules, setSchedules] = useState([]);
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    activityId: "",
    userId: "default", // Default user ID if not selected
    notes: "",
    role: "STUDENT", // Default role if not set
  });

  useEffect(() => {
    fetchSchedules();
    fetchActivities();
    fetchUsers(); // Fetch users for selection

    // Fetch role from token inside useEffect
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        console.log("Decoded Token Payload:", payload); // Debugging

        setFormData((prev) => ({
          ...prev,
          role: payload.role || "STUDENT", // Default to STUDENT if role is missing
        }));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/schedules", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch schedules");

      setSchedules(await response.json());
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/activities", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch activities");

      setActivities(await response.json());
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("Users Fetched from Backend:", data); // Debugging

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data Before Submission:", formData); // Debugging

    // Convert activityId to a number before searching
    const selectedActivity = activities.find(
      (activity) => activity.id === Number(formData.activityId)
    );

    console.log("Selected Activity:", selectedActivity); // Debugging

    if (!selectedActivity) {
      alert("Invalid activity selection! Please select a valid activity.");
      return;
    }

    // Ensure userId is always set (use "default" if empty)
    const selectedUserId =
      formData.userId && formData.userId !== "" ? formData.userId : "default";

    // Ensure role is always set (use "STUDENT" as default)
    const selectedRole =
      formData.role && formData.role !== "" ? formData.role : "STUDENT";

    const payload = {
      date: formData.date,
      activity: { id: selectedActivity.id }, // Send only `id`
      notes: formData.notes,
      userId: selectedUserId,
      role: selectedRole, // Ensure role is included
    };

    console.log("Payload Being Sent:", JSON.stringify(payload)); // Debugging

    try {
      const response = await fetch("http://localhost:8080/api/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Failed to create schedule: " + errorText);
        return;
      }

      fetchSchedules();
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Schedule Control</h1>

      <form onSubmit={handleFormSubmit}>
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <label>Activity:</label>
        <select
          name="activityId"
          value={formData.activityId}
          onChange={(e) =>
            setFormData({ ...formData, activityId: Number(e.target.value) })
          }
          required
        >
          <option value="">Select an Activity</option>
          {activities.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.name}
            </option>
          ))}
        </select>

        <label>User:</label>
        <select
          name="userId"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          required
        >
          <option value="default">Default</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.role})
              </option>
            ))
          ) : (
            <option disabled>Loading users...</option>
          )}
        </select>

        <label>Notes:</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
        />

        <button type="submit">Create Schedule</button>
      </form>

      <h2>Scheduled Activities</h2>
      <ul>
        {schedules.map((schedule) => (
          <li key={schedule.id}>
            {schedule.date} - {schedule.activity.name} (User: {schedule.userId})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleController;
