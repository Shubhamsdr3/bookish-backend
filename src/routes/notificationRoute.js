import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/sendNotification', verifyToken, notificationController.sendNotification);
router.post('/sendNotification/:topic', verifyToken, notificationController.sendNotificationTopic);
router.post('/subscribeTopic/:topic', verifyToken, notificationController.subscribeTopic);

export default router;