import { Router } from 'express';
import { postController } from '../controllers/postController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/createPost', verifyToken, postController.createPost);

/*

*/
router.delete('/delete/:postId', verifyToken, postController.deletePost);

export default router;