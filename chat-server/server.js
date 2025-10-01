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
    "https://zephyrnsecurities.com", // production without www
    "http://localhost:3000"              // local dev (optional)
  ],
  credentials: true
}));

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: [
      "https://www.zephyrnsecurities.com",
      "https://zephyrnsecurities.com",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  maxHttpBufferSize: 100 * 1024 * 1024 // 100 MB
});

// Store connected users
const connectedUsers = new Map(); // socketId -> userData
const userSockets = new Map(); // email -> Set of socketIds for that user
const userConnections = new Map(); // email -> Set of connected user emails

// Voice call tracking
const activeCalls = new Map(); // callId -> callData
const callStats = new Map(); // email -> stats

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
  
  // Track all sockets for this user
  if (!userSockets.has(socket.userEmail)) {
    userSockets.set(socket.userEmail, new Set());
  }
  userSockets.get(socket.userEmail).add(socket.id);
  
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

  // Broadcast available users to all connected users
  const broadcastAvailableUsers = () => {
    const availableUsers = Array.from(connectedUsers.values())
      .map(user => user.email)
      .filter((email, index, arr) => arr.indexOf(email) === index); // Remove duplicates
    
    io.emit('voice_users_available', availableUsers);
    console.log(`📡 Broadcasted available users: ${availableUsers.join(', ')} (Total: ${availableUsers.length})`);
  };

  // Broadcast available users when someone connects
  setTimeout(broadcastAvailableUsers, 500);
  
  // Handle text messages
  socket.on('send_message', (data) => {
    const { targetEmail, message } = data;
    
    if (!targetEmail || !message) {
      socket.emit('error', { message: 'Target email and message are required' });
      return;
    }
    
    // Allow one-way connection: deliver if EITHER user has the other in their connections
    const senderConnections = userConnections.get(socket.userEmail);
    const recipientConnections = userConnections.get(targetEmail);
    const isConnected = (senderConnections && senderConnections.has(targetEmail)) || (recipientConnections && recipientConnections.has(socket.userEmail));
    if (!isConnected) {
      socket.emit('error', { message: 'You are not connected to this user' });
      return;
    }
    
    // Send message to target user (all their connected devices)
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
    
    // Allow one-way connection: deliver if EITHER user has the other in their connections
    const senderConnections = userConnections.get(socket.userEmail);
    const recipientConnections = userConnections.get(targetEmail);
    const isConnected = (senderConnections && senderConnections.has(targetEmail)) || (recipientConnections && recipientConnections.has(socket.userEmail));
    if (!isConnected) {
      socket.emit('error', { message: 'You are not connected to this user' });
      return;
    }
    
    // Send file to target user (all their connected devices)
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
    
    // Remove from user sockets
    if (userSockets.has(socket.userEmail)) {
      userSockets.get(socket.userEmail).delete(socket.id);
      // If this was the last socket for this user, clean up connections
      if (userSockets.get(socket.userEmail).size === 0) {
        userSockets.delete(socket.userEmail);
    
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
      }
    }
    // Always broadcast available users after any disconnect
    setTimeout(broadcastAvailableUsers, 500);
  });

  // Voice/Video Call Events
    socket.on('voice_call_request', (data) => {
    // Log the full incoming data
    console.log('RAW voice_call_request data:', data);
    
    // Force hasVideo to boolean, fallback to false if missing
    let hasVideo = false;
    if (typeof data.hasVideo === 'boolean') {
      hasVideo = data.hasVideo;
    } else if (typeof data.hasVideo === 'string') {
      hasVideo = data.hasVideo === 'true';
    } else {
      console.warn('WARNING: hasVideo missing in incoming data, defaulting to false. Data:', data);
    }
    
    const { targetEmail, offer, publicKey, callerEmail } = data;
    console.log('Processed voice_call_request:', { ...data, hasVideo });
    console.log(`📞 ${hasVideo ? 'Video' : 'Voice'} call request from ${callerEmail} to ${targetEmail}`);
    
    // Check if target user is online
    const targetUser = Array.from(connectedUsers.values()).find(user => user.email === targetEmail);
    
    if (targetUser) {
      const callId = Date.now().toString();
      
      // Store call data
      activeCalls.set(callId, {
        id: callId,
        caller: callerEmail,
        callee: targetEmail,
        offer: offer,
        callerPublicKey: publicKey,
        hasVideo: hasVideo,
        status: 'pending',
        startTime: new Date()
      });
      
      // Send incoming call notification to target user
      const incomingCallData = {
        callId: callId,
        callerEmail: callerEmail,
        offer: offer,
        publicKey: publicKey,
        hasVideo: hasVideo,
        debug: 'VIDEO_FIX_TEST'
      };
      
      io.to(targetEmail).emit('voice_call_incoming', incomingCallData);
      console.log('EMITTED voice_call_incoming:', incomingCallData);
      
      console.log(`📞 Incoming ${hasVideo ? 'video' : 'voice'} call notification sent to ${targetEmail}`);
    } else {
      socket.emit('voice_call_error', { message: 'User is not online' });
    }
  });

  socket.on('voice_call_answer', (data) => {
    const { callId, answer, publicKey, calleeEmail } = data;
    
    console.log(`📞 Voice call answer from ${calleeEmail} for call ${callId}`);
    
    const callData = activeCalls.get(callId);
    let hasVideo = false;
    if (callData && typeof callData.hasVideo === 'boolean') {
      hasVideo = callData.hasVideo;
    }
    if (callData && callData.callee === calleeEmail) {
      // Update call status
      callData.status = 'connected';
      callData.calleePublicKey = publicKey;
      callData.answer = answer;
      
      // Send answer to caller
      io.to(callData.caller).emit('voice_call_answered', {
        callId: callId,
        answer: answer,
        publicKey: publicKey,
        calleeEmail: calleeEmail,
        hasVideo: !!hasVideo // Always boolean
      });
      console.log('EMITTED voice_call_answered:', {
        callId: callId,
        answer: answer,
        publicKey: publicKey,
        calleeEmail: calleeEmail,
        hasVideo: !!hasVideo
      });
      
      console.log(`📞 ${callData.hasVideo ? 'Video' : 'Voice'} call answer sent to ${callData.caller}`);
    } else {
      socket.emit('voice_call_error', { message: 'Invalid call or call not found' });
    }
  });

  socket.on('voice_call_reject', (data) => {
    const { callId, userEmail } = data;
    
    console.log(`📞 Voice call rejected by ${userEmail} for call ${callId}`);
    
    const callData = activeCalls.get(callId);
    if (callData) {
      // Notify caller about rejection
      io.to(callData.caller).emit('voice_call_rejected', {
        callId: callId,
        rejectedBy: userEmail
      });
      
      // Clean up call data
      activeCalls.delete(callId);
      
      console.log(`📞 Call rejection sent to ${callData.caller}`);
    }
  });

  socket.on('voice_call_end', (data) => {
    const { callId, userEmail } = data;
    
    console.log(`📞 Voice call ended by ${userEmail} for call ${callId}`);
    
    const callData = activeCalls.get(callId);
    if (callData) {
      // Update call end time
      callData.endTime = new Date();
      callData.duration = Math.floor((callData.endTime - callData.startTime) / 1000);
      
      // Update call statistics
      const updateStats = (email) => {
        if (!callStats.has(email)) {
          callStats.set(email, { totalCalls: 0, totalDuration: 0, encryptedCalls: 0, videoCalls: 0 });
        }
        const stats = callStats.get(email);
        stats.totalCalls++;
        stats.totalDuration += callData.duration;
        stats.encryptedCalls++; // All calls are encrypted
        if (callData.hasVideo) {
          stats.videoCalls++;
        }
      };
      
      updateStats(callData.caller);
      updateStats(callData.callee);
      
      // Notify both parties about call end
      io.to(callData.caller).emit('voice_call_ended', { callId: callId });
      io.to(callData.callee).emit('voice_call_ended', { callId: callId });
      
      // Clean up call data
      activeCalls.delete(callId);
      
      console.log(`📞 Call end notification sent to both parties`);
    }
  });

  socket.on('voice_get_available_users', () => {
    const availableUsers = Array.from(connectedUsers.values())
      .map(user => user.email)
      .filter((email, index, arr) => arr.indexOf(email) === index); // Remove duplicates
    
    socket.emit('voice_users_available', availableUsers);
  });

  socket.on('voice_get_stats', () => {
    const stats = callStats.get(socket.userEmail) || { totalCalls: 0, totalDuration: 0, encryptedCalls: 0, videoCalls: 0 };
    socket.emit('voice_call_stats', stats);
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
  
  const userStats = Array.from(userSockets.entries()).map(([email, sockets]) => ({
    email,
    socketCount: sockets.size,
    socketIds: Array.from(sockets)
  }));
  
  res.json({
    totalConnections: connectedUsers.size,
    uniqueUsers: userSockets.size,
    users: users,
    userStats: userStats
  });
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