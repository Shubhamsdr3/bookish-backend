import { Router } from 'express';
import { postController } from '../controllers/postController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/createPost', postController.createPost);

/*

*/
router.delete('/delete/:postId', postController.deletePost);

export default router;