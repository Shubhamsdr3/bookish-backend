import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/categories', authMiddleware, categoryController.getCategories);
// Add other category routes here

export default router;