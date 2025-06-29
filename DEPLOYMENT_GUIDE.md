# Deployment Guide: Render + Vercel

## Backend Deployment (Render.com)

### 1. Sign up/Login
- Go to [https://render.com/](https://render.com/)
- Sign up with GitHub account

### 2. Create Web Service
- Click "New +" → "Web Service"
- Connect GitHub repo: `zephywebsite`
- **Root Directory**: `chat-server`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment**: Node
- **Instance Type**: Free

### 3. Environment Variables
Add these in Render dashboard:
```
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 4. Deploy
- Click "Create Web Service"
- Wait for build completion
- Note your backend URL: `https://your-app-name.onrender.com`

## Frontend Deployment (Vercel.com)

### 1. Sign up/Login
- Go to [https://vercel.com/](https://vercel.com/)
- Sign up with GitHub account

### 2. Import Project
- Click "New Project"
- Import GitHub repo: `zephywebsite`
- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave blank)

### 3. Environment Variables
Add this in Vercel dashboard:
```
NEXT_PUBLIC_CHAT_SERVER_URL=https://your-backend-url.onrender.com
```

### 4. Deploy
- Click "Deploy"
- Wait for build completion
- Note your frontend URL: `https://your-app.vercel.app`

## Final Configuration

### 1. Update Backend FRONTEND_URL
- Go back to Render dashboard
- Update `FRONTEND_URL` with your Vercel URL
- Redeploy the service

### 2. Test Connection
- Open your Vercel frontend URL
- Try connecting to another user
- Test file sharing and encryption

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in backend
2. **Connection Failed**: Check if backend URL is correct in frontend
3. **Build Failures**: Ensure all dependencies are in `package.json`

### Environment Variables Summary:
- **Backend (Render)**: `PORT`, `NODE_ENV`, `FRONTEND_URL`
- **Frontend (Vercel)**: `NEXT_PUBLIC_CHAT_SERVER_URL`

## URLs to Remember:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app-name.onrender.com`
- GitHub: `https://github.com/yourusername/zephywebsite` 