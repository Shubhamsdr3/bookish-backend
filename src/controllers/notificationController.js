export const notificationController = {
    async getNotifications(req, res) {
        return res.status(200).json({ message: 'Notifications fetched successfully' });
    }
}