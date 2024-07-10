import express from 'express';
import { createProgramPost , getProgramPosts , saveProgramVersion , getProgramVersions , deleteProgramPost } from '../controllers/programpost/programpost.index.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/createProgramPost', authMiddleware, createProgramPost);
router.get('/programPosts', authMiddleware, getProgramPosts);
router.get('/programVersions/:postId', authMiddleware, getProgramVersions);
router.post('/saveVersion', authMiddleware, saveProgramVersion);
router.delete('/delete/:postId', authMiddleware, deleteProgramPost);

export default router;