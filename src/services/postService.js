import { firestoreDB } from '../utils/init.js';
import { POST_COLLECTION, READER_COLLECTION, TOPICS_COLLECTION, NOTIFICATION_COLLECTION, TOPIC_DOC_ID } from '../utils/constants.js';

const topicCollection = firestoreDB.collection(TOPICS_COLLECTION)
const postCollection = firestoreDB.collection(POST_COLLECTION)
const readerCollection = firestoreDB.collection(READER_COLLECTION)

export const postService = {

    async createPost(req) {
        const userId = req.user && req.user.userId;
        const previousPost = req.body.post;
        if(!userId || !previousPost) {
            return {        
                isSuccess: false,
                data: "Error in adding doc."
            }
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
            try {   
                console.log("Creating post for userid " + userId + ":" + JSON.stringify(userPost));
                postDocRef.set(userPost);
                const snapShot = await postDocRef.get();
            return {
                    isSuccess: true,
                    data: snapShot.data()
                }
            } catch(error) {
                console.log(error);
                return {
                    isSuccess: false,
                    data: "Error in adding doc."
                }
            }
        }
    },

    async deletePost(req) {
        const postId = req.params.postId;
        const userId = req.user && req.user.userId;
        if (!postId || !userId) {
            return {
                isSuccess: false,
                statusCode: 400,
                data: "Not a valid postId"
            };
        }
        try {
            const postDoc = await postCollection.doc(postId).get();
            if (!postDoc.exists) {
                return {
                    isSuccess: false,
                    statusCode: 404,
                    data: "Post not found"
                };
            }
            const reader = postDoc.data().reader || {};
            const ownerId = reader.userId;
            if (ownerId !== userId) {
                return {
                    isSuccess: false,
                    statusCode: 403,
                    data: "You can only delete your own post"
                };
            }
            await postCollection.doc(postId).delete();
            return {
                isSuccess: true,
                statusCode: 200,
                data: "Post deleted"
            };
        } catch (error) {
            return {
                isSuccess: false,
                statusCode: 400,
                data: "Error deleting post"
            };
        }
    },

    async sendCreatePostNotification(userDetail, postDetails, postId) {
        try {
            const userTopicSnapshot = await firestoreDB.collection(USER_TOPICS_COLLECTION).get();
            userTopicSnapshot.docs.map(async doc => {
                const bookCategory = doc.data()
                console.log("User ids: " + doc.id);
                const fictionList = [bookCategory['fictionList']];
                const nonfictionList = [bookCategory['nonFictionList']];
                const others = [bookCategory['others']]
                console.log("Fiction list: " + fictionList + "\n" + "Non-fiction list: " + nonfictionList + " for user: " + doc.id);
                if(postDetails.hasOwnProperty('post') && postDetails.hasOwnProperty('post').hasOwnProperty('bookCategories')) {
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
                }
            })
        } catch(error) {
            console.log(error);
        }
    }
}