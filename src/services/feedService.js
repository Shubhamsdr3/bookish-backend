import { firestoreDB } from '../utils/init.js';
import { POST_COLLECTION } from '../utils/constants.js';

const postCollections = firestoreDB.collection(POST_COLLECTION)

export const feedService = {

    async getFeed() {
        console.log("Getting data for home feed..");
        try {
            const postList = [];
        const snapshot = await postCollections.orderBy('createdAt', 'desc').get();
        snapshot.docs.map(doc => {
            console.log("User data: " + JSON.stringify(doc.data()));
            postList.push(doc.data());
        });
        return {
            isSuccess: true,
            data: postList
        }
    } catch(error) {
        console.log(error);
        return {
                isSuccess: false,
                data: error.meesage
            }
        }
    },

    async getPostDetails(postId) {
        try {
            if(!postId) {
                throw new Error("Invalid postId.");
            } else {
                const snapShot = await postCollections.doc(postId).get();
                console.log("The post " + postId + " details: " + JSON.stringify(snapShot.data()));
                return {
                    isSuccess: true,
                    data: snapShot.data()
                }
            }
        } catch (error) {
            console.log(error);
            return {
                isSuccess: false,
                data: error.message
            }
        }
    }
    
}