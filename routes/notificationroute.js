const express = require('express');
const router = express.Router();
const {sendNotification , sendNotificationTopic} = require('../fcm/fcmcloud')
const subscribeTopic = require('../fcm/fcmcloud')
const notification = require('../data/notification');

// send a reminder notification.
router.post('/sendNotification', async function(req, resp) {
    try {
        console.log("Sending notification: " + JSON.stringify(req.body.token));
        notification['token'] = req.body.token;
        notification['title'] = req.body.title
        notification['message'] = req.body.message
        notification['deeplinkUrl'] = req.body.deeplinkUrl
        notification['isRead'] = req.body.isRead
        notification['createdAt'] = req.body.createdAt

        sendNotification(notification, function success(messageId) {
            resp.status(200).json({"is_success": true, "data": {"message": "Notification send succesfully", "messageId": messageId}})
        }, 
        function error(message) {
            resp.status(400).json({"is_success": false, "data": {"message": "Unable to send notification", "error": message}})
        }
    )    
    } catch(err) {
        console.log(err)
        resp.status(400).json({"is_success": false, "data": "Unable to send notification"})
    }
})

router.post('/subscribe/:topic', async function(req, res) {
    const registrationTokens = [];
    const topic = req.params.topic;
    req.body.fcmTokens.forEach(element => {
        registrationTokens.push(element);
    });
    console.log(registrationTokens);
    subscribeTopic(registrationTokens, topic, function onSuccess(messageId) {
        res.status(200).json({"is_success": false, "data": {"message": "Subscribed to topic successfully", "messageId": messageId}})
    },
    function error(message) {
        res.status(400).json({"is_success": false, "data": {"message": "Unable to send notification", "error": message}})
    }
);
})

router.post('/sendNotification/:topic', async function(req, res) {
    try {
        const topic = req.params.topic;
        const notification = {
            'title': req.body.title,
            'message': req.body.message
        }
        sendNotificationTopic(topic, notification, function onSuccess(messageId) {
            res.status(200).json({"is_success": true, "data": {"message": "Notification send succesfully", "messageId": messageId}})
        },
        function onError(error) {
            res.status(400).json({"is_success": false, "data": {"message": "Unable to send notification", "error": error}})
        }
    );
    } catch(err) {
        res.status(400).json({"is_success": false, "data": {"message": "Unable to send notification", "error": error.message}})
    }
})

module.exports = router;