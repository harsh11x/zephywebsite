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

### 3. Send Messages

1. **Select a Connection**: Click on a connected user from the left panel
2. **Type Message**: Use the text area at the bottom
3. **Send**: Press Enter or click the Send button

### 4. Share Files

1. **Select a Connection**: Choose the user you want to share with
2. **Attach File**: Click the paperclip icon
3. **Choose File**: Select the file from your device
4. **Send**: The file will be sent automatically

### 5. Download Files

1. **View File**: Files appear as messages with a download button
2. **Download**: Click the download icon to save the file

## Architecture

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   Next.js App   │ ◄─────────────► │  Chat Server    │
│   (Frontend)    │                 │   (Backend)     │
└─────────────────┘                 └─────────────────┘
        │                                    │
        │                                    │
        ▼                                    ▼
┌─────────────────┐                 ┌─────────────────┐
│   User Browser  │                 │  Socket.IO      │
│                 │                 │  Express.js     │
└─────────────────┘                 └─────────────────┘
```

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_CHAT_SERVER_URL=http://localhost:3001
```

### Chat Server
```bash
FRONTEND_URL=http://localhost:3000
PORT=3001
```

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect to Vercel
3. Set environment variable: `NEXT_PUBLIC_CHAT_SERVER_URL=https://your-chat-server.com`

### Chat Server (VPS/Cloud)
1. **Deploy to VPS:**
```bash
# On your server
git clone <your-repo>
cd chat-server
npm install
npm start
```

2. **Use PM2 for production:**
```bash
npm install -g pm2
pm2 start server.js --name "zephy-chat"
pm2 startup
pm2 save
```

3. **Set up reverse proxy (nginx):**
```nginx
server {
    listen 80;
    server_name your-chat-server.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Considerations

### Current Implementation
- ✅ Authentication required for connections
- ✅ Users can only message connected users
- ✅ CORS protection enabled
- ✅ Input validation

### Recommended Enhancements
- 🔒 End-to-end encryption for messages
- 🔒 File encryption before transfer
- 🔒 Rate limiting
- 🔒 Message persistence with database
- 🔒 User blocking/blocking features

## Troubleshooting

### Common Issues

1. **"User is not online"**
   - The target user must be logged into the chat system
   - Check if they're on the chat page

2. **Connection failed**
   - Verify the chat server is running
   - Check environment variables
   - Ensure CORS is properly configured

3. **Messages not sending**
   - Check browser console for errors
   - Verify WebSocket connection status
   - Ensure both users are connected

4. **File upload issues**
   - Check file size limits
   - Verify file type is supported
   - Check browser permissions

### Debug Commands

```bash
# Check chat server health
curl http://localhost:3001/health

# View connected users
curl http://localhost:3001/users

# Check server logs
docker-compose logs chat-server
```

## Development

### Adding New Features

1. **New Message Types**: Modify the `Message` interface in `app/dashboard/chat/page.tsx`
2. **Enhanced UI**: Update the chat components
3. **Server Logic**: Add new socket events in `chat-server/server.js`

### Testing

1. **Local Testing**: Use two browser windows/tabs
2. **Multi-user Testing**: Use different browsers or incognito windows
3. **Network Testing**: Test with different network conditions

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review server logs for errors
3. Verify all environment variables are set correctly
4. Ensure both frontend and backend are running

## Future Enhancements

- [ ] End-to-end encryption
- [ ] Message history persistence
- [ ] Group chats
- [ ] Voice/video calls
- [ ] Message reactions
- [ ] File preview
- [ ] User profiles
- [ ] Message search
- [ ] Push notifications 