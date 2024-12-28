import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/book/topics', categoryController.getCategories);

router.get('/book/topics/subscribe/:userId', categoryController.subscribeToTopic);
// Add other category routes here

export default router;