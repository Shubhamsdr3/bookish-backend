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
            const { data } = await userService.loginUser(req.body);
            res.status(200).json({"isSuccess": true, "data": data});
        } catch (error) {
            res.status(401).json({ "isSuccess": false, "error": error.message });
        }
    },

    async getProfile(req, res) {
        try {
            const user = await userService.getUserById(req.query.userId);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({error : error.message});
        }
    },

    async updateProfile(req, res) {
        try {
            const user = await userService.updateUser(req.body);
            res.status(200).json({"isSuccess": true, "data": user});
        } catch (error) {
            res.status(400).json({ "isSuccess": false,"error": error.message });
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