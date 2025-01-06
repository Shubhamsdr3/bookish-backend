import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';
import { logout } from '../middleware/auth.js';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);
router.post('/feedback', verifyToken, userController.addFeedback);
router.post('/logout', logout, userController.logout);
export default router;
