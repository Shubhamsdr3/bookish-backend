import { firestoreDB } from '../utils/init.js';
import { READER_COLLECTION, FEEDBACK_COLLECTION } from '../utils/constants.js';

const userCollection = firestoreDB.collection(READER_COLLECTION);
const feedbackCollection = firestoreDB.collection(FEEDBACK_COLLECTION);

export const userService = {
    async getUserById(userId) {
        try {
            console.log("Getting info for user: " + userId);
            if (!userId) {
                throw new Error("User ID not valid");
            }

            const userDoc = await userCollection.doc(userId).get();
            
            if (!userDoc.exists) {
                throw new Error("User not found");
            }

            return {
                isSuccess: true,
                data: userDoc.data()
            };
        } catch (error) {
            console.error("Error getting user:", error);
            return {
                isSuccess: false,
                message: error.message
            };
        }
    },

    async loginUser(userData) {
        try {
            const userDoc = userCollection.doc();
            const newUser = {
                userId: userDoc.id,
                userName: userData.userName,
                name: userData.name,
                profileIcon: userData.profileIcon || '',
                connections: userData.connections || [],
                createdAt: Date.now(),
                privacy: userData.privacy || 'public',
                phoneNumber: userData.phoneNumber,
                readingStatus: userData.userStatus || 'active'
            };

            await userDoc.set(newUser);
            
            return {
                isSuccess: true,
                data: newUser
            };
        } catch (error) {
            console.error("Error creating user:", error);
            return {
                isSuccess: false,
                message: error.message
            };
        }
    },

    async updateUser(updateData) {
        try {
            const userId = updateData['userId'];
            if (!userId) {
                throw new Error("User ID not valid");
            }

            await userCollection.doc(userId).set(updateData, { merge: true });
            const updatedDoc = await userCollection.doc(userId).get();

            return {
                isSuccess: true,
                data: updatedDoc.data()
            };
        } catch (error) {
            console.error("Error updating user:", error);
            return {
                isSuccess: false,
                message: error.message
            };
        }
    },

    async addFeedback(feedbackData) {
        try {
            const feedbackDocRef = feedbackCollection.doc();
            await feedbackDocRef.set(feedbackData);
            const snapshot = await feedbackCollection.doc(feedbackDocRef.id).get();
            console.log(snapshot.data());
            return {
                isSuccess: true,
                data: snapshot.data()
            };
        } catch (error) {
            console.error("Error adding feedback:", error);
            return {
                isSuccess: false,
                message: error.message
            };
        }
    }
};