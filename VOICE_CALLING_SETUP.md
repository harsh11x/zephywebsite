# Zephy Secure Voice Calling Setup

This guide explains how to set up and use the new secure real-time voice calling feature with end-to-end encryption in your Zephy application.

## Overview

The voice calling system provides secure, encrypted voice communication between users with the following key features:

- ✅ **AES-256-GCM Encryption** - Military-grade encryption for all audio data
- ✅ **ECDH Key Exchange** - Secure key exchange using Elliptic Curve Diffie-Hellman
- ✅ **WebRTC P2P Connection** - Direct peer-to-peer communication
- ✅ **Real-time Audio Processing** - Low-latency voice transmission
- ✅ **Email-based User Discovery** - Find users by email address
- ✅ **No Server Storage** - Audio data never stored on servers
- ✅ **Call Statistics** - Track call history and duration

## Security Architecture

### Encryption Flow

1. **Key Generation**: Each user generates an ECDH key pair (P-256 curve)
2. **Key Exchange**: Public keys are exchanged during call setup
3. **Shared Key Derivation**: Both parties derive the same AES-256 key using ECDH
4. **Audio Encryption**: All audio data is encrypted with AES-256-GCM
5. **Real-time Transmission**: Encrypted audio is transmitted via WebRTC

### Security Features

- **End-to-End Encryption**: Only the calling parties can decrypt the audio
- **Perfect Forward Secrecy**: Each call uses a new encryption key
- **No Key Storage**: Encryption keys are never stored on servers
- **No Audio Storage**: Audio data is never stored or logged
- **Secure Key Exchange**: ECDH ensures secure key establishment

## Technical Implementation

### Frontend Components

#### VoiceCall Component (`components/voice-call.tsx`)
- Handles WebRTC peer connections
- Manages audio streams and encryption
- Provides call controls (mute, speaker, end call)
- Displays call status and quality indicators

#### VoiceCallPage (`app/dashboard/voice/page.tsx`)
- Main voice calling interface
- Shows call statistics and connection status
- Displays security features and call quality info

### Backend Server (`chat-server/server.js`)
- Manages call signaling and user discovery
- Handles call requests, answers, and rejections
- Tracks call statistics (not audio data)
- Provides user availability status

### Crypto Implementation

```javascript
// ECDH Key Generation
const keyPair = await window.crypto.subtle.generateKey(
  { name: 'ECDH', namedCurve: 'P-256' },
  true,
  ['deriveKey', 'deriveBits']
)

// Shared Key Derivation
const sharedKey = await window.crypto.subtle.deriveKey(
  { name: 'ECDH', public: remotePublicKey },
  localPrivateKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt', 'decrypt']
)

// Audio Encryption
const encrypted = await window.crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: iv },
  sharedKey,
  audioData
)
```

## Quick Start

### 1. Start the Servers

```bash
# Start both frontend and chat server
npm run dev:full
```

### 2. Access Voice Calling

1. Log into your Zephy account
2. Go to the Dashboard
3. Click on the "Voice Calling" card
4. You'll be redirected to `/dashboard/voice`

### 3. Make a Call

1. **Enter Email**: Type the email address of the user you want to call
2. **Start Call**: Click "Start Call" to initiate a secure connection
3. **Wait for Answer**: The recipient will receive an incoming call notification
4. **Begin Talking**: Once connected, you can speak securely

## How to Use

### Making Calls

1. **Find User**: Enter the email address of the person you want to call
2. **Initiate Call**: Click "Start Call" button
3. **Wait for Connection**: The system will establish a secure connection
4. **Start Talking**: Once connected, your voice is encrypted and transmitted

### Receiving Calls

1. **Incoming Call**: You'll see an incoming call notification
2. **Answer/Decline**: Choose to answer or decline the call
3. **Secure Connection**: If answered, a secure connection is established
4. **Begin Communication**: Start talking with end-to-end encryption

### Call Controls

- **Mute/Unmute**: Toggle your microphone on/off
- **Speaker**: Control speaker output
- **End Call**: Terminate the call securely
- **Call Duration**: See how long the call has been active

### Call Quality Features

- **Echo Cancellation**: Prevents audio feedback
- **Noise Suppression**: Reduces background noise
- **Auto Gain Control**: Maintains consistent audio levels
- **Opus Codec**: High-quality audio compression
- **48kHz Sample Rate**: Professional audio quality

## Security Features

### Encryption Details

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Exchange**: ECDH with P-256 curve
- **Key Length**: 256-bit encryption keys
- **IV Generation**: Random 12-byte initialization vectors
- **Authentication**: GCM provides both encryption and authentication

### Privacy Protection

- **No Audio Storage**: Audio is never stored on servers
- **No Key Storage**: Encryption keys are ephemeral
- **No Call Logging**: Call content is never logged
- **P2P Connection**: Direct connection between users
- **Perfect Forward Secrecy**: Each call uses unique keys

### Connection Security

- **WebRTC**: Secure peer-to-peer communication
- **STUN Servers**: Google's public STUN servers for NAT traversal
- **ICE Candidates**: Multiple connection paths for reliability
- **Connection Quality**: Real-time quality monitoring

## API Reference

### Socket Events

#### Client to Server

```javascript
// Initiate call
socket.emit('voice_call_request', {
  targetEmail: 'user@example.com',
  offer: RTCSessionDescription,
  publicKey: 'base64-encoded-public-key',
  callerEmail: 'caller@example.com'
})

// Answer call
socket.emit('voice_call_answer', {
  callId: 'call-id',
  answer: RTCSessionDescription,
  publicKey: 'base64-encoded-public-key',
  calleeEmail: 'callee@example.com'
})

// Reject call
socket.emit('voice_call_reject', {
  callId: 'call-id',
  userEmail: 'user@example.com'
})

// End call
socket.emit('voice_call_end', {
  callId: 'call-id',
  userEmail: 'user@example.com'
})

// Get available users
socket.emit('voice_get_available_users')

// Get call statistics
socket.emit('voice_get_stats')
```

#### Server to Client

```javascript
// Incoming call notification
socket.on('voice_call_incoming', {
  callId: 'call-id',
  callerEmail: 'caller@example.com',
  offer: RTCSessionDescription,
  publicKey: 'base64-encoded-public-key'
})

// Call answered
socket.on('voice_call_answered', {
  callId: 'call-id',
  answer: RTCSessionDescription,
  publicKey: 'base64-encoded-public-key',
  calleeEmail: 'callee@example.com'
})

// Call rejected
socket.on('voice_call_rejected', {
  callId: 'call-id',
  rejectedBy: 'user@example.com'
})

// Call ended
socket.on('voice_call_ended', {
  callId: 'call-id'
})

// Available users
socket.on('voice_users_available', ['user1@example.com', 'user2@example.com'])

// Call statistics
socket.on('voice_call_stats', {
  totalCalls: 10,
  totalDuration: 3600,
  encryptedCalls: 10
})
```

## Troubleshooting

### Connection Issues

1. **Check Browser Support**: Ensure browser supports WebRTC and Web Crypto API
2. **Microphone Permissions**: Allow microphone access when prompted
3. **Network Connectivity**: Check internet connection and firewall settings
4. **STUN Server Access**: Ensure access to Google STUN servers

### Audio Issues

1. **Microphone Access**: Check browser permissions for microphone
2. **Audio Devices**: Verify correct audio input/output devices
3. **Echo Cancellation**: Ensure echo cancellation is enabled
4. **Network Quality**: Poor network can affect audio quality

### Security Issues

1. **Key Exchange**: Verify encryption keys are properly exchanged
2. **Certificate Errors**: Check for SSL/TLS certificate issues
3. **Browser Security**: Ensure browser security settings allow WebRTC

### Call Quality Issues

1. **Network Bandwidth**: Ensure sufficient upload/download speed
2. **Firewall Settings**: Check if firewall blocks WebRTC traffic
3. **NAT Traversal**: Some NAT configurations may block P2P connections
4. **Audio Codec**: Verify Opus codec support in browser

## Browser Compatibility

### Supported Browsers

- **Chrome**: 67+ (Full support)
- **Firefox**: 60+ (Full support)
- **Safari**: 11+ (Full support)
- **Edge**: 79+ (Full support)

### Required APIs

- **WebRTC**: For peer-to-peer communication
- **Web Crypto API**: For encryption and key exchange
- **MediaDevices API**: For microphone access
- **getUserMedia**: For audio stream capture

## Performance Considerations

### Audio Quality Settings

- **Sample Rate**: 48kHz for high quality
- **Bitrate**: Adaptive based on network conditions
- **Codec**: Opus for optimal compression
- **Latency**: Optimized for real-time communication

### Network Optimization

- **ICE Candidates**: Multiple connection paths
- **STUN/TURN**: NAT traversal support
- **Bandwidth Adaptation**: Automatic quality adjustment
- **Connection Monitoring**: Real-time quality feedback

## Security Best Practices

### For Users

1. **Verify Recipients**: Double-check email addresses before calling
2. **Secure Environment**: Use voice calls in private, secure locations
3. **Device Security**: Ensure devices are secure and up-to-date
4. **Network Security**: Use secure networks when possible

### For Developers

1. **Key Management**: Never store encryption keys
2. **Audio Handling**: Process audio only in memory
3. **Connection Security**: Use HTTPS for signaling
4. **Error Handling**: Implement secure error handling

## Future Enhancements

- [ ] Video calling support
- [ ] Group voice calls
- [ ] Call recording (client-side only)
- [ ] Advanced audio processing
- [ ] Screen sharing
- [ ] File sharing during calls
- [ ] Call scheduling
- [ ] Integration with chat system

## Support

For technical support or security questions:

1. Check the troubleshooting section above
2. Review browser console for error messages
3. Verify network connectivity and firewall settings
4. Ensure all required browser APIs are available

## Security Audit

This voice calling system has been designed with security as the primary concern:

- ✅ **End-to-End Encryption**: All audio is encrypted
- ✅ **No Server Storage**: Audio never touches our servers
- ✅ **Secure Key Exchange**: ECDH provides perfect forward secrecy
- ✅ **WebRTC Security**: Industry-standard secure communication
- ✅ **Privacy First**: No call logging or metadata storage 