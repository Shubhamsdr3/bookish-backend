import { Server } from 'socket.io';

class SocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map();
    }

    initialize(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket) => {
            console.log(`New connection: ${socket.id}`);

            // Handle user authentication
            socket.on('authenticate', (userId) => {
                this.connectedUsers.set(userId, socket.id);
                console.log(`User ${userId} authenticated`);
                socket.emit('authenticated', { message: 'Successfully authenticated' });
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                const userId = [...this.connectedUsers.entries()]
                    .find(([_, id]) => id === socket.id)?.[0];
                if (userId) {
                    this.connectedUsers.delete(userId);
                    console.log(`User ${userId} disconnected`);
                }
            });

            // Initial connection message
            socket.emit('notification', 'Thanks for connecting to Bookish!');
        });
    }

    // Emit event to a specific user
    emitToUser(userId, event, data) {
        const socketId = this.connectedUsers.get(userId);
        if (socketId) {
            this.io.to(socketId).emit(event, data);
        }
    }

    // Emit event to all connected users
    emitToAll(event, data) {
        this.io.emit(event, data);
    }

    // Emit event to all users except sender
    emitToOthers(senderId, event, data) {
        const senderSocketId = this.connectedUsers.get(senderId);
        if (senderSocketId) {
            socket.broadcast.emit(event, data);
        }
    }

    // Start a continuous event emission
    startContinuousEmission(event, interval, dataGenerator) {
        setInterval(() => {
            const data = typeof dataGenerator === 'function' ? dataGenerator() : dataGenerator;
            this.emitToAll(event, data);
        }, interval);
}
}

export const socketService = new SocketService(); 