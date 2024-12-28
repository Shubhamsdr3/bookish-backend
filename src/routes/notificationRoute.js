import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/sendNotification', notificationController.sendNotification);
router.post('/sendNotification/:topic', notificationController.sendNotificationTopic);
router.post('/subscribeTopic/:topic', notificationController.subscribeTopic);

export default router;