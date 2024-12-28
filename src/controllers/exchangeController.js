export const exchangeController = {
    async createExchange(req, res) {
        return res.status(200).json({ message: 'Exchange created successfully' });
    }
}