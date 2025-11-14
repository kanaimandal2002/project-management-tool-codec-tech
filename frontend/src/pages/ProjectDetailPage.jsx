import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as projectService from '../services/projectService';
import * as taskService from '../services/taskService';
import * as analyticsService from '../services/analyticsService';
import KanbanBoard from '../components/KanbanBoard';
import GanttChart from '../components/GanttChart';
import Analytics from '../components/Analytics';
import './ProjectDetailPage.css';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('kanban');
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    startDate: '',
    dueDate: '',
    estimatedHours: 0,
  });

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, tasksData, analyticsData] = await Promise.all([
        projectService.getProjectById(projectId),
        taskService.getTasksByProject(projectId),
        analyticsService.getProjectAnalytics(projectId),
      ]);

      setProject(projectData);
      setTasks(tasksData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask({
        ...taskFormData,
        project: projectId,
      });
      setShowTaskForm(false);
      setTaskFormData({
        title: '',
        description: '',
        priority: 'medium',
        startDate: '',
        dueDate: '',
        estimatedHours: 0,
      });
      fetchProjectData();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="project-detail-container">
      <div className="project-header">
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="add-task-btn"
        >
          {showTaskForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>

      {showTaskForm && (
        <form className="task-form" onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Task Title"
            value={taskFormData.title}
            onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Task Description"
            value={taskFormData.description}
            onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
          />
          <input
            type="date"
            value={taskFormData.startDate}
            onChange={(e) => setTaskFormData({ ...taskFormData, startDate: e.target.value })}
          />
          <input
            type="date"
            value={taskFormData.dueDate}
            onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
          />
          <select
            value={taskFormData.priority}
            onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <input
            type="number"
            placeholder="Estimated Hours"
            value={taskFormData.estimatedHours}
            onChange={(e) => setTaskFormData({ ...taskFormData, estimatedHours: Number(e.target.value) })}
          />
          <button type="submit">Create Task</button>
        </form>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'kanban' ? 'active' : ''}`}
          onClick={() => setActiveTab('kanban')}
        >
          Kanban Board
        </button>
        <button
          className={`tab ${activeTab === 'gantt' ? 'active' : ''}`}
          onClick={() => setActiveTab('gantt')}
        >
          Gantt Chart
        </button>
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'kanban' && <KanbanBoard projectId={projectId} tasks={tasks} onTaskUpdate={fetchProjectData} />}
        {activeTab === 'gantt' && (
          <GanttChart tasks={tasks} startDate={project.startDate} endDate={project.endDate} />
        )}
        {activeTab === 'analytics' && <Analytics analytics={analytics} />}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
