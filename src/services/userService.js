import { firestoreDB } from '../utils/init.js';
import jwt from 'jsonwebtoken';
import Token from '../models/token.js';
import { READER_COLLECTION, FEEDBACK_COLLECTION } from '../utils/constants.js';

const userCollection = firestoreDB.collection(READER_COLLECTION);
const feedbackCollection = firestoreDB.collection(FEEDBACK_COLLECTION);

export const userService = {

    async createUser(userData) {
        try {
            console.log("Creating user:  " + user._id);
            const userDoc = userCollection.doc(user._id);
            const jwtToken = jwt.sign(
                { userId: user._id }, 
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            userData.authToken = jwtToken;
            await userDoc.set({userData}, {merge: true});
            return {
                isSuccess: true,
                data: userDoc.data()
            };
        } catch (error) {
            console.error("Error creating user:", error);
            return {
                isSuccess: false,
                message: error.message
            };
        }
    },

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
            console.log("User Info: " + JSON.stringify(userDoc.data()));
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
            const token = jwt.sign(
                { userId: userDoc.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            console.log("Creating user for: " + userDoc.id);

            const newUser = {
                userId: userDoc.id,
                userName: userData.userName,
                name: userData.name,
                profileIcon: userData.profileIcon || '',
                connections: userData.connections || 0,
                createdAt: Date.now(),
                privacy: userData.privacy || 0,
                phoneNumber: userData.phoneNumber,
                readingStatus: userData.userStatus || 'active',
            };
        
            await userDoc.set(newUser);
            console.log("User Info: " + JSON.stringify(newUser));
            return {
                isSuccess: true,
                data: {
                    "token": token,
                    "user": newUser
                }
            };
        } catch (error) {
            console.error("Error in login:", error);
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
    },

    async logoutUser(token) {
        try {
            // Invalidate current token
            await Token.findOneAndUpdate(
                { token: req.token },
                { isValid: false }
            );
    
            return { 
                isSuccess: true,
                message: 'Logged out successfully' 
            };
        } catch (error) {
            console.error("Error during logout:", error);
            return {
                isSuccess: false,
                message: error.message
            };
        }
    }
};