const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: [
    "https://www.zephyrnsecurities.com", // production
    "http://localhost:3000"              // local dev (optional)
  ],
  credentials: true
}));

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: [
      "https://www.zephyrnsecurities.com",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  maxHttpBufferSize: 100 * 1024 * 1024 // 100 MB
});

// Store connected users
const connectedUsers = new Map(); // socketId -> userData
const userConnections = new Map(); // email -> Set of connected user emails

// Middleware to authenticate socket connections
io.use((socket, next) => {
  const { email, userId } = socket.handshake.auth;
  
  if (!email) {
    return next(new Error('Authentication error: Email required'));
  }
  
  socket.userEmail = email;
  socket.userId = userId;
  next();
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userEmail} (${socket.id})`);
  
  // Store user connection
  connectedUsers.set(socket.id, {
    email: socket.userEmail,
    userId: socket.userId,
    socketId: socket.id,
    connectedAt: new Date()
  });
  
  // Join user to their personal room
  socket.join(socket.userEmail);
  
  // Notify other users about this user's connection
  socket.broadcast.emit('user_connected', { email: socket.userEmail });
  
  // Handle user wanting to connect to another user
  socket.on('connect_to_user', (data) => {
    const { targetEmail } = data;
    
    if (!targetEmail) {
      socket.emit('error', { message: 'Target email is required' });
      return;
    }
    
    // Check if target user is online
    const targetUser = Array.from(connectedUsers.values()).find(user => user.email === targetEmail);
    
    if (targetUser) {
      // Create bidirectional connection
      const connectionId = [socket.userEmail, targetEmail].sort().join('_');
      
      // Add to user connections
      if (!userConnections.has(socket.userEmail)) {
        userConnections.set(socket.userEmail, new Set());
      }
      if (!userConnections.has(targetEmail)) {
        userConnections.set(targetEmail, new Set());
      }
      
      userConnections.get(socket.userEmail).add(targetEmail);
      userConnections.get(targetEmail).add(socket.userEmail);
      
      // Notify both users about the connection
      const connectionData = {
        id: connectionId,
        email: targetEmail,
        isOnline: true
      };
      
      socket.emit('connection_established', connectionData);
      
      // Notify target user about the connection
      io.to(targetEmail).emit('connection_established', {
        id: connectionId,
        email: socket.userEmail,
        isOnline: true
      });
      
      console.log(`Connection established between ${socket.userEmail} and ${targetEmail}`);
    } else {
      socket.emit('error', { message: 'User is not online' });
    }
  });
  
  // Handle text messages
  socket.on('send_message', (data) => {
    const { targetEmail, message } = data;
    
    if (!targetEmail || !message) {
      socket.emit('error', { message: 'Target email and message are required' });
      return;
    }
    
    // Check if users are connected
    const userConnectionsSet = userConnections.get(socket.userEmail);
    if (!userConnectionsSet || !userConnectionsSet.has(targetEmail)) {
      socket.emit('error', { message: 'You are not connected to this user' });
      return;
    }
    
    // Send message to target user
    io.to(targetEmail).emit('message_received', {
      ...message,
      sender: socket.userEmail,
      timestamp: new Date()
    });
    
    // Log message content appropriately
    if (message.encrypted) {
      console.log(`🔐 ENCRYPTED Message sent from ${socket.userEmail} to ${targetEmail}: [ENCRYPTED CONTENT]`);
      console.log(`   Key ID: ${message.encryptionKeyId || 'N/A'}`);
      console.log(`   Type: ${message.type}`);
    } else {
      console.log(`📝 PLAIN Message sent from ${socket.userEmail} to ${targetEmail}: ${message.content}`);
    }
  });
  
  // Handle file messages
  socket.on('send_file', (data) => {
    const { targetEmail, message } = data;
    
    if (!targetEmail || !message) {
      socket.emit('error', { message: 'Target email and file data are required' });
      return;
    }
    
    // Check if users are connected
    const userConnectionsSet = userConnections.get(socket.userEmail);
    if (!userConnectionsSet || !userConnectionsSet.has(targetEmail)) {
      socket.emit('error', { message: 'You are not connected to this user' });
      return;
    }
    
    // Send file to target user
    io.to(targetEmail).emit('file_received', {
      ...message,
      sender: socket.userEmail,
      timestamp: new Date()
    });
    
    // Log file content appropriately
    if (message.encrypted) {
      console.log(`🔐 ENCRYPTED File sent from ${socket.userEmail} to ${targetEmail}: ${message.fileName} [ENCRYPTED CONTENT]`);
      console.log(`   Key ID: ${message.encryptionKeyId || 'N/A'}`);
      console.log(`   Type: ${message.type}`);
    } else {
      console.log(`📁 PLAIN File sent from ${socket.userEmail} to ${targetEmail}: ${message.fileName}`);
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userEmail} (${socket.id})`);
    
    // Remove from connected users
    connectedUsers.delete(socket.id);
    
    // Remove from user connections
    if (userConnections.has(socket.userEmail)) {
      const connections = userConnections.get(socket.userEmail);
      connections.forEach(connectedEmail => {
        const otherUserConnections = userConnections.get(connectedEmail);
        if (otherUserConnections) {
          otherUserConnections.delete(socket.userEmail);
          // Notify the other user about disconnection
          io.to(connectedEmail).emit('user_disconnected', { email: socket.userEmail });
        }
      });
      userConnections.delete(socket.userEmail);
    }
    
    // Notify other users about this user's disconnection
    socket.broadcast.emit('user_disconnected', { email: socket.userEmail });
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedUsers: connectedUsers.size,
    timestamp: new Date().toISOString()
  });
});

// Get connected users (for debugging)
app.get('/users', (req, res) => {
  const users = Array.from(connectedUsers.values()).map(user => ({
    email: user.email,
    connectedAt: user.connectedAt
  }));
  res.json(users);
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Connected users: http://localhost:${PORT}/users`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
}); 