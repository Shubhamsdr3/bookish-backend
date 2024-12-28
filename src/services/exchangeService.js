import { firestoreDB } from '../utils/init.js';
import { CHAT_USERS_COLLECTION, CHAT_CHANNEL_COLLECTION, CHATS_COLLECTION, FRIENDS_COLLECTION, READER_COLLECTION } from '../utils/constants.js';

const chatUserCollection = firestoreDB.collection(CHAT_USERS_COLLECTION);
const chatChannelCollection = firestoreDB.collection(CHAT_CHANNEL_COLLECTION);
const readerCollection = firestoreDB.collection(READER_COLLECTION)

export const exchangeService = {
    async sendQuote(req) {
        const reqestBody = req.body;
        if(!reqestBody) {
            return {
                isSuccess: false,
                data: "Error in sending quote."
            }
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
                return {
                    isSuccess: true,
                    data: responseBody
                }
            } catch(err) {
                return {
                    isSuccess: false,
                    data: err.message
                }
            }   
        }
    },

    async getExchangeFriends(req) {
        const currentUserId = req.params.userId;
        console.log("Getting friends for user: " + currentUserId);
        if(!currentUserId) {
            return {
                isSuccess: false,
                data: "Not a valid userId"
            }
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
                            'currentUser': currentUserSnapShot.data(),
                            'channelId': freind.channelId,
                            'updatedAt': freind.updatedAt
                        });
                    })
                )
                return {
                    isSuccess: true,
                    data: friendUsers
                }
            } catch(err) {
                console.log(err);
                return {
                    isSuccess: false,
                    data: err.message
                }
            }
        }
    }   
}