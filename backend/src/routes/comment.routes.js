import express from 'express';
const router = express.Router();

import { authMiddleware } from '../middleware/auth.middleware.js';
import { createComment , getAllCommentsOnAPost , updateComment , addReplyToComment,deleteComment } from '../controller/comments/comment.index.js';

router.post("/:pId", authMiddleware, createComment);
router.get("/comments/:pId", authMiddleware, getAllCommentsOnAPost);
router.put("/:commentId", authMiddleware, updateComment);
router.post("/reply/:commentId", authMiddleware, addReplyToComment);
router.delete("/:commentId", authMiddleware, deleteComment);



export default router;