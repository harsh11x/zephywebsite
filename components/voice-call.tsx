"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  User,
  Users,
  Shield,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  Key,
  Lock,
  Unlock,
  Settings,
  RefreshCw,
  Wifi,
  WifiOff,
  X,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { nanoid } from 'nanoid'

// Crypto utilities for AES-256 and ECDH
class SecureVoiceCrypto {
  // Generate ECDH key pair
  static async generateKeyPair(): Promise<CryptoKeyPair> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveKey', 'deriveBits']
    )
  }

  // Derive shared AES key from ECDH
  static async deriveSharedKey(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
    return await window.crypto.subtle.deriveKey(
      {
        name: 'ECDH',
        public: publicKey
      },
      privateKey,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    )
  }

  // Encrypt audio data with AES-256-GCM
  static async encryptAudio(audioData: ArrayBuffer, key: CryptoKey): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      audioData
    )
    return { encrypted, iv }
  }

  // Decrypt audio data with AES-256-GCM
  static async decryptAudio(encryptedData: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<ArrayBuffer> {
    return await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encryptedData
    )
  }

  // Export public key for transmission
  static async exportPublicKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('spki', key)
    return btoa(String.fromCharCode(...new Uint8Array(exported)))
  }

  // Import public key from transmission
  static async importPublicKey(keyString: string): Promise<CryptoKey> {
    const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0))
    return await window.crypto.subtle.importKey(
      'spki',
      keyData,
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      []
    )
  }
}

interface CallSession {
  id: string
  caller: string
  callee: string
  status: 'connecting' | 'connected' | 'disconnected' | 'failed'
  startTime?: Date
  endTime?: Date
  encryptionKey?: CryptoKey
  isInitiator: boolean
}

interface VoiceCallProps {
  userEmail: string
  socket: any
  onCallEnd?: () => void
}

// Add a ringtone sound (public domain)
const RINGTONE_URL = "/ringtone.mp3" // Place a ringtone file in public/

export default function VoiceCall({ userEmail, socket, onCallEnd }: VoiceCallProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null)
  const [callTarget, setCallTarget] = useState('')
  const [isIncomingCall, setIsIncomingCall] = useState(false)
  const [incomingCallData, setIncomingCallData] = useState<any>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [isEncryptionEstablished, setIsEncryptionEstablished] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent')
  const [availableUsers, setAvailableUsers] = useState<string[]>([])
  const [sharedKey, setSharedKey] = useState<string>("")
  const [pendingKey, setPendingKey] = useState<string>("")
  const [showKeyWarning, setShowKeyWarning] = useState(false)
  const [micPermission, setMicPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [notifPermission, setNotifPermission] = useState<'pending' | 'granted' | 'denied'>('pending')

  // WebRTC refs
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localAudioRef = useRef<HTMLAudioElement | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Crypto refs
  const keyPairRef = useRef<CryptoKeyPair | null>(null)
  const sharedKeyRef = useRef<CryptoKey | null>(null)

  // Ringtone audio element (hidden)
  const ringtoneRef = useRef<HTMLAudioElement | null>(null)

  // On mount, load key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('zephy-voice-shared-key')
    if (savedKey) {
      setSharedKey(savedKey)
      setPendingKey(savedKey)
    }
  }, [])

  // Save key to localStorage on change
  useEffect(() => {
    if (sharedKey) localStorage.setItem('zephy-voice-shared-key', sharedKey)
  }, [sharedKey])

  // Request permissions on mount
  useEffect(() => {
    // Microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setMicPermission('granted'))
      .catch(() => setMicPermission('denied'))
    // Notifications
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        setNotifPermission('granted')
      } else if (Notification.permission === "denied") {
        setNotifPermission('denied')
      } else {
        Notification.requestPermission().then(permission => {
          setNotifPermission(permission === 'granted' ? 'granted' : 'denied')
        })
      }
    } else {
      setNotifPermission('denied')
    }
  }, [])

  // Block call features if permissions are not granted
  const permissionsOk = micPermission === 'granted' && notifPermission === 'granted'

  // Initialize WebRTC
  const initializeWebRTC = useCallback(async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        },
        video: false 
      })
      
      localStreamRef.current = stream
      
      // Create peer connection with STUN servers
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ],
        iceCandidatePoolSize: 10
      })

      // Add local stream
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream)
      })

      // Handle incoming tracks
      peerConnection.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0]
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0]
        }
      }

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState)
        if (peerConnection.connectionState === 'connected') {
          setConnectionQuality('excellent')
        } else if (peerConnection.connectionState === 'disconnected') {
          setConnectionQuality('poor')
        }
      }

      // Handle ICE connection state
      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState)
        if (peerConnection.iceConnectionState === 'connected') {
          setConnectionQuality('excellent')
        } else if (peerConnection.iceConnectionState === 'checking') {
          setConnectionQuality('good')
        } else if (peerConnection.iceConnectionState === 'failed') {
          setConnectionQuality('poor')
        }
      }

      peerConnectionRef.current = peerConnection
      return peerConnection
    } catch (error) {
      console.error('Failed to initialize WebRTC:', error)
      toast.error('Failed to access microphone')
      throw error
    }
  }, [])

  // Generate encryption keys
  const generateEncryptionKeys = useCallback(async () => {
    try {
      const keyPair = await SecureVoiceCrypto.generateKeyPair()
      keyPairRef.current = keyPair
      const publicKeyString = await SecureVoiceCrypto.exportPublicKey(keyPair.publicKey)
      return publicKeyString
    } catch (error) {
      console.error('Failed to generate encryption keys:', error)
      toast.error('Failed to establish secure connection')
      throw error
    }
  }, [])

  // Derive final AES key using ECDH shared key and user-provided sharedKey
  const deriveFinalAESKey = async (ecdhKey: CryptoKey, sharedSecret: string): Promise<CryptoKey> => {
    // Hash the shared secret to 256 bits
    const secretBytes = new TextEncoder().encode(sharedSecret)
    const hash = await window.crypto.subtle.digest('SHA-256', secretBytes)
    // Import as AES key
    return await window.crypto.subtle.importKey(
      'raw',
      hash,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    )
  }

  // Establish encrypted connection
  const establishEncryptedConnection = useCallback(async (remotePublicKeyString: string) => {
    try {
      if (!keyPairRef.current) {
        throw new Error('Local key pair not generated')
      }
      if (!sharedKey) {
        setShowKeyWarning(true)
        throw new Error('Shared key not set')
      }
      const remotePublicKey = await SecureVoiceCrypto.importPublicKey(remotePublicKeyString)
      const ecdhKey = await SecureVoiceCrypto.deriveSharedKey(
        keyPairRef.current.privateKey,
        remotePublicKey
      )
      // Derive final AES key using sharedKey
      const finalKey = await deriveFinalAESKey(ecdhKey, sharedKey)
      sharedKeyRef.current = finalKey
      setIsEncryptionEstablished(true)
      toast.success('Secure connection established')
      return finalKey
    } catch (error) {
      console.error('Failed to establish encrypted connection:', error)
      toast.error('Failed to establish secure connection')
      throw error
    }
  }, [sharedKey])

  // Initiate call
  const initiateCall = async () => {
    if (!callTarget || !socket) return
    if (!sharedKey) {
      setShowKeyWarning(true)
      toast.error('Please set a shared key before starting a call')
      return
    }

    try {
      setIsCallActive(true)
      
      // Generate encryption keys
      const publicKeyString = await generateEncryptionKeys()
      
      // Initialize WebRTC
      const peerConnection = await initializeWebRTC()
      
      // Create offer
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      
      // Send call request
      const callData = {
        targetEmail: callTarget,
        offer: offer,
        publicKey: publicKeyString,
        callerEmail: userEmail
      }
      
      socket.emit('voice_call_request', callData)
      
      // Set up call session
      const callSession: CallSession = {
        id: Date.now().toString(),
        caller: userEmail,
        callee: callTarget,
        status: 'connecting',
        startTime: new Date(),
        isInitiator: true
      }
      
      setCurrentCall(callSession)
      setCallTarget('')
      
      toast.success(`Calling ${callTarget}...`)
      
    } catch (error) {
      console.error('Failed to initiate call:', error)
      setIsCallActive(false)
      toast.error('Failed to start call')
    }
  }

  // Answer incoming call
  const answerCall = async () => {
    if (!incomingCallData || !socket) return

    try {
      setIsCallActive(true)
      setIsIncomingCall(false)
      
      // Generate encryption keys
      const publicKeyString = await generateEncryptionKeys()
      
      // Initialize WebRTC
      const peerConnection = await initializeWebRTC()
      
      // Set remote description
      await peerConnection.setRemoteDescription(incomingCallData.offer)
      
      // Create answer
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      
      // Send answer
      socket.emit('voice_call_answer', {
        callId: incomingCallData.callId,
        answer: answer,
        publicKey: publicKeyString,
        calleeEmail: userEmail
      })
      
      // Establish encryption
      await establishEncryptedConnection(incomingCallData.publicKey)
      
      // Set up call session
      const callSession: CallSession = {
        id: incomingCallData.callId,
        caller: incomingCallData.callerEmail,
        callee: userEmail,
        status: 'connected',
        startTime: new Date(),
        isInitiator: false
      }
      
      setCurrentCall(callSession)
      setIncomingCallData(null)
      
      toast.success('Call connected')
      
    } catch (error) {
      console.error('Failed to answer call:', error)
      setIsCallActive(false)
      setIsIncomingCall(false)
      toast.error('Failed to answer call')
    }
  }

  // End call
  const endCall = () => {
    try {
      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
        localStreamRef.current = null
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      
      // Clear audio elements
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = null
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = null
      }
      
      // Clear crypto keys
      keyPairRef.current = null
      sharedKeyRef.current = null
      
      // Update call session
      if (currentCall) {
        setCurrentCall({
          ...currentCall,
          status: 'disconnected',
          endTime: new Date()
        })
      }
      
      // Notify server
      if (socket && currentCall) {
        socket.emit('voice_call_end', {
          callId: currentCall.id,
          userEmail: userEmail
        })
      }
      
      setIsCallActive(false)
      setIsEncryptionEstablished(false)
      setCallDuration(0)
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
      
      toast.success('Call ended')
      onCallEnd?.()
      
    } catch (error) {
      console.error('Error ending call:', error)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
        toast(audioTrack.enabled ? 'Microphone unmuted' : 'Microphone muted')
      }
    }
  }

  // Toggle speaker
  const toggleSpeaker = () => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !remoteAudioRef.current.muted
      setIsSpeakerOn(!remoteAudioRef.current.muted)
      toast(remoteAudioRef.current.muted ? 'Speaker off' : 'Speaker on')
    }
  }

  // Socket event handlers
  useEffect(() => {
    if (!socket) return

    // Handle incoming call
    socket.on('voice_call_incoming', (data: any) => {
      console.log('Incoming call:', data)
      setIncomingCallData(data)
      setIsIncomingCall(true)
      toast.info(`Incoming call from ${data.callerEmail}`)
    })

    // Handle call answered
    socket.on('voice_call_answered', async (data: any) => {
      console.log('Call answered:', data)
      
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(data.answer)
          await establishEncryptedConnection(data.publicKey)
          
          if (currentCall) {
            setCurrentCall({
              ...currentCall,
              status: 'connected'
            })
          }
          
          toast.success('Call connected')
        }
      } catch (error) {
        console.error('Failed to handle call answer:', error)
        toast.error('Failed to establish call')
      }
    })

    // Handle call ended
    socket.on('voice_call_ended', (data: any) => {
      console.log('Call ended by remote party:', data)
      if (currentCall && currentCall.id === data.callId) {
        endCall()
        toast.info('Call ended by remote party')
      }
    })

    // Handle call rejected
    socket.on('voice_call_rejected', (data: any) => {
      console.log('Call rejected:', data)
      setIsCallActive(false)
      setCurrentCall(null)
      toast.info('Call was rejected')
    })

    // Handle available users
    socket.on('voice_users_available', (users: string[]) => {
      setAvailableUsers(users.filter(email => email !== userEmail))
    })

    return () => {
      socket.off('voice_call_incoming')
      socket.off('voice_call_answered')
      socket.off('voice_call_ended')
      socket.off('voice_call_rejected')
      socket.off('voice_users_available')
    }
  }, [socket, currentCall, userEmail, establishEncryptedConnection])

  // Call duration timer
  useEffect(() => {
    if (isCallActive && currentCall?.status === 'connected') {
      durationIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
    }
  }, [isCallActive, currentCall?.status])

  // Request available users
  useEffect(() => {
    if (socket) {
      socket.emit('voice_get_available_users')
    }
  }, [socket])

  // Play ringtone and show browser notification on incoming call
  useEffect(() => {
    if (isIncomingCall && incomingCallData) {
      // Play ringtone
      if (ringtoneRef.current) {
        ringtoneRef.current.currentTime = 0
        ringtoneRef.current.play().catch(() => {})
      }
      // Show browser notification
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Incoming Call", {
            body: `${incomingCallData.callerEmail} is calling you`,
            icon: "/placeholder-user.jpg"
          })
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("Incoming Call", {
                body: `${incomingCallData.callerEmail} is calling you`,
                icon: "/placeholder-user.jpg"
              })
            }
          })
        }
      }
      // Vibrate on mobile
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300, 100, 300])
      }
    } else {
      // Stop ringtone
      if (ringtoneRef.current) {
        ringtoneRef.current.pause()
        ringtoneRef.current.currentTime = 0
      }
      // Stop vibration
      if (navigator.vibrate) {
        navigator.vibrate(0)
      }
    }
  }, [isIncomingCall, incomingCallData])

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get connection quality color
  const getQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Permission Warnings */}
      {micPermission === 'denied' && (
        <Alert className="bg-red-500/20 border-red-500/20 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Microphone access is required for voice calls. Please allow microphone access in your browser settings and reload the page.
          </AlertDescription>
        </Alert>
      )}
      {notifPermission === 'denied' && (
        <Alert className="bg-yellow-500/20 border-yellow-500/20 text-yellow-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Notification permission is required for incoming call alerts. Please allow notifications in your browser settings for the best experience.
          </AlertDescription>
        </Alert>
      )}
      {/* Block UI if permissions are not granted */}
      {!permissionsOk && (
        <div className="text-center text-white/60 text-lg font-light py-12">
          Voice calling features are disabled until all permissions are granted.
        </div>
      )}
      {/* Ringtone audio element (hidden) */}
      <audio ref={ringtoneRef} src={RINGTONE_URL} loop preload="auto" style={{ display: 'none' }} />
      {/* Shared Key Input UI */}
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Shared Encryption Key
          </CardTitle>
          <CardDescription className="text-white/60">
            Enter or generate a shared key. Both users must use the same key for the call to work.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-2">
          <Input
            type="text"
            value={pendingKey}
            onChange={e => setPendingKey(e.target.value)}
            placeholder="Enter or generate shared key"
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
          <Button
            onClick={() => setPendingKey(nanoid(32))}
            variant="outline"
            className="border-white/20 text-white/60 hover:text-white"
          >
            Generate Key
          </Button>
          <Button
            onClick={() => {
              setSharedKey(pendingKey)
              toast.success('Shared key applied!')
            }}
            variant="default"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={!pendingKey || pendingKey === sharedKey}
          >
            Apply Key
          </Button>
        </CardContent>
      </Card>
      {showKeyWarning && (
        <Alert className="bg-yellow-500/20 border-yellow-500/20 text-yellow-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please set a shared encryption key before starting or answering a call. Both users must use the same key.
          </AlertDescription>
        </Alert>
      )}
      {/* Incoming Call Banner (persistent, fixed at top) */}
      {isIncomingCall && incomingCallData && (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <div className="bg-blue-900/95 border-b-2 border-blue-400 shadow-lg rounded-b-xl px-6 py-4 flex items-center gap-6 max-w-xl w-full mt-0 animate-fade-in-down">
            <img src="/placeholder-user.jpg" alt="Caller" className="w-12 h-12 rounded-full border-2 border-blue-400" />
            <div className="flex-1 min-w-0">
              <div className="text-lg font-semibold text-white truncate">Incoming Call</div>
              <div className="text-sm text-blue-200 truncate">{incomingCallData.callerEmail} is calling you</div>
            </div>
            <Button
              onClick={answerCall}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg shadow"
              size="lg"
            >
              <Phone className="h-4 w-4 mr-2" />Answer
            </Button>
            <Button
              onClick={() => {
                setIsIncomingCall(false)
                setIncomingCallData(null)
                if (socket) {
                  socket.emit('voice_call_reject', {
                    callId: incomingCallData?.callId,
                    userEmail: userEmail
                  })
                }
              }}
              variant="destructive"
              className="font-bold px-4 py-2 rounded-lg shadow"
              size="lg"
            >
              <PhoneOff className="h-4 w-4 mr-2" />Decline
            </Button>
          </div>
        </div>
      )}
      {/* Incoming Call Dialog */}
      <Dialog open={isIncomingCall} onOpenChange={setIsIncomingCall}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-400" />
              Incoming Call
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {incomingCallData?.callerEmail} is calling you
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={answerCall}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Phone className="h-4 w-4 mr-2" />
              Answer
            </Button>
            <Button
              onClick={() => {
                setIsIncomingCall(false)
                setIncomingCallData(null)
                if (socket) {
                  socket.emit('voice_call_reject', {
                    callId: incomingCallData?.callId,
                    userEmail: userEmail
                  })
                }
              }}
              variant="destructive"
              size="lg"
            >
              <PhoneOff className="h-4 w-4 mr-2" />
              Decline
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Interface */}
      {isCallActive && currentCall ? (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-400" />
                Active Call
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={getQualityColor()}>
                  {connectionQuality}
                </Badge>
                {isEncryptionEstablished && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Encrypted
                  </Badge>
                )}
              </div>
            </CardTitle>
            <CardDescription className="text-white/60">
              {currentCall.isInitiator ? currentCall.callee : currentCall.caller}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Call Duration */}
            <div className="flex items-center justify-center gap-2 text-lg font-mono">
              <Clock className="h-4 w-4" />
              {formatDuration(callDuration)}
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={toggleMute}
                variant={isMuted ? "destructive" : "outline"}
                size="lg"
                className="rounded-full w-12 h-12 p-0"
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              <Button
                onClick={endCall}
                variant="destructive"
                size="lg"
                className="rounded-full w-16 h-16 p-0"
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={toggleSpeaker}
                variant={!isSpeakerOn ? "destructive" : "outline"}
                size="lg"
                className="rounded-full w-12 h-12 p-0"
              >
                {!isSpeakerOn ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>

            {/* Audio Elements */}
            <audio ref={localAudioRef} autoPlay muted />
            <audio ref={remoteAudioRef} autoPlay />
          </CardContent>
        </Card>
      ) : (
        /* Call Initiation Interface */
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Voice Call
            </CardTitle>
            <CardDescription className="text-white/60">
              Make secure, encrypted voice calls with other users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Call Target Input */}
            <div className="space-y-2">
              <Input
                placeholder="Enter email to call"
                value={callTarget}
                onChange={(e) => setCallTarget(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button 
                onClick={initiateCall}
                disabled={!callTarget || isCallActive}
                className="w-full"
              >
                <Phone className="h-4 w-4 mr-2" />
                Start Call
              </Button>
            </div>

            {/* Available Users */}
            {availableUsers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Users className="h-4 w-4" />
                  Available Users
                </div>
                <div className="space-y-1">
                  {availableUsers.map((email) => (
                    <Button
                      key={email}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCallTarget(email)}
                      className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {email}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Security Info */}
            <Alert className="bg-green-500/10 border-green-500/20 text-green-400">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All calls are end-to-end encrypted using AES-256 with secure key exchange.
                No audio data or keys are stored on our servers.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 