import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { Server } from 'socket.io';
import bookRoutes from './src/routes/bookRouter.js';
import userRoutes from './src/routes/userRouter.js';
import homeFeedRoutes from './src/routes/homeRouter.js';
import postRoutes from './src/routes/createPost.js';
import exchangeRoutes from './src/routes/bookExchange.js';
import notificationRoutes from './src/routes/notificationRoute.js';
import categoryRoutes from './src/routes/categoryRouter.js';
import { apiLimiter, authLimiter, feedLimiter } from './src/middleware/rateLimiter.js';
import { socketService } from './src/services/socketService.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
    origin: '*', // or your specific domains
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// Routes
app.use('/api/', apiLimiter);

app.use('/api/bookish', [
    userRoutes,
    homeFeedRoutes.use(feedLimiter),
    postRoutes,
    bookRoutes,
    exchangeRoutes,
    notificationRoutes,
    categoryRoutes
]);

// Apply stricter limits to auth routes
app.use('/api/bookish/login', authLimiter);
app.use('/api/bookish/register', authLimiter);

// Test endpoint for headers
app.get('/api/test-auth', (req, res) => {
    console.log('Headers received:', {
        authorization: req.headers.authorization,
        'content-type': req.headers['content-type'],
        origin: req.headers.origin
    });
    
    res.json({
        message: 'Headers received',
        headers: req.headers
    });
});

// MongoDB is only used to invalidate logout tokens. Firestore holds the app data.
// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to Database');
// }).catch((err) => {
//     console.error('Database connection error:', err);
// });

// HTTP Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});

// WebSocket Server
const SOCKET_PORT = 1337;
const wsServer = app.listen(SOCKET_PORT, () => {
    console.log(`WebSocket Server running on port ${SOCKET_PORT}`);
});

// Initialize socket service
socketService.initialize(wsServer);

// Example of starting a continuous event emission
// This will emit a 'systemStatus' event every 30 seconds
socketService.startContinuousEmission('systemStatus', 1000, () => ({
    timestamp: new Date().toISOString(),
    status: 'operational',
    activeUsers: socketService.connectedUsers.size
}));

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;