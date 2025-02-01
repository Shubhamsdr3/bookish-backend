import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import { logout } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, userController.register);
router.post('/login', authLimiter, userController.login);
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.post('/feedback', verifyToken, userController.addFeedback);
router.post('/logout', logout, userController.logout);
export default router;
