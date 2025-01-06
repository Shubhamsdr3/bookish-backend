import { exchangeService } from '../services/exchangeService.js';

export const exchangeController = {
    async sendQuote(req, res) {
        try {
            const response = await exchangeService.sendQuote(req);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getExchangeFriends(req, res) {
        try {
            const response = await exchangeService.getExchangeFriends(req);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}