import { feedService } from '../services/feedService.js';

export const homeController = {

    async getHomeFeed(req, res) {
        try {
            const feedData = await feedService.getFeed(req, res);
            res.status(200).json(feedData);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async getPostDetails(req, res) {
        try {
            const postDetails = await feedService.getPostDetails(req.query.id);
            res.status(200).json(postDetails);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }   
}