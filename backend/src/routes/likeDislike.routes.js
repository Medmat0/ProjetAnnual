import express from 'express';
const router = express.Router();

import { authMiddleware } from '../middleware/auth.middleware.js';
import { likeOrUnLike } from '../controllers/like/likeDislike.js';
import {likeOrUnLikeProgramPost} from '../controllers/likeProgram/likeProgram.index.js';


router.post("/:pId", authMiddleware, likeOrUnLike);
router.post("/programpost/:pId", authMiddleware, likeOrUnLikeProgramPost);

export default router;