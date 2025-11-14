import express from 'express';
import auth from '../middleware/auth.js';
import { getProjectAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/project/:projectId', auth, getProjectAnalytics);

export default router;
