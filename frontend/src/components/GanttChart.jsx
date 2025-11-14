import React, { useState, useMemo } from 'react';
import './GanttChart.css';

const GanttChart = ({ tasks, startDate, endDate }) => {
  const projectStart = new Date(startDate);
  const projectEnd = new Date(endDate);
  const projectDuration = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24));

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => task.startDate && task.dueDate);
  }, [tasks]);

  const calculatePosition = (taskStart) => {
    const taskDate = new Date(taskStart);
    const daysOffset = Math.ceil((taskDate - projectStart) / (1000 * 60 * 60 * 24));
    return (daysOffset / projectDuration) * 100;
  };

  const calculateWidth = (taskStart, taskEnd) => {
    const start = new Date(taskStart);
    const end = new Date(taskEnd);
    const taskDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return (taskDuration / projectDuration) * 100;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="gantt-container">
      <div className="gantt-chart">
        <div className="gantt-header">
          <div className="gantt-labels">Project Timeline</div>
          <div className="gantt-dates">
            <span>{formatDate(projectStart)}</span>
            <span>{formatDate(projectEnd)}</span>
          </div>
        </div>

        <div className="gantt-body">
          {visibleTasks.map((task) => (
            <div key={task._id} className="gantt-row">
              <div className="gantt-task-label">
                <p className="task-title">{task.title}</p>
                <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
              </div>
              <div className="gantt-bar-container">
                <div
                  className={`gantt-bar ${task.priority}`}
                  style={{
                    left: `${calculatePosition(task.startDate)}%`,
                    width: `${calculateWidth(task.startDate, task.dueDate)}%`,
                  }}
                >
                  <span className="bar-label">{task.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
