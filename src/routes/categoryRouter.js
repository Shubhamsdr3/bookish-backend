import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/book/topics', verifyToken, categoryController.getCategories);

router.get('/book/topics/subscribe/:userId', verifyToken, categoryController.subscribeToTopic);
// Add other category routes here

export default router;