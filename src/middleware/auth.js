import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization || req.headers.Authorization;
        
        if (!authHeader) {
            console.log('No auth header found');
            return res.status(401).json({ message: 'No authorization header' });
        }

        // Check if it's Bearer token
        const token = authHeader.startsWith('Bearer ') ? 
            authHeader.slice(7) : authHeader;

        if (!token) {
            console.log('No token found in auth header');
            return res.status(401).json({ message: 'No token found' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);
        
        // Add user info to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};