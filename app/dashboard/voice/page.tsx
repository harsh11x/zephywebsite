"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Phone, 
  Shield, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Users,
  Lock,
  Key,
  Settings,
  Volume2,
  Mic,
  Clock
} from "lucide-react"
import { MotionDiv } from "@/components/motion"
import { motion } from "framer-motion"
import Header from "@/components/header"
import VoiceCall from "@/components/voice-call"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"
import GlassPanel from "@/components/GlassPanel"

export default function VoiceCallPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [callStats, setCallStats] = useState({
    totalCalls: 0,
    totalDuration: 0,
    encryptedCalls: 0,
    videoCalls: 0
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      setConnectionStatus('connecting')
      
      // Smart connection logic: use HTTPS for deployed site, HTTP for localhost
      const getServerUrl = () => {
        if (process.env.NEXT_PUBLIC_CHAT_SERVER_URL) {
          return process.env.NEXT_PUBLIC_CHAT_SERVER_URL;
        }
        
        // If running on localhost, use HTTP
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          return 'http://localhost:3001';
        }
        
        // For deployed site, try HTTPS first, then HTTP
        return 'https://3.111.208.77:3001';
      };

      // Fallback URLs in order of preference
      const fallbackUrls = [
        'http://chat.zephyrnsecurities.com:3001',
        'http://3.111.208.77:3001'
      ];

      const newSocket = io(
        getServerUrl(),
        {
          auth: {
            email: (user as any).email,
            userId: (user as any).id
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000
        }
      )

      newSocket.on('connect', () => {
        setConnectionStatus('connected')
        console.log('✅ Connected to voice call server')
        toast.success("Connected to voice call server")
      })

      newSocket.on('disconnect', () => {
        setConnectionStatus('disconnected')
        console.log('❌ Disconnected from voice call server')
        toast.error("Disconnected from voice call server")
      })

      newSocket.on('connect_error', (error) => {
        console.log('❌ Connection error:', error)
        
        // If connection failed and we're on deployed site, try fallback URLs
        if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
          console.log('🔄 Trying fallback URLs...')
          newSocket.disconnect()
          
          // Try each fallback URL
          let currentFallbackIndex = 0;
          
          const tryNextFallback = () => {
            if (currentFallbackIndex >= fallbackUrls.length) {
              setConnectionStatus('error')
              toast.error('All connection attempts failed')
              return
            }
            
            const fallbackUrl = fallbackUrls[currentFallbackIndex]
            console.log(`🔄 Trying fallback ${currentFallbackIndex + 1}: ${fallbackUrl}`)
            
            const fallbackSocket = io(fallbackUrl, {
              auth: {
                email: (user as any).email,
                userId: (user as any).id
              },
              reconnection: true,
              reconnectionAttempts: 2,
              reconnectionDelay: 1000,
              timeout: 8000
            })
            
            fallbackSocket.on('connect', () => {
              setConnectionStatus('connected')
              console.log(`✅ Connected to voice call server via fallback: ${fallbackUrl}`)
              toast.success("Connected to voice call server")
              setSocket(fallbackSocket)
            })
            
            fallbackSocket.on('connect_error', (fallbackError) => {
              console.log(`❌ Fallback ${currentFallbackIndex + 1} failed:`, fallbackError)
              fallbackSocket.disconnect()
              currentFallbackIndex++
              setTimeout(tryNextFallback, 1000) // Try next fallback after 1 second
            })
          }
          
          tryNextFallback()
          return
        }
        
        setConnectionStatus('error')
        toast.error(`Connection failed: ${error.message}`)
      })

      newSocket.on('reconnect', () => {
        setConnectionStatus('connected')
        console.log('✅ Reconnected to voice call server')
        toast.success("Reconnected to voice call server")
      })

      // Voice call specific events
      newSocket.on('voice_call_stats', (stats) => {
        setCallStats(stats)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [user])

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4 text-green-400" />
      case 'connecting':
        return <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected'
      case 'connecting':
        return 'Connecting...'
      case 'error':
        return 'Connection Error'
      default:
        return 'Disconnected'
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <Header />

      <main className="container py-20">
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              {...{ className: "text-4xl font-light tracking-tight mb-4" }}
            >
              Secure Voice & Video Calling
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              {...{ className: "text-lg text-white/60 font-light" }}
            >
              End-to-end encrypted voice and video calls with AES-256 encryption and secure key exchange
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Voice Call Interface */}
            <div className="lg:col-span-2">
              <div className="frosted-glass h-full">
                <VoiceCall 
                  userEmail={(user as any).email}
                  socket={socket}
                  onCallEnd={() => {
                    // Update stats when call ends
                    if (socket) {
                      socket.emit('voice_get_stats')
                    }
                  }}
                />
              </div>
            </div>

            {/* Call Statistics & Info */}
            <div className="space-y-6">
              {/* Connection Status */}
              <Card className="glass-neon">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-5 w-5" />
                      Connection Status
                    </div>
                    <Badge variant="secondary" className={
                      connectionStatus === 'connected' ? "bg-green-500/20 text-green-400" :
                      connectionStatus === 'connecting' ? "bg-yellow-500/20 text-yellow-400" :
                      connectionStatus === 'error' ? "bg-red-500/20 text-red-400" :
                      "bg-gray-500/20 text-gray-400"
                    }>
                      {getConnectionStatusText()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getConnectionStatusIcon()}
                    <span className="text-sm text-white/60">
                      {connectionStatus === 'connected' ? 'Ready for secure calls' :
                       connectionStatus === 'connecting' ? 'Establishing connection...' :
                       connectionStatus === 'error' ? 'Connection failed' :
                       'Not connected'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Call Statistics */}
              <Card className="glass-neon">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Call Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{callStats.totalCalls}</div>
                      <div className="text-xs text-white/60">Total Calls</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{formatDuration(callStats.totalDuration)}</div>
                      <div className="text-xs text-white/60">Total Duration</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{callStats.encryptedCalls}</div>
                      <div className="text-xs text-white/60">Encrypted Calls</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{callStats.videoCalls}</div>
                      <div className="text-xs text-white/60">Video Calls</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Features */}
              <Card className="glass-neon">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">AES-256-GCM Encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">ECDH Key Exchange</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">WebRTC P2P Connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">No Server Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Real-time Audio/Video Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">Video Call Support</span>
                  </div>
                </CardContent>
              </Card>

              {/* Call Quality Info */}
              <Card className="glass-neon">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Call Quality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Audio Codec</span>
                    <span className="text-sm font-mono">Opus</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Sample Rate</span>
                    <span className="text-sm font-mono">48kHz</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Echo Cancellation</span>
                    <span className="text-sm text-green-400">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Noise Suppression</span>
                    <span className="text-sm text-green-400">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Auto Gain Control</span>
                    <span className="text-sm text-green-400">Enabled</span>
                  </div>
                </CardContent>
              </Card>

              {/* Security Alert */}
              <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  All voice calls are end-to-end encrypted. Your audio is never stored on our servers and cannot be intercepted.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </MotionDiv>
      </main>
    </div>
  )
} 