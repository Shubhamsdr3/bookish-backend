import { firebaseDB } from '../utils/init.js';

class TokenService {
    static async storeToken(userId, token) {
        try {
            await firebaseDB.collection('tokens').doc(userId).set({
                userId: userId,
                token,
                createdAt: new Date().now(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            });
        } catch (error) {
            console.error('Token storage error:', error);
            throw error;
        }
    }

    static async getToken(userId) {
        try {
            const tokenDoc = await firebaseDB.collection('tokens')
                .doc(userId)
                .get();
            return tokenDoc.exists ? tokenDoc.data() : null;
        } catch (error) {
            console.error('Token retrieval error:', error);
            throw error;
        }
    }

    static async revokeToken(userId) {
        try {
            await firebaseDB.collection('tokens').doc(userId).delete();
        } catch (error) {
            console.error('Token revocation error:', error);
            throw error;
        }
    }
}

export default TokenService;