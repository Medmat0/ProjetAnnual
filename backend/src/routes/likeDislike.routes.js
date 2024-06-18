import express from 'express';
const router = express.Router();

import { authMiddleware } from '../middleware/auth.middleware.js';
import { likeOrUnLike } from '../controllers/like/likeDislike.js';

router.post("/:pId", authMiddleware, likeOrUnLike);

export default router;