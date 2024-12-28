import 'dotenv/config';
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

export default app;