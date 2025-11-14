import express from 'express';
import auth from '../middleware/auth.js';
import { createComment, getCommentsByTask, deleteComment } from '../controllers/commentController.js';

const router = express.Router();

router.post('/', auth, createComment);
router.get('/task/:taskId', auth, getCommentsByTask);
router.delete('/:id', auth, deleteComment);

export default router;
