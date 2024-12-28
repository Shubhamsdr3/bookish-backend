import { Router } from 'express';
import { exchangeController } from '../controllers/exchangeController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/exchange/sendQuote', exchangeController.sendQuote);
router.post('/exchange/friends/:userId', exchangeController.getExchangeFriends);
// Add other exchange routes here

export default router;