import { notificationService } from '../services/notificationService.js';

export const notificationController = {
    async sendNotification(req, res) {
        try {
            const response = await notificationService.sendNotification(req);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async sendNotificationTopic(req, res) {
      try {
        const response = await notificationService.sendNotificationTopic(req);
        res.status(200).json(response);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    },

    async subscribeTopic(req, res) {
        try {   
            const response = await notificationService.subscribeTopic(req);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}