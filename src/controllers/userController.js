import { userService } from '../services/userService.js';

export const userController = {
    async register(req, res) {
        try {
            const user = await userService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async login(req, res) {
        try {
            const { data } = await userService.loginUser(req.body);
            res.status(200).json(data);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    },

    async getProfile(req, res) {
        try {
            const user = await userService.getUserById(req.query.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    async updateProfile(req, res) {
        try {
            const user = await userService.updateUser(req.body);
            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async addFeedback(req, res) {
        try {
            const feedback = await userService.addFeedback(req.body);
            res.status(200).json(feedback);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}; 