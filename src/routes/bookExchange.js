import { Router } from 'express';
import { exchangeController } from '../controllers/exchangeController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/exchange/sendQuote', verifyToken, exchangeController.sendQuote);
router.post('/exchange/friends/:userId', verifyToken, exchangeController.getExchangeFriends);
// Add other exchange routes here

export default router;