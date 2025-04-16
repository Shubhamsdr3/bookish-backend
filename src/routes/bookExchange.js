import { Router } from 'express';
import { exchangeController } from '../controllers/exchangeController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/exchange/sendQuote', verifyToken, exchangeController.sendQuote);
router.get('/exchange/friends', verifyToken, exchangeController.getExchangeFriends);
export default router;