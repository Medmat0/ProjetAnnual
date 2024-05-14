import express from 'express';
const router = express.Router();
import {createPost , getUserPosts ,getUniqueUserPosts} from '../controllers/posts/post.index.js'; 
import { uploadMultiPhotos } from '../utils/imageUploads.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

router.post('/createPost',authMiddleware,uploadMultiPhotos, createPost);
router.get('/myposts',authMiddleware, getUserPosts);
router.get('/posts/:userId',authMiddleware, getUniqueUserPosts);


export default router;