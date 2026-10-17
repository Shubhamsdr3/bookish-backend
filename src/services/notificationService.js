import { subscribeToTopic } from '../fcm/fcmcloud.js';
import { firestoreDB } from '../utils/init.js';
import { NOTIFICATION_COLLECTION } from '../utils/constants.js';

const TOPIC_NAME = /^[A-Za-z0-9\-_.~%]{1,100}$/;

function subscribeOwnToken(fcmToken, topic) {
    return new Promise((resolve, reject) => {
        subscribeToTopic([fcmToken], topic, resolve, reject);
    });
}

export const notificationService = {

    async sendNotification() {
        return {
            isSuccess: false,
            statusCode: 403,
            data: 'Clients cannot send push notifications'
        };
    },

    async sendNotificationTopic() {
        return {
            isSuccess: false,
            statusCode: 403,
            data: 'Clients cannot send topic notifications'
        };
    },

    async subscribeTopic(req) {
        const userId = req.user && req.user.userId;
        const topic = req.params.topic;
        const fcmToken = req.body && req.body.fcmToken;
        if (!userId || typeof fcmToken !== 'string' || fcmToken.length === 0) {
            return {
                isSuccess: false,
                statusCode: 400,
                data: 'fcmToken is required'
            };
        }
        if (!TOPIC_NAME.test(topic)) {
            return {
                isSuccess: false,
                statusCode: 400,
                data: 'Invalid topic'
            };
        }
        try {
            await firestoreDB.collection(NOTIFICATION_COLLECTION).doc(userId).set({
                userId: userId,
                fcmToken: fcmToken
            }, { merge: true });
            await subscribeOwnToken(fcmToken, topic);
            return {
                isSuccess: true,
                statusCode: 200,
                data: 'Subscribed to topic successfully'
            };
        } catch (error) {
            console.error('Topic subscribe failed:', error);
            return {
                isSuccess: false,
                statusCode: 400,
                data: 'Unable to subscribe to topic'
            };
        }
    }
}