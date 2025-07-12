# Voice & Video Calling System Guide

## Overview

The Zephy Voice & Video Calling system provides end-to-end encrypted voice and video calls with AES-256 encryption, ECDH key exchange, and real-time user discovery. This system allows users to make secure calls directly by entering an email address, with automatic user availability detection.

## Features

### 🔐 Security Features
- **AES-256-GCM Encryption**: All audio and video data is encrypted using AES-256-GCM
- **ECDH Key Exchange**: Secure key exchange using Elliptic Curve Diffie-Hellman
- **Shared Key Authentication**: Additional layer of security with user-provided shared keys
- **No Server Storage**: Audio/video data is never stored on servers
- **P2P Connection**: Direct peer-to-peer connections using WebRTC

### 📞 Call Features
- **Voice Calls**: High-quality audio calls with echo cancellation and noise suppression
- **Video Calls**: HD video calls with configurable resolution and frame rate
- **Real-time User Discovery**: Automatic detection of online users
- **Call Controls**: Mute, camera toggle, speaker control
- **Call Statistics**: Track call duration, encryption status, and call history

### 🎯 User Experience
- **Direct Calling**: Call users by entering their email address
- **Incoming Call Notifications**: Browser notifications, ringtone, and vibration
- **Persistent Call Banner**: Fixed banner for incoming calls
- **Permission Management**: Automatic microphone and camera permission requests
- **Connection Quality**: Real-time connection quality indicators

## System Architecture

### Frontend Components

#### VoiceCall Component (`components/voice-call.tsx`)
- **WebRTC Management**: Handles peer connections, media streams, and signaling
- **Encryption Layer**: Manages AES-256 encryption and ECDH key exchange
- **UI Controls**: Call initiation, controls, and status display
- **Permission Handling**: Microphone and camera permission management

#### Voice Call Page (`app/dashboard/voice/page.tsx`)
- **Statistics Display**: Shows call statistics and connection status
- **Security Information**: Displays encryption features and call quality
- **Integration**: Integrates with the main VoiceCall component

### Backend Server (`chat-server/server.js`)

#### Socket.IO Events
- `voice_call_request`: Initiates a call with offer and encryption keys
- `voice_call_incoming`: Notifies target user of incoming call
- `voice_call_answer`: Handles call acceptance with answer and keys
- `voice_call_reject`: Handles call rejection
- `voice_call_end`: Manages call termination and statistics
- `voice_get_available_users`: Returns list of online users
- `voice_get_stats`: Returns call statistics for user

#### User Management
- **Real-time Discovery**: Automatically broadcasts user availability
- **Multi-device Support**: Users can connect from multiple devices
- **Connection Tracking**: Maintains active connections and call sessions

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- Modern browser with WebRTC support
- Microphone and camera permissions (for video calls)

### 2. Server Setup
```bash
cd chat-server
npm install
npm start
```

### 3. Frontend Setup
```bash
npm install
npm run dev
```

### 4. Ringtone Setup
Place a ringtone file (MP3 format) in the `public` folder:
```
public/ringtone.mp3
```

## Usage Guide

### Making a Call

1. **Set Encryption Key**
   - Enter or generate a shared encryption key
   - Both users must use the same key
   - Click "Apply Key" to activate

2. **Choose Call Type**
   - Select "Voice Call" for audio-only calls
   - Select "Video Call" for video calls

3. **Enter Target Email**
   - Type the email address of the person you want to call
   - Or select from the "Available Users" list

4. **Start Call**
   - Click "Start Voice Call" or "Start Video Call"
   - The system will automatically establish the connection

### Receiving a Call

1. **Incoming Call Notification**
   - Browser notification appears
   - Ringtone plays (if file is available)
   - Vibration on mobile devices
   - Persistent banner shows at top of screen

2. **Answer or Decline**
   - Click "Answer" to accept the call
   - Click "Decline" to reject the call
   - Call type (voice/video) is automatically detected

### During a Call

1. **Call Controls**
   - **Mute/Unmute**: Toggle microphone
   - **Camera On/Off**: Toggle video (video calls only)
   - **Speaker**: Toggle speaker output
   - **End Call**: Terminate the call

2. **Video Display** (Video calls only)
   - Local video shows your camera feed
   - Remote video shows the other person's feed
   - Both videos are displayed side by side

3. **Call Information**
   - Call duration timer
   - Connection quality indicator
   - Encryption status badge

## Technical Details

### Encryption Flow

1. **Key Generation**
   ```javascript
   // Generate ECDH key pair
   const keyPair = await SecureVoiceCrypto.generateKeyPair()
   const publicKeyString = await SecureVoiceCrypto.exportPublicKey(keyPair.publicKey)
   ```

2. **Key Exchange**
   ```javascript
   // Derive shared key from ECDH
   const ecdhKey = await SecureVoiceCrypto.deriveSharedKey(privateKey, remotePublicKey)
   ```

3. **Final Key Derivation**
   ```javascript
   // Combine ECDH key with user-provided shared secret
   const finalKey = await deriveFinalAESKey(ecdhKey, sharedKey)
   ```

4. **Audio/Video Encryption**
   ```javascript
   // Encrypt media data
   const { encrypted, iv } = await SecureVoiceCrypto.encryptAudio(audioData, finalKey)
   ```

### WebRTC Configuration

```javascript
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10
})
```

### Media Constraints

#### Voice Calls
```javascript
{
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  },
  video: false
}
```

#### Video Calls
```javascript
{
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  },
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 }
  }
}
```

## Troubleshooting

### Common Issues

1. **No Audio/Video**
   - Check browser permissions for microphone and camera
   - Ensure the ringtone file is in the correct location
   - Verify WebRTC is supported in your browser

2. **Call Not Received**
   - Check if both users are online
   - Verify the shared encryption key is the same
   - Ensure notifications are enabled

3. **Poor Call Quality**
   - Check internet connection
   - Try reducing video quality for video calls
   - Ensure firewall allows WebRTC traffic

4. **Connection Failures**
   - Check STUN server availability
   - Verify server is running and accessible
   - Check browser console for errors

### Debug Information

Enable debug logging in the browser console:
```javascript
localStorage.setItem('debug', 'socket.io-client:*')
```

### Testing

Run the comprehensive test suite:
```bash
node scripts/test-voice-video-calling.js
```

## Security Considerations

### Encryption
- All audio and video data is encrypted end-to-end
- Keys are never stored on the server
- ECDH provides perfect forward secrecy
- Shared key adds additional authentication layer

### Privacy
- No call content is stored on servers
- Call metadata is minimal and temporary
- User discovery is real-time only
- No persistent call logs

### Best Practices
- Use strong, unique shared keys
- Regularly rotate encryption keys
- Keep the application updated
- Use HTTPS in production

## Performance Optimization

### Audio Quality
- Opus codec for optimal compression
- 48kHz sample rate for high fidelity
- Adaptive bitrate based on connection

### Video Quality
- H.264 codec for broad compatibility
- Adaptive resolution based on bandwidth
- Frame rate optimization for smooth video

### Network Optimization
- Multiple STUN servers for reliability
- ICE candidate pooling for faster connection
- Connection quality monitoring

## API Reference

### Socket Events

#### Client to Server
- `voice_call_request`: Initiate a call
- `voice_call_answer`: Answer an incoming call
- `voice_call_reject`: Reject an incoming call
- `voice_call_end`: End an active call
- `voice_get_available_users`: Get list of online users
- `voice_get_stats`: Get call statistics

#### Server to Client
- `voice_call_incoming`: Incoming call notification
- `voice_call_answered`: Call answered notification
- `voice_call_rejected`: Call rejected notification
- `voice_call_ended`: Call ended notification
- `voice_users_available`: Available users list
- `voice_call_stats`: Call statistics data

### Component Props

#### VoiceCall Component
```typescript
interface VoiceCallProps {
  userEmail: string
  socket: Socket
  onCallEnd?: () => void
}
```

## Future Enhancements

### Planned Features
- **Screen Sharing**: Share screen during video calls
- **Group Calls**: Support for multiple participants
- **Call Recording**: Encrypted call recording (client-side)
- **File Transfer**: Secure file sharing during calls
- **Call Scheduling**: Schedule calls for later
- **Call Analytics**: Detailed call quality metrics

### Technical Improvements
- **WebRTC Data Channels**: For additional data transfer
- **Adaptive Bitrate**: Dynamic quality adjustment
- **Fallback Servers**: Multiple server locations
- **Mobile Optimization**: Native mobile app support

## Support

For technical support or questions:
- Check the troubleshooting section
- Review browser console for errors
- Test with the provided test suite
- Ensure all prerequisites are met

## License

This voice and video calling system is part of the Zephy security platform and is subject to the same licensing terms. 