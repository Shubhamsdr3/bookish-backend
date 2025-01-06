import { Router } from 'express';
import { bookController } from '../controllers/bookController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/book/search', verifyToken, bookController.searchBooks);
router.get('/book', verifyToken, bookController.getBookById);

export default router;