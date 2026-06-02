import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { assignmentRoutes } from './routes/assignmentRoutes';
import { startWorker } from './queues/worker';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Global socket.io instance placeholder
let ioInstance: Server | null = null;

// Allow CORS from frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Support larger text base64 files
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rest endpoints
app.use('/api', assignmentRoutes);

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Configure Socket.io
ioInstance = new Server(server, {
  cors: corsOptions,
});

ioInstance.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Socket joins a room identified by the assignmentId to receive specific updates
  socket.on('join:assignment', (assignmentId: string) => {
    console.log(`[Socket.io] Client ${socket.id} joined room: ${assignmentId}`);
    socket.join(assignmentId);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

export function getIO(): Server {
  if (!ioInstance) {
    throw new Error('Socket.io server has not been initialized');
  }
  return ioInstance;
}

// Database Connection & Server Bootstrap
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vedaai';
const port = process.env.PORT || 5000;

console.log(`[Database] Connecting to MongoDB at: ${mongoUri}`);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('[Database] MongoDB connected successfully');
    
    // Start BullMQ Worker
    console.log('[Worker] Launching background worker...');
    startWorker();

    // Start Express listener
    server.listen(port, () => {
      console.log(`[Server] Express server running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('[Database] Connection failure:', err);
    process.exit(1);
  });
