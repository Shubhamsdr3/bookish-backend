import { Router } from 'express';
import { exchangeController } from '../controllers/exchangeController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/exchange', authMiddleware, exchangeController.createExchange);
// Add other exchange routes here

export default router;