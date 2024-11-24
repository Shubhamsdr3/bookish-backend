const e = require('express');
const express = require('express');
const exchangeRouter = express.Router();
const firestoreDB = require('../init');
const { CHAT_USERS_COLLECTION, CHAT_CHANNEL_COLLECTION, CHATS_COLLECTION, FRIENDS_COLLECTION, READER_COLLECTION } = require('../utils/constants');

const chatUserCollection = firestoreDB.collection(CHAT_USERS_COLLECTION);
const chatChannelCollection = firestoreDB.collection(CHAT_CHANNEL_COLLECTION);
const readerCollection = firestoreDB.collection(READER_COLLECTION)

// send quote
exchangeRouter.post('/exchange/sendQuote', async function(req, res) {
    const reqestBody = req.body;
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Charset", "utf-8") 
    if(!reqestBody) {
        res.status(200).json({"isSuccess": false, "data": "Error in sending quote."})
    } else {
        try {
            console.log("Quote info: " + reqestBody.userId)
            const docRef = chatChannelCollection.doc();
            const channelId = docRef.id;
            await docRef.collection(CHATS_COLLECTION).add(reqestBody); // add message
            // he is my friend.
            const currentUserChatInfo = { 
                "channelId": channelId,
                "friendId":  reqestBody['friendId'],
                'updatedAt': Date.now()
            }
            const currentUserId = reqestBody['userId'];
            chatUserCollection.doc(currentUserId).collection(FRIENDS_COLLECTION).add(currentUserChatInfo);
            // I'am his friend.
            const friendUserChatInfo = { 
                "channelId": channelId,
                "friendId":  currentUserId,
                'updatedAt': Date.now()
            }
            chatUserCollection.doc(reqestBody['friendId']).collection(FRIENDS_COLLECTION).add(friendUserChatInfo);
            // const channelSnapshot = await chatChannelCollection.doc(channelId).collection(CHATS_COLLECTION).doc(chatDocRef).get();
            const responseBody = Object.assign(
                reqestBody, {
                    'channelId': channelId
                }
            )
            res.status(200).json({"isSuccess": true, "data": responseBody})
        } catch(err) {
            res.status(200).json({"isSuccess": false, "data": err.message})
        }   
    }
})

// get chat users.
exchangeRouter.get('/exchange/friends/:userId', async function(req, res) {
    const currentUserId = req.params.userId;
    console.log("Getting friends for user: " + currentUserId);
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Charset", "utf-8")
    if(!currentUserId) {
        res.status(200).json({"isSuccess": false, "message": "Not a valid userId"});
    } else {
        try {
            const friendUsers = [];
            const snapShot = await chatUserCollection.doc(currentUserId).collection(FRIENDS_COLLECTION).orderBy('updatedAt', 'desc').get();
            await Promise.all(
                snapShot.docs.map(async (doc) => {
                    console.log("Document info: " + JSON.stringify(doc.data()));
                    const freind = doc.data();
                    console.log("Friend id: " + freind.friendId)
                    const freindUserSnapshot = await readerCollection.doc(freind.friendId).get();
                    const currentUserSnapShot = await readerCollection.doc(currentUserId).get();
                    const jsonResponse = JSON.stringify(freindUserSnapshot.data());
                    console.log("Friend detail " + jsonResponse)
                    friendUsers.push({
                        'friend': freindUserSnapshot.data(),
                        // 'currentUser': currentUserSnapShot.data(),
                        'channelId': freind.channelId,
                        'updatedAt': freind.updatedAt
                    });
                })
            )
            res.status(200).json({"isSuccess": false, "data": friendUsers});
        } catch(err) {
            console.log(err);
            res.status(200).json({"isSuccess": false, "message": err.message});
        }
    }
})


module.exports = exchangeRouter;