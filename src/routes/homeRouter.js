import { Router } from 'express';
import { homeController } from '../controllers/homeController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /home/feed:
 *   get:
 *     summary: Get home feed
 *     description: Get home feed
 *     responses:
 *       200:
 *         description: Home feed
 */
router.get('/home/feed', verifyToken, homeController.getHomeFeed);

/**
 * @swagger
 * /home/feed/details?id={id}:
 *   get:
 *     summary: Get post details
 *     description: Get details of a post
 *     responses:
 *       200:
 *         description: Post details
 */
router.get('/home/feed/details', verifyToken, homeController.getPostDetails);
// Add other home routes here

export default router;