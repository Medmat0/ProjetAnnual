import express from 'express';
const router = express.Router()


import { authMiddleware } from '../middleware/auth.middleware.js';
import { createPipeline, getPipelines, getPipelineById, updatePipeline, deletePipeline } from '../controllers/pipelines/Pipeline.index.js';

router.post('/create', authMiddleware, createPipeline);
router.get('/', authMiddleware, getPipelines);
router.get('/:id', authMiddleware, getPipelineById);
router.put('/:id', authMiddleware, updatePipeline);
router.delete('/:id', authMiddleware, deletePipeline);

export default router;
