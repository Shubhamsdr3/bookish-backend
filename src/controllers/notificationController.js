import { notificationService } from '../services/notificationService.js';

export const notificationController = {
    async sendNotification(req, res) {
        const response = await notificationService.sendNotification();
        return res.status(response.statusCode).json(response);
    },

    async sendNotificationTopic(req, res) {
        const response = await notificationService.sendNotificationTopic();
        return res.status(response.statusCode).json(response);
    },

    async subscribeTopic(req, res) {
        try {
            const response = await notificationService.subscribeTopic(req);
            return res.status(response.statusCode).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}