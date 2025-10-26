"use client"

import { useState } from "react"
import { Lock, Unlock, Copy, Check } from "lucide-react"

function encodeUtf8(input: string): Uint8Array {
  return new TextEncoder().encode(input)
}

function decodeUtf8(input: ArrayBuffer): string {
  return new TextDecoder().decode(input)
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

async function importKeyFromPassphrase(passphrase: string): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    "raw",
    encodeUtf8(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )
  // Derive AES-GCM key using PBKDF2 (demo purpose only)
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encodeUtf8("zephyrn-demo-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )
}

async function encryptAesGcm(plaintext: string, passphrase: string) {
  const key = await importKeyFromPassphrase(passphrase)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodeUtf8(plaintext))
  return {
    iv: arrayBufferToBase64(iv.buffer),
    data: arrayBufferToBase64(ciphertext),
  }
}

async function decryptAesGcm(ciphertextB64: string, ivB64: string, passphrase: string) {
  const key = await importKeyFromPassphrase(passphrase)
  const iv = new Uint8Array(base64ToArrayBuffer(ivB64))
  const data = base64ToArrayBuffer(ciphertextB64)
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data)
  return decodeUtf8(plaintext)
}

export default function EncryptDemo() {
  const [message, setMessage] = useState("Trust no one. Encrypt everything.")
  const [pass, setPass] = useState("demo-key-123")
  const [cipher, setCipher] = useState<string>("")
  const [iv, setIv] = useState<string>("")
  const [plainOut, setPlainOut] = useState<string>("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState<string>("")

  const handleEncrypt = async () => {
    if (!message.trim()) {
      setError("Please enter a message to encrypt")
      return
    }
    if (!pass.trim()) {
      setError("Please enter a passphrase")
      return
    }
    
    setError("")
    setBusy(true)
    try {
      const res = await encryptAesGcm(message, pass)
      setCipher(res.data)
      setIv(res.iv)
      setPlainOut("")
    } catch (e: any) {
      setError(e?.message || "Encrypt failed")
    } finally {
      setBusy(false)
    }
  }

  const handleDecrypt = async () => {
    if (!cipher.trim()) {
      setError("Please enter ciphertext to decrypt")
      return
    }
    if (!iv.trim()) {
      setError("Please enter IV")
      return
    }
    if (!pass.trim()) {
      setError("Please enter a passphrase")
      return
    }
    
    setError("")
    setBusy(true)
    try {
      const out = await decryptAesGcm(cipher, iv, pass)
      setPlainOut(out)
    } catch (e: any) {
      setError(e?.message || "Decrypt failed - check your passphrase and data")
    } finally {
      setBusy(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const resetDemo = () => {
    setMessage("Trust no one. Encrypt everything.")
    setPass("demo-key-123")
    setCipher("")
    setIv("")
    setPlainOut("")
    setError("")
  }

  return (
    <div className="elevated-card outline-glow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-2xl flex items-center gap-2">
            <Lock className="w-6 h-6" />
            Live Encryption Demo
          </h3>
          <p className="text-white/70 mt-1">AES-256/GCM in your browser using a passphrase-derived key.</p>
        </div>
        <button 
          onClick={resetDemo}
          className="text-white/60 hover:text-white text-sm px-3 py-1 border border-white/20 rounded hover:bg-white/5 transition-colors"
        >
          Reset Demo
        </button>
      </div>

      {/* Step 1: Input */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs text-white">1</div>
          <span className="text-white font-medium">Enter your message and passphrase</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">Message to Encrypt</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white font-mono text-sm" 
              rows={3} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message..."
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-2">Passphrase / Key</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white font-mono text-sm" 
              value={pass} 
              onChange={(e) => setPass(e.target.value)}
              placeholder="Enter your passphrase..."
            />
            <p className="text-xs text-white/50 mt-1">For production, use random keys and secure exchange.</p>
          </div>
        </div>
      </div>

      {/* Step 2: Encrypt */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs text-white">2</div>
          <span className="text-white font-medium">Encrypt your message</span>
        </div>
        <button 
          className="button-primary flex items-center gap-2" 
          onClick={handleEncrypt} 
          disabled={busy || !message.trim() || !pass.trim()}
        >
          <Lock className="w-4 h-4" />
          {busy ? "Encrypting..." : "Encrypt Message"}
        </button>
      </div>

      {/* Step 3: Results */}
      {(cipher || iv) && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs text-white">3</div>
            <span className="text-white font-medium">Encrypted data (share this securely)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">Ciphertext (base64)</label>
              <div className="relative">
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white font-mono text-xs" 
                  rows={4} 
                  value={cipher} 
                  readOnly
                />
                <button
                  onClick={() => copyToClipboard(cipher, 'cipher')}
                  className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded"
                >
                  {copied === 'cipher' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/60" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-2">IV (base64)</label>
              <div className="relative">
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white font-mono text-xs" 
                  value={iv} 
                  readOnly
                />
                <button
                  onClick={() => copyToClipboard(iv, 'iv')}
                  className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded"
                >
                  {copied === 'iv' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/60" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Decrypt */}
      {cipher && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs text-white">4</div>
            <span className="text-white font-medium">Decrypt the message</span>
          </div>
          <button 
            className="button-outline flex items-center gap-2" 
            onClick={handleDecrypt} 
            disabled={busy || !cipher || !iv || !pass.trim()}
          >
            <Unlock className="w-4 h-4" />
            {busy ? "Decrypting..." : "Decrypt Message"}
          </button>
        </div>
      )}

      {/* Step 5: Decrypted Result */}
      {plainOut && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs text-white">5</div>
            <span className="text-white font-medium">Decrypted message</span>
          </div>
          <div className="relative">
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white font-mono text-sm" 
              rows={3} 
              value={plainOut} 
              readOnly
            />
            <button
              onClick={() => copyToClipboard(plainOut, 'decrypted')}
              className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded"
            >
              {copied === 'decrypted' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/60" />}
            </button>
          </div>
          {plainOut === message && (
            <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
              <Check className="w-4 h-4" />
              Success! Decrypted message matches original.
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}


