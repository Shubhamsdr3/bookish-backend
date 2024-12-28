import { Router } from 'express';
import { bookController } from '../controllers/bookController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/book/search', bookController.searchBooks);
router.get('/book', bookController.getBookById);

export default router;