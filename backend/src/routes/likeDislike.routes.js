import express from 'express';
const router = express.Router();

import { authMiddleware } from '../middleware/auth.middleware.js';
import { likeOrUnLike } from '../controller/like/like.index.js';

router.post("/:pId", authMiddleware, likeOrUnLike);

export default router;