import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const getProjectAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId });
    const project = await Project.findById(projectId);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
    const pendingTasks = tasks.filter((t) => t.status === 'todo').length;

    const totalEstimatedHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const totalActualHours = tasks.reduce((sum, t) => sum + t.actualHours, 0);

    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const priorityCounts = {
      low: tasks.filter((t) => t.priority === 'low').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      high: tasks.filter((t) => t.priority === 'high').length,
      urgent: tasks.filter((t) => t.priority === 'urgent').length,
    };

    const statusCounts = {
      todo: pendingTasks,
      'in-progress': inProgressTasks,
      review: tasks.filter((t) => t.status === 'review').length,
      done: completedTasks,
    };

    res.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionPercentage,
      totalEstimatedHours,
      totalActualHours,
      priorityCounts,
      statusCounts,
      project: project ? { name: project.name, status: project.status } : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
