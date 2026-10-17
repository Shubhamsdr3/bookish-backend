import { postService } from '../services/postService.js';

export const postController = {
    async createPost(req, res) {
        try {
            const response = await postService.createPost(req);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deletePost(req, res) {
        try {
            const response = await postService.deletePost(req);
            return res.status(response.statusCode || 200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}