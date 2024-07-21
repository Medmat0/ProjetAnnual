import express from 'express';
const router = express.Router();
import {createPost, currentUserDeletePost , getUserPosts ,getUniqueUserPosts} from '../controllers/posts/post.index.js'; 
import { authMiddleware } from '../middleware/auth.middleware.js';

router.post('/createPost',authMiddleware, createPost);
router.get('/myposts',authMiddleware, getUserPosts);
router.get('/posts/:userId',authMiddleware, getUniqueUserPosts);
router.delete('/delete/:postId', authMiddleware, currentUserDeletePost)


export default router;