import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/notifications', authMiddleware, notificationController.getNotifications);
// Add other notification routes here

export default router;