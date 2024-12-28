export const authMiddleware = (req, res, next) => {
    res.status(200).json({ message: 'Authentication successful' });
}