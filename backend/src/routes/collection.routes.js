import express from 'express';
import { addToCollection, getCollections, deleteCollection } from '../controllers/collection/collection.index.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addToCollection);
router.get('/all', authMiddleware, getCollections);
router.delete('/:collectionId', authMiddleware, deleteCollection);

export default router;


