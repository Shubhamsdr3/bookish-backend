import { Router } from 'express';
import { userController } from '../controllers/controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

export default router; 