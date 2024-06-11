import express from 'express';
import { createProgramPost , getProgramPosts , saveProgramVersion , getProgramVersions } from '../controllers/programpost/programpost.index.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/createProgramPost', authMiddleware, createProgramPost);
router.get('/programPosts', authMiddleware, getProgramPosts);
router.get('/programVersions/:postId', authMiddleware, getProgramVersions);
router.post('/saveVersion', authMiddleware, saveProgramVersion);

export default router;