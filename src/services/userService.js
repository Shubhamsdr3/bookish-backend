import { firestoreDB } from '../utils/init.js';
import firebaseAdmin from 'firebase-admin';
import jwt from 'jsonwebtoken';
// import Token from '../models/token.js';
import { READER_COLLECTION, FEEDBACK_COLLECTION } from '../utils/constants.js';
import e from 'express';

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
        const verifiedPhone = await this.readVerifiedPhoneNumber(userData.idToken);
        if (!verifiedPhone.isValid) {
            return {
                isSuccess: false,
                message: verifiedPhone.message
            };
        }
        const phoneNumber = verifiedPhone.phoneNumber;
        const userInfo = await this.checkIfUserExists(phoneNumber);
        if (userInfo && userInfo.exists) {
            const userResponse = userInfo.userData;
            userResponse.isNewUser = false;
            const token = jwt.sign(
                { userId: userInfo.userId },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            return {
                isSuccess: true,
                data: {
                    token: token,
                    user: userResponse
                }
            };
        }
        const userDoc = userCollection.doc();
        const token = jwt.sign(
            { userId: userDoc.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        const newUser = {
            userId: userDoc.id,
            userName: userData.userName,
            name: userData.name,
            profileIcon: userData.profileIcon || '',
            connections: userData.connections || 0,
            createdAt: Date.now(),
            privacy: userData.privacy || 0,
            phoneNumber: phoneNumber,
            readingStatus: userData.userStatus || 'active',
            isNewUser: true
        };
        await userDoc.set(newUser);
        return {
            isSuccess: true,
            data: {
                token: token,
                user: newUser
            }
        };
    },

    async readVerifiedPhoneNumber(idToken) {
        if (!idToken) {
            return {
                isValid: false,
                message: 'Firebase ID token is required'
            };
        }
        try {
            const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
            if (!decoded.phone_number) {
                return {
                    isValid: false,
                    message: 'Phone number is missing from the Firebase token'
                };
            }
            return {
                isValid: true,
                phoneNumber: decoded.phone_number
            };
        } catch (error) {
            console.error('Firebase token verification failed:', error);
            return {
                isValid: false,
                message: 'Invalid Firebase token'
            };
        }
    },

    async checkIfUserExists(phoneNumber) {
        try {
            const querySnapshot = await userCollection
                .where('phoneNumber', '==', phoneNumber)
                .get();

            if (querySnapshot.empty) {
                return {
                    exists: false,
                    userData: null
                };
            }

            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            return {
                exists: true,
                userId: userData.userId || userDoc.id,
                userData: userData
            };
        } catch (error) {
            console.error("Error checking if user exists:", error);
            return {
                exists: false,
                userData: null,
                error: error.message
            };
        }
    },

    async updateUser(userId, updateData) {
        try {
            if (!userId) {
                throw new Error("User ID not valid");
            }
            const fields = { ...updateData };
            delete fields.userId;
            delete fields.phoneNumber;
            const payload = { ...fields, userId };

            await userCollection.doc(userId).set(payload, { merge: true });
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
            if (!token) {
                throw new Error('Token is required for logout');
            }
            
            // Invalidate current token
            // await Token.findOneAndUpdate(
            //     { token: req.token },
            //     { isValid: false }
            // );
    
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