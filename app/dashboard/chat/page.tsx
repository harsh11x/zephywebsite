"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  User, 
  Users, 
  Plus,
  File as FileIcon,
  Download,
  AlertCircle,
  Key,
  Lock,
  Settings,
  RefreshCw,
  Wifi,
  WifiOff,
  Shield,
  ShieldCheck,
  Upload,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Star,
  QrCode,
  CheckCircle,
  AlertTriangle,
  Info,
  X
} from "lucide-react"
import { MotionDiv, /* MotionH1, MotionP */ } from "@/components/motion"
import { motion } from "framer-motion"
import Header from "@/components/header"
import { io, Socket } from "socket.io-client"
import { toast } from "sonner"
import QRCode from 'qrcode'
import { encryptFile, decryptFile, encryptText, decryptText, generateSecureKey } from "@/lib/crypto"
import GlassPanel from "@/components/GlassPanel"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  type: 'text' | 'file' | 'encrypted_text' | 'encrypted_file'
  fileName?: string
  fileUrl?: string
  encrypted?: boolean
  encryptionKeyId?: string
  decrypted?: boolean
}

interface ChatConnection {
  id: string
  email: string
  isOnline: boolean
  lastSeen?: Date
}

// Add new interface for chat sessions
interface ChatSession {
  connectionId: string
  messages: Message[]
  lastActivity: Date
  unreadCount: number
}

// Helper to get sorted connection id
function getSortedConnectionId(email1: string, email2: string) {
  // Normalize emails to lowercase and trim whitespace for consistent session keys
  return [email1.trim().toLowerCase(), email2.trim().toLowerCase()].sort().join('_');
}

// Helper to merge all messages for a given email across all sessions
function mergeMessagesForEmail(chatSessions: Map<string, ChatSession>, email: string): Message[] {
  let merged: Message[] = [];
  for (const session of chatSessions.values()) {
    if (session.connectionId.includes(email)) {
      merged = merged.concat(session.messages);
    }
  }
  return merged;
}

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connections, setConnections] = useState<ChatConnection[]>([])
  const [selectedConnection, setSelectedConnection] = useState<ChatConnection | null>(null)
  // Replace single messages state with chat sessions
  // chatSessions stores all chat histories per session (per user pair) in a Map.
  // Always use the functional form of setChatSessions to merge updates, never replace the map except on mount restore.
  const [chatSessions, setChatSessions] = useState<Map<string, ChatSession>>(new Map())
  const [newMessage, setNewMessage] = useState("")
  const [connectingEmail, setConnectingEmail] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [pendingKey, setPendingKey] = useState<string>("")
  const [encryptionKey, setEncryptionKey] = useState<string>("")
  const [showClipboardWarning, setShowClipboardWarning] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [showQrCode, setShowQrCode] = useState(false)
  const [keyValidationError, setKeyValidationError] = useState<string>('')
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE_MB = 100
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

  // Helper function to get current chat session
  const getCurrentChatSession = () => {
    if (!selectedConnection || !user) return null;
    const sessionId = getSortedConnectionId(selectedConnection.email, (user as any).email);
    return chatSessions.get(sessionId);
  };

  // Helper function to get current messages
  const getCurrentMessages = () => {
    const session = getCurrentChatSession()
    return session ? session.messages : []
  }

  // Helper function to add message to current chat session
  const addMessageToCurrentSession = (message: Message) => {
    if (!selectedConnection || !user) return

    setChatSessions(prev => {
      const newSessions = new Map(prev)
      const sessionKey = getSortedConnectionId(selectedConnection.email, (user as any).email)
      const currentSession = newSessions.get(sessionKey) || {
        connectionId: sessionKey,
        messages: [],
        lastActivity: new Date(),
        unreadCount: 0
      }
      
      newSessions.set(sessionKey, {
        ...currentSession,
        messages: [...currentSession.messages, message],
        lastActivity: new Date()
      })
      
      return newSessions
    })
  }

  // Helper function to create or get chat session
  const getOrCreateChatSession = (connectionId: string): ChatSession => {
    const sessionKey = connectionId
    const existing = chatSessions.get(sessionKey)
    if (existing) return existing
    
    const newSession: ChatSession = {
      connectionId: sessionKey,
      messages: [],
      lastActivity: new Date(),
      unreadCount: 0
    }
    
    setChatSessions(prev => new Map(prev).set(sessionKey, newSession))
    return newSession
  }

  // Helper function to mark messages as read for a connection
  const markConnectionAsRead = (connectionId: string) => {
    const sessionKey = connectionId
    setChatSessions(prev => {
      const newSessions = new Map(prev)
      const session = newSessions.get(sessionKey)
      if (session) {
        newSessions.set(sessionKey, {
          ...session,
          unreadCount: 0
        })
      }
      return newSessions
    })
  }

  // Helper function to increment unread count for a connection
  const incrementUnreadCount = (connectionId: string) => {
    const sessionKey = connectionId
    setChatSessions(prev => {
      const newSessions = new Map(prev)
      const session = newSessions.get(sessionKey)
      if (session) {
        newSessions.set(sessionKey, {
          ...session,
          unreadCount: session.unreadCount + 1
        })
      }
      return newSessions
    })
  }

  // On mount, load key from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('zephy-single-encryption-key')
    if (savedKey) {
      setEncryptionKey(savedKey)
      setPendingKey(savedKey)
    }
  }, [])

  // Save key to localStorage on change
  useEffect(() => {
    if (encryptionKey) localStorage.setItem('zephy-single-encryption-key', encryptionKey)
  }, [encryptionKey])

  // --- PERSISTENCE: Load chatSessions from localStorage on mount ---
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('zephy-chat-sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        // Convert plain object back to Map
        const restored = new Map<string, ChatSession>(Object.entries(parsed));
        setChatSessions(restored);
      }
    } catch (err) {
      console.error('Failed to load chat sessions from localStorage:', err);
    }
  }, []);

  // --- PERSISTENCE: Save chatSessions to localStorage on every update ---
  useEffect(() => {
    try {
      // Convert Map to plain object for serialization
      const obj: Record<string, ChatSession> = {};
      chatSessions.forEach((session, key) => {
        obj[key] = session;
      });
      localStorage.setItem('zephy-chat-sessions', JSON.stringify(obj));
    } catch (err) {
      console.error('Failed to save chat sessions to localStorage:', err);
    }
  }, [chatSessions]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  // Enhanced socket connection
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
        console.log('✅ Connected to chat server')
        toast.success("Connected to chat server")
      })

      newSocket.on('disconnect', () => {
        setConnectionStatus('disconnected')
        console.log('❌ Disconnected from chat server')
        toast.error("Disconnected from chat server")
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
              console.log(`✅ Connected to chat server via fallback: ${fallbackUrl}`)
              toast.success("Connected to chat server")
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
        console.log('✅ Reconnected to chat server')
        toast.success("Reconnected to chat server")
      })

      newSocket.on('user_connected', (data: { email: string }) => {
        console.log('👤 User connected:', data.email)
        setConnections(prev => 
          prev.map(conn => 
            conn.email === data.email 
              ? { ...conn, isOnline: true }
              : conn
          )
        )
      })

      newSocket.on('user_disconnected', (data: { email: string }) => {
        console.log('👤 User disconnected:', data.email)
        setConnections(prev => 
          prev.map(conn => 
            conn.email === data.email 
              ? { ...conn, isOnline: false, lastSeen: new Date() }
              : conn
          )
        )
      })

      newSocket.on('message_received', async (message: Message) => {
        console.log('📨 Message received:', message)
        let displayMessage = { ...message };
        // Attempt to decrypt if encrypted
        if (message.encrypted && message.type === 'encrypted_text' && message.content) {
          try {
            const decryptedContent = await decryptText(message.content, encryptionKey);
            displayMessage = {
              ...message,
              content: decryptedContent,
              decrypted: true
            };
          } catch (err) {
            displayMessage = {
              ...message, 
              content: '[Encrypted message - decryption failed]',
              decrypted: false 
            };
          }
        }
        
        // Find the connection ID for this sender
        let senderConnection = connections.find(conn => conn.email === message.sender)
        if (!senderConnection) {
          // Always generate id as sorted emails
          const newConnection = {
            id: getSortedConnectionId(message.sender, (user as any).email),
            email: message.sender,
            isOnline: true,
            lastSeen: new Date()
          }
          setConnections(prev => {
            // Remove any existing connection with the same email, then add the new one
            const filtered = prev.filter(conn => conn.email !== message.sender)
            // Migrate chat session if needed
            setChatSessions(prevSessions => {
              let foundSessionId = null;
              for (const [id, session] of prevSessions.entries()) {
                if (session.connectionId !== newConnection.id && session.connectionId.includes(message.sender)) {
                  foundSessionId = id;
                  break;
          }
        }
              if (foundSessionId) {
                const oldSession = prevSessions.get(foundSessionId);
                const newSessions = new Map(prevSessions);
                newSessions.delete(foundSessionId);
                // Merge messages if new session already exists
                const existing = newSessions.get(newConnection.id);
                newSessions.set(newConnection.id, {
                  connectionId: newConnection.id,
                  messages: [...(existing?.messages || []), ...(oldSession?.messages || [])],
                  lastActivity: new Date(),
                  unreadCount: 0
                });
                return newSessions;
              }
              return prevSessions;
            });
            return [...filtered, newConnection]
          })
          senderConnection = newConnection
          console.log('➕ Auto-added connection for sender:', message.sender)
        }
        // If still not found, return early to avoid undefined errors
        if (!senderConnection) return;
        
        // Create or get the chat session for this connection
        const session = getOrCreateChatSession(senderConnection.id)
        
        // Add the decrypted message to the correct session
        setChatSessions(prev => {
          const sessionId = getSortedConnectionId(message.sender, (user as any).email);
          const currentSession = prev.get(sessionId) || {
            connectionId: sessionId,
            messages: [],
            lastActivity: new Date(),
            unreadCount: 0
          };
          // Append the new message to the existing messages array
          const updatedMessages = [...currentSession.messages, displayMessage];
          const newSessions = new Map(prev);
          newSessions.set(sessionId, {
            ...currentSession,
            messages: updatedMessages,
            lastActivity: new Date(),
            unreadCount: currentSession.unreadCount + 1
          });
          console.log('After setChatSessions (message_received):', [...newSessions.keys()], newSessions);
          return newSessions;
        });
      })

      newSocket.on('file_received', async (message: Message) => {
        console.log('📁 File received:', message)
        
        // Find the connection ID for this sender
        const senderConnection = connections.find(conn => conn.email === message.sender)
        if (!senderConnection) {
          console.log('❌ No connection found for sender:', message.sender)
          return
        }
        
        // Create or get the chat session for this connection
        const session = getOrCreateChatSession(senderConnection.id)
        
        // Always try to decrypt if the file is encrypted
        if (message.encrypted && message.type === 'encrypted_file' && message.fileUrl) {
          try {
            console.log('🔓 Attempting to decrypt file with key:', encryptionKey)
            
            // Convert base64 to Blob
            const base64 = message.fileUrl.split(',')[1]
            const byteCharacters = atob(base64)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: 'application/octet-stream' })
            const file = new File([blob], message.fileName || 'encrypted_file.enc', { type: 'application/octet-stream' })
            
            const result = await decryptFile(file, encryptionKey)
            const decryptedUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(result.blob)
            })
            
            console.log('✅ File decrypted successfully:', result.originalName)
            
            // Add decrypted file to the correct session
            setChatSessions(prev => {
              const sessionId = getSortedConnectionId(message.sender, (user as any).email);
              const currentSession = prev.get(sessionId) || {
                connectionId: sessionId,
                messages: [],
                lastActivity: new Date(),
                unreadCount: 0
              };
              // Append the new message to the existing messages array
              const updatedMessages = [...currentSession.messages, message];
              const newSessions = new Map(prev);
              newSessions.set(sessionId, {
                ...currentSession,
                messages: updatedMessages,
                lastActivity: new Date(),
                unreadCount: currentSession.unreadCount + 1
              });
              console.log('After setChatSessions (file_received):', [...newSessions.keys()], newSessions);
              return newSessions;
            })
            toast.success(`Received decrypted file: ${result.originalName}`)
            return
          } catch (err) {
            console.log('❌ File decryption failed:', err)
            // Add encrypted file with error to the correct session
            setChatSessions(prev => {
              const sessionId = getSortedConnectionId(message.sender, (user as any).email);
              const currentSession = prev.get(sessionId) || {
                connectionId: sessionId,
                messages: [],
                lastActivity: new Date(),
                unreadCount: 0
              };
              // Append the new message to the existing messages array
              const updatedMessages = [...currentSession.messages, message];
              const newSessions = new Map(prev);
              newSessions.set(sessionId, {
                ...currentSession,
                messages: updatedMessages,
                lastActivity: new Date(),
                unreadCount: currentSession.unreadCount + 1
              });
              console.log('After setChatSessions (file_received):', [...newSessions.keys()], newSessions);
              return newSessions;
            })
            toast.error("Failed to decrypt file")
            return
          }
        }
        
        // Handle plain files - add to correct session
        console.log('📁 Adding plain file to chat session:', senderConnection.id)
        setChatSessions(prev => {
          const sessionId = getSortedConnectionId(message.sender, (user as any).email);
          const currentSession = prev.get(sessionId) || {
            connectionId: sessionId,
            messages: [],
            lastActivity: new Date(),
            unreadCount: 0
          };
          // Append the new message to the existing messages array
          const updatedMessages = [...currentSession.messages, message];
          const newSessions = new Map(prev);
          newSessions.set(sessionId, {
            ...currentSession,
            messages: updatedMessages,
            lastActivity: new Date(),
            unreadCount: currentSession.unreadCount + 1
          });
          console.log('After setChatSessions (file_received):', [...newSessions.keys()], newSessions);
          return newSessions;
        })
        toast.success(`Received file: ${message.fileName}`)
      })

      newSocket.on('connection_established', (connection: ChatConnection) => {
        console.log('🤝 Connection established with:', connection.email)
        setConnections(prev => [...prev, connection])
        
        // Create a new chat session for this connection
        getOrCreateChatSession(connection.id)
        
        toast.success(`Connected with ${connection.email}`)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [user, encryptionKey])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatSessions]) // Changed dependency to chatSessions

  const connectToUser = async () => {
    if (!connectingEmail || !socket || !encryptionKey) return
    setIsConnecting(true)
    try {
      // Always use sorted id for consistency
      const connectionId = getSortedConnectionId(connectingEmail, (user as any).email)
      socket.emit('connect_to_user', { targetEmail: connectingEmail })
      setConnections(prev => {
        // Remove any existing connection with the same email, then add the new one
        const filtered = prev.filter(conn => conn.email !== connectingEmail)
        const newConn = {
          id: connectionId,
          email: connectingEmail,
          isOnline: true,
          lastSeen: new Date()
        }
        // Migrate chat session if needed
        setChatSessions(prevSessions => {
          let foundSessionId = null;
          for (const [id, session] of prevSessions.entries()) {
            if (session.connectionId !== newConn.id && session.connectionId.includes(connectingEmail)) {
              foundSessionId = id;
              break;
            }
          }
          if (foundSessionId) {
            const oldSession = prevSessions.get(foundSessionId);
            const newSessions = new Map(prevSessions);
            newSessions.delete(foundSessionId);
            // Merge messages if new session already exists
            const existing = newSessions.get(newConn.id);
            newSessions.set(newConn.id, {
              connectionId: newConn.id,
              messages: [...(existing?.messages || []), ...(oldSession?.messages || [])],
              lastActivity: new Date(),
              unreadCount: 0
            });
            return newSessions;
          }
          return prevSessions;
        });
        return [...filtered, newConn];
      })
      setConnectingEmail("")
    } catch (error) {
      toast.error("Failed to connect to user")
    } finally {
      setIsConnecting(false)
    }
  }

  // Enhanced sendMessage with robust key validation
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConnection || !socket || !user) return

    console.log('📤 Sending message to:', selectedConnection.email)
    console.log('🔐 Encryption enabled:', encryptionKey)
    console.log('🔑 Selected key:', encryptionKey)

    let content = newMessage
    let type: 'text' | 'encrypted_text' = 'text'
    let encrypted = false
    let encryptionKeyId = undefined

    // Always encrypt if encryption is enabled
    if (encryptionKey) {
      try {
        console.log('�� Encrypting message with key:', encryptionKey)
        console.log('🔑 Key details:', { key: encryptionKey })
        content = await encryptText(newMessage, encryptionKey)
        type = 'encrypted_text'
        encrypted = true
        encryptionKeyId = encryptionKey
        console.log('✅ Message encrypted successfully')
        console.log('📤 Sending with encryption key id:', encryptionKeyId)
      } catch (error) {
        console.log('❌ Encryption failed:', error)
        toast.error("Failed to encrypt message, sending as plain text")
        // Continue with plain text
      }
    }

    const message: Message = {
      id: Date.now().toString(),
      sender: (user as any).email,
      content,
      timestamp: new Date(),
      type,
      encrypted,
      encryptionKeyId
    }

    console.log('📤 Emitting message:', message)
    socket.emit('send_message', {
      targetEmail: selectedConnection.email,
      message
    })

    // Add the original plain text message to the chat for the sender
      setChatSessions(prev => {
        const sessionKey = getSortedConnectionId(selectedConnection.email, (user as any).email)
        const currentSession = prev.get(sessionKey) || {
          connectionId: sessionKey,
          messages: [],
          lastActivity: new Date(),
          unreadCount: 0
        }
      
      const updatedMessages = [...currentSession.messages, {
      ...message,
      content: newMessage, // Show plain text to sender
      decrypted: true
        }];
      const newSessions = new Map(prev);
      newSessions.set(sessionKey, {
        ...currentSession,
        messages: updatedMessages,
        lastActivity: new Date()
      })
      
      return newSessions
    })
    setNewMessage("")
  }

  // Enhanced sendFile with robust key validation
  const sendFile = async (file: File) => {
    if (!selectedConnection || !socket || !user) return

    console.log('📁 Sending file to:', selectedConnection.email)
    console.log('🔐 Encryption enabled:', encryptionKey)
    console.log('🔑 Selected key:', encryptionKey)

    setIsUploadingFile(true)

    try {
      let fileData: string
      let encrypted = false
      let encryptionKeyId: string | undefined = undefined
      let fileName = file.name
      let type: 'file' | 'encrypted_file' = 'file'

      // Always encrypt if encryption is enabled
      if (encryptionKey) {
        try {
          console.log('🔓 Encrypting file with key:', encryptionKey)
          const result = await encryptFile(file, encryptionKey)
          fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(result.blob)
          })
          encrypted = true
          encryptionKeyId = encryptionKey
          const baseName = file.name.replace(/\.[^/.]+$/, "")
          fileName = baseName + ".enc"
          type = 'encrypted_file'
          console.log('✅ File encrypted successfully')
        } catch (error) {
          console.log('❌ File encryption failed:', error)
          toast.error("Failed to encrypt file, sending as plain file")
          // Continue with plain file
          fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        }
      } else {
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      const message: Message = {
        id: Date.now().toString(),
        sender: (user as any).email,
        content: `File: ${file.name}`,
        timestamp: new Date(),
        type,
        fileName,
        fileUrl: fileData,
        encrypted,
        encryptionKeyId
      }

      console.log('📁 Emitting file:', message)
      socket.emit('send_file', {
        targetEmail: selectedConnection.email,
        message
      })

      // Add the original file message to the chat for the sender
      setChatSessions(prev => {
        const sessionKey = getSortedConnectionId(selectedConnection.email, (user as any).email)
        const currentSession = prev.get(sessionKey) || {
          connectionId: sessionKey,
          messages: [],
          lastActivity: new Date(),
          unreadCount: 0
        }
        
        const updatedMessages = [...currentSession.messages, {
        ...message,
        fileName: file.name, // Show original filename to sender
        decrypted: true
          }];
        const newSessions = new Map(prev);
        newSessions.set(sessionKey, {
          ...currentSession,
          messages: updatedMessages,
          lastActivity: new Date()
        })
        
        return newSessions
      })
      toast.success("File sent successfully")
    } catch (error) {
      console.log('❌ File send failed:', error)
      toast.error("Failed to send file")
    } finally {
      setIsUploadingFile(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`File is too large. Max allowed size is ${MAX_FILE_SIZE_MB}MB.`)
        return
      }
      sendFile(file)
    }
  }

  const downloadFile = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("File downloaded successfully")
  }

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

  const disconnectFromUser = async () => {
    if (!selectedConnection || !socket || !user) return;

    try {
      setConnections(prev => prev.filter(conn => conn.id !== selectedConnection.id));
      setSelectedConnection(null);
      setChatSessions(prev => {
        const newSessions = new Map(prev);
        const sessionKey = getSortedConnectionId(selectedConnection.email, (user as any).email);
        newSessions.delete(sessionKey);
        return newSessions;
      });
      socket.emit('disconnect_from_user', { targetEmail: selectedConnection.email });
      toast.success(`Disconnected from ${selectedConnection.email}`);
    } catch (error) {
      toast.error("Failed to disconnect from user");
    }
  };

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
      <div className="h-8" />

      <main className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 w-full mx-auto h-[600px] max-h-[70vh]">
          {/* Sidebar: Connections */}
          <div className="frosted-glass lg:col-span-1 h-full p-0">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                  <span className="text-lg sm:text-xl">Connections</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getConnectionStatusIcon()}
                    <Badge variant="secondary" className={
                      connectionStatus === 'connected' ? "bg-green-500/20 text-green-400" :
                      connectionStatus === 'connecting' ? "bg-yellow-500/20 text-yellow-400" :
                      connectionStatus === 'error' ? "bg-red-500/20 text-red-400" :
                      "bg-gray-500/20 text-gray-400"
                    }>
                      {getConnectionStatusText()}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-6 px-6">
              <div className="space-y-3">
                  <Input
                    placeholder="Enter email to connect"
                    value={connectingEmail}
                    onChange={(e) => setConnectingEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 text-base"
                  />
                  <Button 
                    onClick={connectToUser}
                    disabled={!connectingEmail || isConnecting || connectionStatus !== 'connected' || !encryptionKey}
                  className="w-full h-12 text-base"
                  >
                    {isConnecting ? "Connecting..." : <><Plus className="h-4 w-4 mr-2" />Connect</>}
                  </Button>
                </div>

                <Separator className="bg-white/10" />

              <ScrollArea className="h-[400px]">
                <div className="space-y-3 pr-4">
                    {connections.length === 0 ? (
                    <div className="text-center">
                      <Users className="h-8 w-8 text-white/20 mx-auto mb-3" />
                      <p className="text-white/40 text-sm">
                        No connections yet. Add someone by email to start chatting.
                      </p>
                    </div>
                    ) : (
                    // Deduplicate connections by id before rendering
                    Array.from(new Map(connections.map(conn => [conn.id, conn])).values()).map((connection: ChatConnection) => (
                        <div
                          key={connection.id}
                        className={`p-4 rounded-xl transition-all ${
                            selectedConnection?.id === connection.id
                              ? 'bg-white/20 border border-white/20'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div 
                            className="flex items-center gap-3 cursor-pointer flex-1"
                            onClick={() => {
                              setSelectedConnection(connection)
                              markConnectionAsRead(connection.id)
                            }}
                            >
                            <User className="h-5 w-5" />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{connection.email}</div>
                              {/* Show last message preview */}
                              {(() => {
                                const session = chatSessions.get(connection.id)
                                if (session && session.messages.length > 0) {
                                  const lastMessage = session.messages[session.messages.length - 1]
                                  return (
                                    <div className="text-xs text-white/60 truncate mt-1">
                                      {lastMessage.type === 'file' || lastMessage.type === 'encrypted_file' 
                                        ? `📁 ${lastMessage.fileName || 'File'}`
                                        : lastMessage.content.length > 30 
                                          ? lastMessage.content.substring(0, 30) + '...'
                                          : lastMessage.content
                                      }
                            </div>
                                  )
                                }
                                return null
                              })()}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                              {connection.isOnline ? (
                              <div className="w-3 h-3 bg-green-400 rounded-full" />
                              ) : (
                              <div className="w-3 h-3 bg-gray-400 rounded-full" />
                              )}
                            {/* Show unread count badge */}
                            {(() => {
                              const session = chatSessions.get(connection.id)
                              return session && session.unreadCount > 0 ? (
                                <Badge variant="destructive" className="text-xs px-2 py-1 min-w-[24px] h-6">
                                  {session.unreadCount > 99 ? '99+' : session.unreadCount}
                                </Badge>
                              ) : null
                            })()}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Disconnect from this specific user
                                  setConnections(prev => prev.filter(conn => conn.id !== connection.id))
                                  if (selectedConnection?.id === connection.id) {
                                    setSelectedConnection(null)
                                  // Clear messages for the disconnected user
                                  setChatSessions(prev => {
                                    const newSessions = new Map(prev)
                                    newSessions.delete(connection.id)
                                    return newSessions
                                  })
                                  }
                                  socket?.emit('disconnect_from_user', { targetEmail: connection.email })
                                  toast.success(`Disconnected from ${connection.email}`)
                                }}
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                              <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
          </div>
          {/* Main Chat Area */}
          <div className="frosted-glass lg:col-span-3 h-full p-0">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                  <span className="text-lg sm:text-xl">
                    {selectedConnection ? `Chat with ${selectedConnection.email}` : 'Select a connection to start chatting'}
                  </span>
                  </div>
                <div className="flex items-center gap-3">
                    {selectedConnection && (
                      <Badge variant="secondary" className={selectedConnection.isOnline ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                        {selectedConnection.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    )}
                    {selectedConnection && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={disconnectFromUser}
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <WifiOff className="h-4 w-4" />
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="border-white/20 text-white/60 hover:text-white">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Encryption Settings
                          </DialogTitle>
                          <DialogDescription className="text-white/60">
                            Manage encryption keys and settings for secure communication
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Key Input */}
                          <div className="w-full flex flex-col md:flex-row items-center gap-2 bg-black/80 border-b border-white/10 p-4">
                            <Input
                              type="text"
                              value={pendingKey}
                              onChange={e => setPendingKey(e.target.value)}
                              placeholder="Enter or generate encryption key"
                              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                            />
                            <Button
                              onClick={() => setPendingKey(generateSecureKey(32))}
                              variant="outline"
                              className="border-white/20 text-white/60 hover:text-white"
                            >
                              Generate Key
                            </Button>
                            <Button
                              onClick={() => {
                                setEncryptionKey(pendingKey)
                                toast.success('Encryption key applied!')
                              }}
                              variant="default"
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              disabled={!pendingKey || pendingKey === encryptionKey}
                            >
                              Apply Key
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4 px-6">
                {selectedConnection ? (
                  <>
                  <ScrollArea className="h-[400px] border border-white/10 rounded-lg p-6">
                    <div className="space-y-6">
                      {getCurrentMessages().length === 0 ? (
                        <div className="text-white/40 text-sm text-center py-12">
                            No messages yet. Start the conversation!
                        </div>
                        ) : (
                        getCurrentMessages().map((message) => {
                            const isSender = message.sender === (user as any).email;
                            const initials = message.sender
                              ? message.sender.split("@")[0].slice(0, 2).toUpperCase()
                              : "U";
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                              >
                              <div className={`flex items-end gap-3 max-w-md lg:max-w-lg xl:max-w-xl ${isSender ? 'flex-row-reverse' : ''}`}>
                                  {/* Avatar/Initials */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${isSender ? 'bg-blue-600' : 'bg-gray-700'}`}>{initials}</div>
                                  {/* Chat Bubble */}
                                <div className={`p-4 rounded-2xl shadow-md ${isSender ? 'bg-blue-500/80 text-white' : 'bg-white/10 text-white'} relative`}>
                                    {/* Message Content */}
                                  <div className="text-base break-words">
                                      {/* --- Modern File Bubble --- */}
                                      {message.type === 'file' || message.type === 'encrypted_file' ? (
                                        <div className="flex items-center gap-3">
                                        <FileIcon className="h-6 w-6 text-blue-400 flex-shrink-0" />
                                        <span className="truncate max-w-[200px]" title={message.fileName}>{message.fileName}</span>
                                          {message.decrypted === false ? (
                                            <span className="text-xs text-red-400 ml-2">{message.content || 'Decryption failed'}</span>
                                          ) : message.fileUrl ? (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="border-blue-400/30 text-blue-400 hover:bg-blue-500/10 ml-2"
                                              onClick={() => downloadFile(message.fileUrl!, message.fileName!)}
                                            >
                                              <Download className="h-4 w-4 mr-1" />
                                              Download
                                            </Button>
                                          ) : (
                                            <span className="text-xs text-white/40 ml-2">Decrypting...</span>
                                          )}
                                        </div>
                                      ) : (
                                        <span>{message.content}</span>
                                      )}
                                    </div>
                                    {/* Timestamp */}
                                  <div className="text-xs text-white/60 mt-2 text-right">
                                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                  <div className="flex gap-3">
                    {/* Action Cards Section - only show if no connection is selected */}
                    {!selectedConnection && (
                      <div className="w-full flex flex-col items-center justify-center mt-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl w-full">
                          {/* Connect Card */}
                          <div className="frosted-glass group cursor-pointer h-full transition-transform duration-300 hover:scale-105">
                            <div className="flex flex-col h-full justify-between items-center p-6">
                              <div className="p-3 rounded-lg bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-sm w-fit group-hover:scale-110 transition-transform mb-4">
                                <Users className="h-6 w-6 text-white" />
                              </div>
                              <div className="text-lg font-light text-white mb-2">Connect</div>
                              <div className="text-sm text-white/60 font-light mb-4 text-center">Add a user by email to start a secure chat connection.</div>
                              <div className="w-full flex flex-col gap-2">
                                <Input
                                  placeholder="Enter email to connect"
                                  value={connectingEmail}
                                  onChange={(e) => setConnectingEmail(e.target.value)}
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 text-base"
                                />
                                <Button 
                                  onClick={connectToUser}
                                  disabled={!connectingEmail || isConnecting || connectionStatus !== 'connected' || !encryptionKey}
                                  className="w-full h-12 text-base"
                                >
                                  {isConnecting ? "Connecting..." : <><Plus className="h-4 w-4 mr-2" />Connect</>}
                                </Button>
                              </div>
                            </div>
                          </div>
                          {/* Attach File Card */}
                          <div className="frosted-glass group cursor-pointer h-full transition-transform duration-300 hover:scale-105">
                            <div className="flex flex-col h-full justify-between items-center p-6">
                              <div className="p-3 rounded-lg bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-sm w-fit group-hover:scale-110 transition-transform mb-4">
                                <Paperclip className="h-6 w-6 text-white" />
                              </div>
                              <div className="text-lg font-light text-white mb-2">Attach File</div>
                              <div className="text-sm text-white/60 font-light mb-4 text-center">Send encrypted files to your connections securely.</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingFile}
                                className="border-white/20 text-white/60 hover:text-white h-12 px-4 w-full"
                        title={`Attach file (max ${MAX_FILE_SIZE_MB}MB)`}
                      >
                        {isUploadingFile ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                                  <span className="flex items-center justify-center"><Paperclip className="h-5 w-5 mr-2" />Attach</span>
                        )}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* End Action Cards Section */}

                      <div className="flex-1 relative">
                        <Textarea
                          placeholder={encryptionKey ? "Type your encrypted message..." : "Type your message..."}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                        className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none pr-12 h-12 text-base"
                          rows={1}
                        />
                        {encryptionKey && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Lock className="h-5 w-5 text-blue-400" />
                          </div>
                        )}
                      </div>
                    <Button onClick={sendMessage} disabled={!newMessage.trim()} className="h-12 px-6">
                      <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                <div className="flex items-center justify-center h-[400px]">
                    <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 text-base">Select a connection from the left panel to start chatting</p>
                    </div>
                  </div>
                )}
              </CardContent>
          </div>
        </div>
      </main>

      {/* QR Code Dialog */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Share Key via QR Code
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Scan this QR code to import the encryption key on another device
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            {qrCodeDataUrl && (
              <img src={qrCodeDataUrl} alt="QR Code" className="border border-white/20 rounded-lg" />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Clipboard Warning */}
      {showClipboardWarning && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className="bg-yellow-500/20 border-yellow-500/20 text-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Key copied to clipboard. Remember to clear it for security!
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
} 