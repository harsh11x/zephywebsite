"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Star, 
  QrCode, 
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { toast } from "sonner"
import QRCode from 'qrcode'

interface EncryptionKey {
  id: string
  name: string
  key: string
  createdAt: Date
  isDefault: boolean
}

interface KeyManagerProps {
  encryptionKeys: EncryptionKey[]
  setEncryptionKeys: (keys: EncryptionKey[]) => void
  selectedKey: string
  setSelectedKey: (keyId: string) => void
  isGeneratingKey: boolean
  generateNewKey: () => void
}

export default function KeyManager({
  encryptionKeys,
  setEncryptionKeys,
  selectedKey,
  setSelectedKey,
  isGeneratingKey,
  generateNewKey
}: KeyManagerProps) {
  const [showKeyManager, setShowKeyManager] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyValue, setNewKeyValue] = useState("")
  const [showKeyValue, setShowKeyValue] = useState(false)
  const [keyValidationError, setKeyValidationError] = useState<string>('')
  const [showClipboardWarning, setShowClipboardWarning] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [showQrCode, setShowQrCode] = useState(false)

  const validateKey = (key: string): { isValid: boolean; error?: string } => {
    if (key.length < 16) {
      return { isValid: false, error: "Key must be at least 16 characters long" }
    }
    if (key.length > 128) {
      return { isValid: false, error: "Key must be less than 128 characters" }
    }
    // Check for common weak patterns
    if (/^(.)\1*$/.test(key)) {
      return { isValid: false, error: "Key cannot be all the same character" }
    }
    if (/^(.)(.)(\1\2)*$/.test(key)) {
      return { isValid: false, error: "Key cannot be a repeating pattern" }
    }
    return { isValid: true }
  }

  const addEncryptionKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      toast.error("Please provide both name and key")
      return
    }

    const validation = validateKey(newKeyValue)
    if (!validation.isValid) {
      setKeyValidationError(validation.error!)
      return
    }

    setKeyValidationError('')

    const newKey: EncryptionKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKeyValue,
      createdAt: new Date(),
      isDefault: false
    }

    const updatedKeys = [...encryptionKeys, newKey]
    setEncryptionKeys(updatedKeys)
    localStorage.setItem('zephy-encryption-keys', JSON.stringify(updatedKeys))
    
    setNewKeyName("")
    setNewKeyValue("")
    toast.success("Encryption key added successfully")
  }

  const deleteKey = (keyId: string) => {
    const keyToDelete = encryptionKeys.find(k => k.id === keyId)
    if (keyToDelete?.isDefault) {
      toast.error("Cannot delete the default key")
      return
    }

    const updatedKeys = encryptionKeys.filter(k => k.id !== keyId)
    setEncryptionKeys(updatedKeys)
    localStorage.setItem('zephy-encryption-keys', JSON.stringify(updatedKeys))
    
    if (selectedKey === keyId) {
      const newDefault = updatedKeys.find(k => k.isDefault) || updatedKeys[0]
      if (newDefault) {
        setSelectedKey(newDefault.id)
      }
    }
    
    toast.success("Key deleted successfully")
  }

  const setDefaultKey = (keyId: string) => {
    const updatedKeys = encryptionKeys.map(k => ({
      ...k,
      isDefault: k.id === keyId
    }))
    
    setEncryptionKeys(updatedKeys)
    setSelectedKey(keyId)
    localStorage.setItem('zephy-encryption-keys', JSON.stringify(updatedKeys))
    toast.success("Default key updated")
  }

  const copyKeyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      toast.success("Key copied to clipboard")
      setShowClipboardWarning(true)
      setTimeout(() => setShowClipboardWarning(false), 5000)
    } catch (error) {
      toast.error("Failed to copy key")
    }
  }

  const generateQrCode = async (key: string, keyName: string) => {
    try {
      const qrData = JSON.stringify({
        name: keyName,
        key: key,
        timestamp: new Date().toISOString()
      })
      
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#FFFFFF',
          light: '#000000'
        }
      })
      
      setQrCodeDataUrl(qrCodeDataUrl)
      setShowQrCode(true)
    } catch (error) {
      toast.error("Failed to generate QR code")
    }
  }

  useEffect(() => {
    const savedKeys = localStorage.getItem('zephy-encryption-keys')
    if (savedKeys) {
      const keys = JSON.parse(savedKeys).map((k: any) => ({
        ...k,
        createdAt: k.createdAt ? new Date(k.createdAt) : new Date()
      }))
      setEncryptionKeys(keys)
      const defaultKey = keys.find((k: EncryptionKey) => k.isDefault)
      if (defaultKey) {
        setSelectedKey(defaultKey.id)
      }
    }
  }, [])

  return (
    <>
      <Button onClick={() => setShowKeyManager(true)} variant="outline" className="w-full border-white/20">
        <Key className="h-4 w-4 mr-2" />
        Manage Keys
      </Button>

      {/* Enhanced Key Manager Dialog */}
      <Dialog open={showKeyManager} onOpenChange={setShowKeyManager}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Encryption Key Manager
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Create, manage, and organize your encryption keys
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Add New Key */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Key</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Key Name</Label>
                  <Input
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Enter key name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <Label className="text-white">Key Value</Label>
                  <div className="relative">
                    <Input
                      type={showKeyValue ? "text" : "password"}
                      value={newKeyValue}
                      onChange={(e) => {
                        setNewKeyValue(e.target.value)
                        setKeyValidationError('')
                      }}
                      placeholder="Enter or generate key"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 pr-10"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowKeyValue(!showKeyValue)}
                      className="absolute right-1 top-1 h-6 w-6 p-0"
                    >
                      {showKeyValue ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                  {keyValidationError && (
                    <p className="text-red-400 text-xs mt-1">{keyValidationError}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addEncryptionKey} className="flex-1">
                  Add Key
                </Button>
                <Button onClick={generateNewKey} disabled={isGeneratingKey} variant="outline" className="border-white/20">
                  {isGeneratingKey ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Existing Keys */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Keys</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {encryptionKeys.map((key) => (
                  <div
                    key={key.id}
                    className={`p-5 mb-4 bg-gradient-to-br from-white/10 via-blue-900/10 to-blue-800/20 backdrop-blur border ${key.isDefault ? 'border-blue-400/70' : 'border-white/10'} rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-between gap-4`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-white/90 truncate">{key.name}</span>
                      <span className="text-xs text-white/50 truncate">ID: {key.id}</span>
                      {key.isDefault && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-blue-500/20 text-blue-300 font-medium w-fit">Default</span>
                      )}
                      <span className="text-xs text-white/40 mt-1">Created: {key.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 items-center justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Copy key value"
                        onClick={() => copyKeyToClipboard(key.key)}
                        className="text-white/70 hover:text-white"
                        title="Copy key"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Show QR code"
                        onClick={() => generateQrCode(key.key, key.name)}
                        className="text-white/70 hover:text-white"
                        title="Generate QR code"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Show/hide key value"
                        onClick={() => setShowKeyValue(!showKeyValue)}
                        className="text-white/70 hover:text-white"
                        title="Show/hide key"
                      >
                        {showKeyValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      {!key.isDefault && (
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Set as default"
                          onClick={() => setDefaultKey(key.id)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Set as default"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      {!key.isDefault && (
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Delete key"
                          onClick={() => deleteKey(key.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete key"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  )
} 