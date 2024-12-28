import { sendNotification, sendNotificationTopic, subscribeToTopic } from '../fcm/fcmcloud.js';
import { notification } from '../models/notification.js';

export const notificationService = {
    
    async sendNotification(req) {
        try {
            console.log("Sending notification: " + JSON.stringify(req.body.token));
            notification['token'] = req.body.token;
            notification['title'] = req.body.title
            notification['message'] = req.body.message
            notification['deeplinkUrl'] = req.body.deeplinkUrl
            notification['isRead'] = req.body.isRead
            notification['createdAt'] = req.body.createdAt
    
            sendNotification(notification, function success(messageId) {
                return {
                    isSuccess: true,
                    data: {"message": "Notification send succesfully", "messageId": messageId}
                }
            },  
            function error(message) {
                return {
                    isSuccess: false,
                    data: {"message": "Unable to send notification", "error": message}
                }
            }
        )    
        } catch(err) {
            console.log(err)
            return {
                isSuccess: false,
                data: "Unable to send notification"
            }
        }
    },

    async sendNotificationTopic(req) {
        try {
            const topic = req.params.topic;
            const notification = {
                'title': req.body.title,
                'message': req.body.message
            }
            sendNotificationTopic(topic, notification, function onSuccess(messageId) {
                return {
                    isSuccess: true,
                    data: {"message": "Notification send succesfully", "messageId": messageId}
                }
            },
            function onError(error) {
                return {
                    isSuccess: false,
                    data: {"message": "Unable to send notification", "error": error}
                }
            }
        );
        } catch(err) {
            return {
                isSuccess: false,
                data: {"message": "Unable to send notification", "error": err.message}
            }
        }
    },

    async subscribeTopic(req) {
        try {
            const registrationTokens = [];
            const topic = req.params.topic;
            req.body.fcmTokens.forEach(element => {
            registrationTokens.push(element);
        });
        console.log(registrationTokens);
        subscribeToTopic(registrationTokens, topic, function onSuccess(messageId) {
            return {
                isSuccess: true,
                data: {"message": "Subscribed to topic successfully", "messageId": messageId}
            }
        },
        function error(message) {
            console.log(message)
            return {
                isSuccess: false,
                    data: {"message": "Unable to subscribe to topic", "error": message}
                }
            })
        } catch(err) {
            console.log(err)
            return {
                isSuccess: false,
                data: {"message": "Unable to subscribe to topic", "error": err.message}
            }
        }
    }
}