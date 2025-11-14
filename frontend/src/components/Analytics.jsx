import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Analytics.css';

const Analytics = ({ analytics }) => {
  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  const statusData = Object.entries(analytics.statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const priorityData = Object.entries(analytics.priorityCounts).map(([priority, count]) => ({
    name: priority,
    value: count,
  }));

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

  return (
    <div className="analytics-container">
      <div className="analytics-summary">
        <div className="summary-card">
          <h4>Total Tasks</h4>
          <p className="value">{analytics.totalTasks}</p>
        </div>
        <div className="summary-card">
          <h4>Completed</h4>
          <p className="value">{analytics.completedTasks}</p>
        </div>
        <div className="summary-card">
          <h4>In Progress</h4>
          <p className="value">{analytics.inProgressTasks}</p>
        </div>
        <div className="summary-card">
          <h4>Completion Rate</h4>
          <p className="value">{analytics.completionPercentage.toFixed(1)}%</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h4>Tasks by Status</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h4>Tasks by Priority</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="hours-container">
        <div className="hours-card">
          <h4>Estimated Hours</h4>
          <p className="hours-value">{analytics.totalEstimatedHours}h</p>
        </div>
        <div className="hours-card">
          <h4>Actual Hours</h4>
          <p className="hours-value">{analytics.totalActualHours}h</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
