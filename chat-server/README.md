# Zephy Chat Server

A WebSocket server for real-time encrypted chat and file sharing functionality.

## Features

- Real-time messaging between users
- File sharing with base64 encoding
- User connection management
- Online/offline status tracking
- Secure authentication via email
- CORS support for web clients

## Setup

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
export FRONTEND_URL=http://localhost:3000
export PORT=3001
```

### Running the Server

#### Development
```bash
npm run dev
```

#### Production
```bash
npm start
```

#### With Docker
```bash
docker build -t zephy-chat-server .
docker run -p 3001:3001 -e FRONTEND_URL=http://localhost:3000 zephy-chat-server
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Connected Users
- `GET /users` - List of currently connected users

## WebSocket Events

### Client to Server
- `connect_to_user` - Connect to another user by email
- `send_message` - Send a text message
- `send_file` - Send a file

### Server to Client
- `connection_established` - New connection established
- `message_received` - Text message received
- `file_received` - File message received
- `user_connected` - User came online
- `user_disconnected` - User went offline
- `error` - Error message

## Environment Variables

- `FRONTEND_URL` - URL of the frontend application (default: http://localhost:3000)
- `PORT` - Server port (default: 3001)

## Security

- Authentication required for all socket connections
- Users can only message connected users
- CORS protection enabled
- Input validation on all events

## Deployment

The server can be deployed to any platform that supports Node.js:

- **VPS/Dedicated Server**: Use PM2 or systemd
- **Cloud Platforms**: Heroku, Railway, Render, etc.
- **Container Platforms**: Docker, Kubernetes
- **Serverless**: Not recommended due to WebSocket requirements

## Monitoring

The server includes health check endpoints and logging for monitoring:

```bash
# Check server health
curl http://localhost:3001/health

# View connected users
curl http://localhost:3001/users
``` 