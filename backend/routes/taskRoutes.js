import express from 'express';
import auth from '../middleware/auth.js';
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.post('/', auth, createTask);
router.get('/project/:projectId', auth, getTasksByProject);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, updateTask);
router.patch('/:id/status', auth, updateTaskStatus);
router.delete('/:id', auth, deleteTask);

export default router;
