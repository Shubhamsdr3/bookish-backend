import { firestoreDB } from '../utils/init.js';
import { POST_COLLECTION } from '../utils/constants.js';

const postCollections = firestoreDB.collection(POST_COLLECTION)

export const feedService = {

    async getFeed(page = 1, limit = 10) {
        console.log(`Getting data for home feed.. Page: ${page}, Limit: ${limit}`);
        try {
            // Calculate skip
            const offset = (page - 1) * limit;
            
            // Get total count
            const totalSnapshot = await postCollections.count().get();
            const total = totalSnapshot.data().count;

            // Get paginated data
            const snapshot = await postCollections
                .orderBy('createdAt', 'desc')
                .offset(offset)
                .limit(limit)
                .get();

            const postList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return {
                isSuccess: true,
                data: postList,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalPosts: total,
                hasNextPage: offset + postList.length < total,
                hasPrevPage: page > 1
            };
        } catch(error) {
            console.log(error);
            return {
                isSuccess: false,
                data: error.message
            };
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