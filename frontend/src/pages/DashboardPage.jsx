import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as projectService from '../services/projectService';
import ProjectForm from '../components/ProjectForm';
import './DashboardPage.css';

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (formData) => {
    try {
      await projectService.createProject(formData);
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(projectId);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>My Projects</h2>
        <button onClick={() => setShowForm(!showForm)} className="add-project-btn">
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && <ProjectForm onSubmit={handleCreateProject} loading={loading} />}

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="empty-state">No projects yet. Create your first project!</div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>{project.name}</h3>
              <p className="description">{project.description}</p>
              <div className="project-meta">
                <span className={`status ${project.status}`}>{project.status}</span>
                <span className={`priority ${project.priority}`}>{project.priority}</span>
              </div>
              <div className="project-dates">
                <small>
                  {new Date(project.startDate).toLocaleDateString()} -{' '}
                  {new Date(project.endDate).toLocaleDateString()}
                </small>
              </div>
              <div className="project-actions">
                <button
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="view-btn"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
