require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// Import routes
const authRoutes = require('./routes/auth');
const bloodRequestRoutes = require('./routes/bloodRequests');
const messageRoutes = require('./routes/messages');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { securityHeaders } = require('./middleware/security');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(securityHeaders);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/messages', messageRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HemoLink API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      bloodRequests: '/api/blood-requests',
      messages: '/api/messages'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HemoLink API is running'
  });
});

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);

  // Join user's personal room for direct messages
  socket.join(`user_${socket.userId}`);

  /**
   * Join a blood request room for real-time updates
   */
  socket.on('join_request', (requestId) => {
    socket.join(`request_${requestId}`);
    console.log(`User ${socket.userId} joined request room: ${requestId}`);
  });

  /**
   * Leave a blood request room
   */
  socket.on('leave_request', (requestId) => {
    socket.leave(`request_${requestId}`);
    console.log(`User ${socket.userId} left request room: ${requestId}`);
  });

  /**
   * Send a message in real-time
   */
  socket.on('send_message', async (data) => {
    try {
      const { recipient, bloodRequest, content } = data;

      // Emit message to recipient's personal room
      io.to(`user_${recipient}`).emit('receive_message', {
        sender: socket.userId,
        recipient,
        bloodRequest,
        content,
        timestamp: new Date()
      });

      // Also emit to sender for confirmation
      socket.emit('message_sent', {
        sender: socket.userId,
        recipient,
        bloodRequest,
        content,
        timestamp: new Date()
      });
    } catch (error) {
      socket.emit('message_error', { error: error.message });
    }
  });

  /**
   * Notify when someone expresses interest in a request
   */
  socket.on('interest_expressed', (data) => {
    const { requestId, recipientId, donorId } = data;
    
    // Notify the recipient
    io.to(`user_${recipientId}`).emit('new_interest', {
      requestId,
      donorId,
      timestamp: new Date()
    });
  });

  /**
   * Notify when request status changes
   */
  socket.on('request_status_changed', (data) => {
    const { requestId, status } = data;
    
    // Notify all users in the request room
    io.to(`request_${requestId}`).emit('status_update', {
      requestId,
      status,
      timestamp: new Date()
    });
  });

  /**
   * Typing indicator
   */
  socket.on('typing', (data) => {
    const { recipient, bloodRequest } = data;
    io.to(`user_${recipient}`).emit('user_typing', {
      sender: socket.userId,
      bloodRequest
    });
  });

  /**
   * Stop typing indicator
   */
  socket.on('stop_typing', (data) => {
    const { recipient, bloodRequest } = data;
    io.to(`user_${recipient}`).emit('user_stop_typing', {
      sender: socket.userId,
      bloodRequest
    });
  });

  /**
   * Handle disconnection
   */
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  await connectDB();
  server.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
    console.log(`Socket.IO server ready`);
  });
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
