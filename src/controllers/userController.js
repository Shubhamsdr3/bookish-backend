import { userService } from '../services/userService.js';

export const userController = {
    async register(req, res) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json({"isSucess": true, "data": user});
        } catch (error) {
            res.status(400).json({ "isSucess": false, "error": error.message });
        }
    },

    async login(req, res) {
        try {
            const result = await userService.loginUser(req.body);
            if (!result.isSuccess) {
                return res.status(401).json({ isSuccess: false, error: result.message });
            }
            return res.status(200).json({ isSuccess: true, data: result.data });
        } catch (error) {
            return res.status(401).json({ isSuccess: false, error: 'Login failed' });
        }
    },

    async getProfile(req, res) {
        try {
            const requestedUserId = req.query.userId || req.user.userId;
            const user = await userService.getUserById(requestedUserId);
            if (!user.isSuccess) {
                return res.status(404).json({ error: user.message });
            }
            if (requestedUserId !== req.user.userId && user.data) {
                delete user.data.phoneNumber;
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    },

    async updateProfile(req, res) {
        try {
            const user = await userService.updateUser(req.user.userId, req.body);
            if (!user.isSuccess) {
                return res.status(400).json({ isSuccess: false, error: user.message });
            }
            return res.status(200).json({ isSuccess: true, data: user.data });
        } catch (error) {
            return res.status(400).json({ isSuccess: false, error: error.message });
        }
    },

    async addFeedback(req, res) {
        try {
            const feedback = await userService.addFeedback(req.body);
            res.status(200).json({"isSuccess": true, "data": feedback});
        } catch (error) {
            res.status(400).json({ "isSuccess": "false", "error": error.message });
        }
    },

    async logout(req, res) {
        try {
            const result = await userService.logoutUser(req.token);
            if (result.isSuccess) {
                res.status(200).json({isSuccess: true,  data: 'Logout successful' });
            } else {
                res.status(400).json({ isSuccess: false, error: result.message });
            }
        } catch (error) {
            res.status(400).json({ isSuccess: false, error: error.message });
        }
    }
}; 