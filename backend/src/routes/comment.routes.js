import express from 'express';
const router = express.Router();

import { authMiddleware } from '../middleware/auth.middleware.js';
import { createComment , getAllCommentsOnAPost , updateComment , addReplyToComment,deleteComment } from '../controllers/comments/comment.index.js';
import {createProgramPostComment} from '../controllers/commentsProgram/postcomment.index.js';

router.post("/:pId", authMiddleware, createComment);
router.get("/comments/:pId", authMiddleware, getAllCommentsOnAPost);
router.put("/:commentId", authMiddleware, updateComment);
router.post("/reply/:commentId", authMiddleware, addReplyToComment);
router.delete("/:commentId", authMiddleware, deleteComment);
router.post("/programpost/:pId", authMiddleware, createProgramPostComment);




export default router;