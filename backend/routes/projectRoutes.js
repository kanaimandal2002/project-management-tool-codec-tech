import express from 'express';
import auth from '../middleware/auth.js';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
} from '../controllers/projectController.js';

const router = express.Router();

router.post('/', auth, createProject);
router.get('/', auth, getProjects);
router.get('/:id', auth, getProjectById);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);
router.post('/:id/members', auth, addMember);

export default router;
