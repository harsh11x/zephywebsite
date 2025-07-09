# Zephy Secure Chat & File Sharing Setup

This guide explains how to set up and use the new real-time encrypted chat and file sharing feature in your Zephy application.

## Overview

The chat system consists of two main components:
1. **Frontend (Next.js)**: The chat interface in your dashboard
2. **Backend (WebSocket Server)**: Real-time communication server

## Features

- ✅ Real-time messaging between users
- ✅ File sharing with secure transfer
- ✅ User connection management via email
- ✅ Online/offline status tracking
- ✅ Modern, responsive UI
- ✅ End-to-end encryption ready (can be enhanced)
- ✅ **Multi-device support** - Connect multiple devices to the same account
- ✅ **Separated chat histories** - Each user conversation has its own isolated chat history
- ✅ **Unread message indicators** - Visual badges show unread message counts
- ✅ **Message previews** - See last message preview in connection list
- ✅ **Cross-device synchronization** - Messages sync across all connected devices

## Multi-Device Support

The chat system now supports multiple devices connecting to the same user account:

- **Multiple Connections**: Users can connect from multiple devices (phone, tablet, desktop)
- **Synchronized Messages**: All messages are delivered to all connected devices
- **Separated Chat Histories**: Each conversation with a different user is completely isolated
- **Unread Counts**: Unread message counts are tracked per conversation
- **Real-time Updates**: All devices receive messages in real-time

## Chat History Management

Each chat conversation is now properly isolated:

- **Per-Connection Sessions**: Each user connection has its own chat session
- **Persistent History**: Chat history is maintained per connection until disconnection
- **No Cross-Contamination**: Messages from different users never mix
- **Clean Switching**: Switching between connections shows the correct chat history

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Start both servers:**
```bash
docker-compose up --build
```

2. **Access the application:**
- Frontend: http://localhost:3000
- Chat Server: http://localhost:3001

### Option 2: Manual Setup

1. **Install dependencies:**
```bash
# Frontend dependencies
pnpm install

# Chat server dependencies
cd chat-server && npm install && cd ..
```

2. **Start the chat server:**
```bash
npm run chat-server
```

3. **Start the frontend (in another terminal):**
```bash
npm run dev
```

4. **Or run both together:**
```bash
npm run dev:full
```

## How to Use

### 1. Access the Chat Feature

1. Log into your Zephy account
2. Go to the Dashboard
3. Click on the "Secure Chat" card
4. You'll be redirected to `/dashboard/chat`

### 2. Connect with Other Users

1. **Enter Email**: In the left panel, enter the email address of the user you want to connect with
2. **Click Connect**: The system will attempt to establish a connection
3. **Wait for Confirmation**: If the user is online, the connection will be established

### 3. Multi-Device Setup

1. **Connect from Multiple Devices**: Open the chat on different devices using the same account
2. **Automatic Sync**: Messages will automatically sync across all connected devices
3. **Separate Conversations**: Each conversation with a different user remains isolated
4. **Unread Indicators**: Red badges show unread message counts for each conversation

### 4. Send Messages

1. **Select a Connection**: Click on a connected user from the left panel
2. **Type Message**: Use the text area at the bottom
3. **Send**: Press Enter or click the Send button
4. **Cross-Device Delivery**: Message appears on all connected devices

### 5. Share Files

1. **Select a Connection**: Choose the user you want to share with
2. **Click File Icon**: Use the paperclip icon to select a file
3. **Send**: The file will be sent to all connected devices
4. **Download**: Recipients can download files directly from the chat

## Technical Details

### Chat Sessions

Each user connection creates a separate chat session with:
- Unique session ID based on connection
- Isolated message history
- Unread message counter
- Last activity timestamp

### Multi-Device Architecture

- **Socket.IO Rooms**: Each user joins their personal room
- **Broadcast Messages**: Messages are sent to all sockets in the user's room
- **Connection Tracking**: Server tracks multiple sockets per user
- **Graceful Cleanup**: Connections are cleaned up when all devices disconnect

### Message Routing

- **Sender Identification**: Messages are routed based on sender email
- **Session Matching**: Messages are added to the correct chat session
- **Unread Tracking**: Unread counts increment for non-active conversations
- **Read Status**: Messages are marked as read when conversation is selected

## Troubleshooting

### Connection Issues

1. **Check Server Status**: Visit `http://localhost:3001/health`
2. **Verify CORS**: Ensure frontend URL is in allowed origins
3. **Check Network**: Verify WebSocket connection is established

### Message Issues

1. **Encryption Keys**: Ensure both users have the same encryption key
2. **User Online**: Verify target user is connected to chat server
3. **Connection Status**: Check if users are properly connected

### Multi-Device Issues

1. **Session Isolation**: Each device maintains separate chat sessions
2. **Message Sync**: Messages should appear on all connected devices
3. **Unread Counts**: Counts should reset when conversation is selected

## API Endpoints

### Health Check
```
GET /health
```

### Connected Users (Debug)
```
GET /users
```

Returns detailed information about connected users and their devices.

## Security Features

- **End-to-End Encryption**: Messages can be encrypted with shared keys
- **Connection Validation**: Only authenticated users can connect
- **Message Isolation**: Messages are isolated per conversation
- **Secure File Transfer**: Files are transferred securely via WebSocket

## Future Enhancements

- [ ] Persistent message storage
- [ ] Message search functionality
- [ ] Group chat support
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Message delivery receipts 