import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import bookRoutes from './src/routes/bookrouter.js';
import userRoutes from './src/routes/userrouter.js';
import homeFeedRoutes from './src/routes/homerouter.js';
import postRoutes from './src/routes/createpost.js';
import exchangeRoutes from './src/routes/bookexchange.js';
import notificationRoutes from './src/routes/notificationroute.js';
import categoryRoutes from './src/routes/categoryrouter.js';

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
app.use('/api/bookish', [
    userRoutes,
    homeFeedRoutes,
    postRoutes,
    bookRoutes,
    exchangeRoutes,
    notificationRoutes,
    categoryRoutes
]);
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

// Database connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to Database');
}).catch((err) => {
    console.error('Database connection error:', err);
});

// HTTP Server
const PORT = process.env.PORT || 3000;
const httpServer = app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});

// WebSocket Server
const SOCKET_PORT = 1337;
const wsServer = app.listen(SOCKET_PORT, () => {
    console.log(`WebSocket Server running on port ${SOCKET_PORT}`);
});

const io = new Server(wsServer);

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);
    socket.emit('notification', 'Thanks for connecting to Bookish!');
});

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;