import { feedService } from '../services/feedService.js';

export const homeController = {

    async getHomeFeed(req, res) {
        try {
            // Access query params with default values
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            console.log(`Page: ${page}, Limit: ${limit}`);
            
            const result = await feedService.getFeed(page, limit);
            
            if (result.isSuccess) {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error) {
            res.status(500).json({
                isSuccess: false,
                error: error.message
            });
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