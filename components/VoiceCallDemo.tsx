"use client"

import { useState } from "react"
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Mail, Shield, Lock } from "lucide-react"

export default function VoiceCallDemo() {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callStatus, setCallStatus] = useState("idle") // idle, key-exchange, connecting, connected
  const [participantEmail, setParticipantEmail] = useState("")
  const [encryptionKey, setEncryptionKey] = useState("")
  const [showKeyExchange, setShowKeyExchange] = useState(false)
  const [generatedKey, setGeneratedKey] = useState("")

  const generateKey = () => {
    const key = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => 
      byte.toString(16).padStart(2, '0')
    ).join('')
    setGeneratedKey(key)
    setEncryptionKey(key)
    setShowKeyExchange(true)
  }

  const startCall = () => {
    if (!participantEmail.trim()) {
      alert("Please enter participant email")
      return
    }
    if (!encryptionKey.trim()) {
      alert("Please generate or enter encryption key")
      return
    }
    setCallStatus("key-exchange")
    setTimeout(() => {
      setCallStatus("connecting")
      setTimeout(() => {
        setCallStatus("connected")
        setIsCallActive(true)
      }, 2000)
    }, 3000)
  }

  const endCall = () => {
    setIsCallActive(false)
    setCallStatus("idle")
    setIsMuted(false)
    setIsVideoOff(false)
  }

  return (
    <div className="elevated-card outline-glow p-8">
      <div className="text-center mb-8">
        <h3 className="text-white text-3xl flex items-center justify-center gap-3 mb-4">
          <Phone className="w-8 h-8" />
          Encrypted Voice & Video Call Demo
        </h3>
        <p className="text-white/70 text-lg">
          End-to-end encrypted calls using only email addresses. No SIM, no phone numbers.
        </p>
      </div>

      {/* Call Setup */}
      {!isCallActive && (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <label className="block text-sm text-white/70 mb-3">Enter participant email address</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-md pl-10 pr-4 py-3 text-white font-mono"
                  placeholder="participant@example.com"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                />
              </div>
              <button 
                onClick={startCall}
                disabled={callStatus === "connecting" || callStatus === "key-exchange"}
                className="button-primary flex items-center gap-2 px-6 py-3"
              >
                <Phone className="w-5 h-5" />
                {callStatus === "connecting" ? "Connecting..." : 
                 callStatus === "key-exchange" ? "Exchanging Keys..." : "Start Call"}
              </button>
            </div>
          </div>

          {/* Encryption Key Setup */}
          <div className="mb-6">
            <label className="block text-sm text-white/70 mb-3">Encryption Key (AES-256)</label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-md pl-10 pr-4 py-3 text-white font-mono text-sm"
                  placeholder="Enter or generate encryption key..."
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                />
              </div>
              <button 
                onClick={generateKey}
                className="button-outline flex items-center gap-2 px-4 py-3"
              >
                <Lock className="w-4 h-4" />
                Generate Key
              </button>
            </div>
            <p className="text-xs text-white/50 mt-2">
              This key will be used to encrypt all voice/video data. Share it securely with the participant.
            </p>
          </div>

          {/* Key Exchange Status */}
          {showKeyExchange && (
            <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-blue-400" />
                <h4 className="text-blue-400 font-medium">Generated Encryption Key</h4>
              </div>
              <div className="bg-black/20 border border-white/10 rounded p-3 mb-3">
                <code className="text-white font-mono text-sm break-all">{generatedKey}</code>
              </div>
              <p className="text-blue-300/80 text-sm">
                ⚠️ Share this key securely with {participantEmail} before starting the call.
                This key encrypts all voice and video data end-to-end.
              </p>
            </div>
          )}

          {/* Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="text-white font-medium mb-1">End-to-End Encrypted</h4>
              <p className="text-white/60 text-sm">AES-256 encryption for all media</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <Mail className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="text-white font-medium mb-1">Email Identity</h4>
              <p className="text-white/60 text-sm">No phone numbers required</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
              <Lock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="text-white font-medium mb-1">Anonymous</h4>
              <p className="text-white/60 text-sm">No SIM cards needed</p>
            </div>
          </div>

          {/* Call Process Explanation */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              How it works:
            </h4>
            <div className="space-y-3 text-white/70 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5">1</div>
                <p>Enter participant's email address to initiate call</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5">2</div>
                <p>Client-side key exchange using email as identity</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5">3</div>
                <p>Media encrypted with SRTP before transmission</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5">4</div>
                <p>End-to-end encrypted voice/video communication</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Call Interface */}
      {isCallActive && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-white font-medium">Call with {participantEmail}</h4>
                <p className="text-green-400 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Connected & Encrypted
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-sm">Call Duration</p>
                <p className="text-white font-mono">02:34</p>
              </div>
            </div>
            
            {/* Video Placeholder */}
            <div className="bg-black/50 border border-white/10 rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <Video className="w-16 h-16 text-white/40 mx-auto mb-2" />
                <p className="text-white/60">Video Stream (Encrypted)</p>
                <p className="text-white/40 text-sm">SRTP + AES-256</p>
              </div>
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
              </button>
              
              <button 
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
              </button>
              
              <button 
                onClick={endCall}
                className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Encryption Status */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <h5 className="text-green-400 font-medium">End-to-End Encrypted</h5>
                <p className="text-green-300/80 text-sm">Media is encrypted with AES-256 before transmission</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
