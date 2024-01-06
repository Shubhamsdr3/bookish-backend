const e = require('express');
const express = require('express');
const router = express.Router();
const notificationData = require('../data/notification');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const {sendNotification, sendNotificationTopic } = require('../fcm/fcmcloud')

const firestoreDB = require('../init');
const { READER_COLLECTION, USER_TOPICS_COLLECTION, TOPICS_COLLECTION, TOPIC_DOC_ID, NON_FICTION_COLLECTION, NOTIFICATION_COLLECTION } = require('../utils/constants');
const { POST_COLLECTION } = require('../utils/constants');
const topicCollection = firestoreDB.collection(TOPICS_COLLECTION)
const postCollection = firestoreDB.collection(POST_COLLECTION)
const readerCollection = firestoreDB.collection(READER_COLLECTION)

// create user
router.post('/createPost', async function(req, resp) {
    const userId = req.body.userId;
    const previousPost = req.body.post;
    resp.setHeader("Content-Type", "application/json")
    resp.setHeader("Charset", "utf-8") 
    if(!userId || !previousPost) {
        resp.status(200).json({"isSuccess": false, "data": "Error in adding doc."})
    } else {
        const userSnapshot = await readerCollection.doc(userId).get();
        const postDocRef = postCollection.doc();
        const userDetail = userSnapshot.data();
        console.log("Reader detail: " + userDetail);
        const postBody = Object.assign(
            previousPost, {
            "postId": postDocRef.id,
          })
        const userPost = {
            "reader": userDetail, 
            "post": postBody, 
            'createdAt': new Date().getTime(), 
            "isLiked": req.body.isLiked,
            "like": {
                "icon": "",
                "text": "Like",
                "count": 0,
                "userIds": []
            },
            "comment": {
                "icon": "",
                "text": "Comment",
                "count": 0,
                "userIds": []
            },
            "share": {
                "icon": "",
                "text": "Like",
                "count": 0,
                "userIds": []
            }
        }
        console.log("Creating post for userid " + userId + ":" + JSON.stringify(userPost));
        postDocRef.set(userPost);
        postDocRef.get().then(async snapShot => {
            console.log("Created post: " + JSON.stringify(snapShot.data()))   
            await sendCreatePostNotification(userDetail, snapShot.data(), postDocRef.id);
            resp.status(200).json({"isSuccess": true, "data": snapShot.data()})
        }).catch(error => {
            console.log(error)
            resp.status(200).json({"isSuccess": false, "data": "Error in adding doc."})
        })
    }
})

async function sendCreatePostNotification(userDetail, postDetails, postId) {
    try {
        const userTopicSnapshot = await firestoreDB.collection(USER_TOPICS_COLLECTION).get();
        userTopicSnapshot.docs.map(async doc => {
            const bookCategory = doc.data()
            console.log("User ids: " + doc.id);
            const fictionList = [bookCategory['fictionList']];
            const nonfictionList = [bookCategory['nonFictionList']];
            const others = [bookCategory['others']]
            console.log("Fiction list: " + fictionList + "\n" + "Non-fiction list: " + nonfictionList + " for user: " + doc.id);
            const bookCategories = postDetails.post['bookCategories'];
            console.log("The book categories: " + bookCategories);
            const topicDocReference = topicCollection.doc(TOPIC_DOC_ID)
            let shouldSendNotification = true;
            //TODO fixme : SHUBHAM send notification only user who has subscribed it.
            bookCategories.forEach(topic => {
                topicDocReference.update("others", FieldValue.arrayUnion(topic));
                // console.log("Topic: " + topic);
                // if(fictionList.includes(topic) || nonfictionList.includes(topic) || others.includes(topic)) {
                //     // shouldSendNotification = true;
                // } else {
                //     topicDocReference.update("others", FieldValue.arrayUnion(topic));
                // }
            });
            console.log("Should send notification ? " + shouldSendNotification +  " for : " + doc.id);
            if(shouldSendNotification && doc.id != postDetails.reader.userId) {
                firestoreDB.collection(NOTIFICATION_COLLECTION)
                .doc(doc.id).get()
                .then((snapShot) => {
                    if(snapShot.exists) {
                        console.log("The notification data: " + JSON.stringify(snapShot.data()));
                        const fcmToken = snapShot.data()['fcmToken']
                        console.log("FCM token: " + fcmToken + " for " + doc.id);
                        const notificationInfo = {
                            'token': fcmToken,
                            'title': userDetail.name + " shared a post",
                            'message': postDetails.post.caption + " : " + postDetails.post.bookName.split(':')[0],
                            'deeplinkUrl': "https://bookissh-web.web.app/post/" + postId,
                            'isRead': "false",
                            'createdAt': ''+ postDetails.createdAt
                        }
                        sendNotification(notificationInfo, function success(messageId) {
                            console.log("Notification sent successfully: " + messageId);
                        }, 
                        function error(message) {
                            console.log("Notification sent failed: " + message);
                        }) 
                    }
                });
            }
        })
    } catch(error) {
        console.log(error);
    }
}



router.delete('/feed/delete/:postId', async function(req, res) {
    const postId = req.params.postId;
    console.log("Deleting post: " + postId);
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Charset", "utf-8") 
    if(!postId) {
        res.status(200).json({"isSuccess": false, "message": "Not a valid postId"});
    } else {
        try {
            await postCollection.doc(postId).delete();
            res.status(200).json({"isSuccess": true, "data": "Post deleted"});
        } catch(error) {
            res.status(200).json({"isSuccess": true, "message": error});
        }
    }
})


module.exports = router