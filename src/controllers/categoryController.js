import { categoryService } from '../services/categoryService.js';

export const categoryController = {
    async getCategories(req, res) {
        try {
            const response = await categoryService.getCategories();
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async subscribeToTopic(req, res) {
        try {
            const response = await categoryService.subscribeToTopic(req);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}