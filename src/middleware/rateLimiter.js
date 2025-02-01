import rateLimit from 'express-rate-limit';

// General API limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        isSuccess: false,
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res, next, options) => {
        console.log(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json(options.message);
    }
});

// Auth endpoints limiter (more strict)
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: {
        isSuccess: false,
        error: 'Too many login attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        console.log(`Auth rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json(options.message);
    }
});

// Feed endpoints limiter
export const feedLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 1, // 1 request per 5 minutes
    message: {
        isSuccess: false,
        error: 'Too many feed requests, please try again later.'
    },
    handler: (req, res, next, options) => {
        console.log(`Feed rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json(options.message);
    }
}); 