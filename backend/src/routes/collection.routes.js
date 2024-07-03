import express from 'express';
import { addToCollection, getCollections, deleteCollection } from '../controllers/collection/collection.index.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/collection/add', authMiddleware, addToCollection);
router.get('/collections', authMiddleware, getCollections);
router.delete('/collection/:collectionId', authMiddleware, deleteCollection);

export default router;


