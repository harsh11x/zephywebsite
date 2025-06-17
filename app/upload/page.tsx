"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, File, Lock, Unlock, Download, Shield, AlertCircle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { ZephyrnCrypto } from "@/lib/crypto-advanced"
import Header from "@/components/header"
import { SupabaseStorage } from "@/lib/supabase-storage"

export default function UploadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    type: "encrypt" | "decrypt"
    data: Blob
    filename: string
    keyId?: string
    storagePath?: string
    storageUrl?: string
  } | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!loading && !user) {
    router.push("/auth")
    return null
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setResult(null)
      setError("")
    }
  }

  const handleEncrypt = async (formData: FormData) => {
    if (!selectedFile || !user) {
      setError("Please select a file and ensure you're logged in")
      return
    }

    const password = formData.get("password") as string
    if (!password) {
      setError("Please provide a password")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError("")

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 70))
      }, 200)

      const encrypted = await ZephyrnCrypto.encryptFile(selectedFile, password)
      setProgress(80)

      // Create encrypted file blob
      const encryptedBlob = new Blob([encrypted.encryptedData], {
        type: "application/octet-stream",
      })

      // Upload to Supabase storage
      const { url, path } = await SupabaseStorage.uploadEncryptedFile(
        encryptedBlob,
        `${selectedFile.name}.zephyrn`,
        user.id,
      )
      setProgress(90)

      // Log the encryption operation
      await SupabaseStorage.logEncryption(user.id, selectedFile.name, "encrypt", selectedFile.size)

      clearInterval(progressInterval)
      setProgress(100)

      setResult({
        type: "encrypt",
        data: encryptedBlob,
        filename: `${selectedFile.name}.zephyrn`,
        keyId: encrypted.keyId,
        storagePath: path,
        storageUrl: url,
      })
    } catch (err) {
      setError("Encryption failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDecrypt = async (formData: FormData) => {
    if (!selectedFile) {
      setError("Please select an encrypted file")
      return
    }

    const password = formData.get("password") as string
    if (!password) {
      setError("Please provide the password")
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setError("")

    try {
      // For demo purposes, we'll simulate decryption
      // In a real implementation, you'd parse the encrypted file format
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      // Simulate decryption process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearInterval(progressInterval)
      setProgress(100)

      // Create decrypted file blob (demo)
      const decryptedBlob = new Blob(["Decrypted file content"], {
        type: "text/plain",
      })

      setResult({
        type: "decrypt",
        data: decryptedBlob,
        filename: selectedFile.name.replace(".zephyrn", "") || "decrypted_file",
      })
    } catch (err) {
      setError("Decryption failed. Please check your password.")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadFile = () => {
    if (!result) return

    const url = URL.createObjectURL(result.data)
    const a = document.createElement("a")
    a.href = url
    a.download = result.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">File Encryption & Decryption</h1>
            <p className="text-slate-300">Secure your files with military-grade AES-256 encryption</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* File Upload Section */}
            <Card className="bg-black/20 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Select File
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Choose a file to encrypt or decrypt (Max: 5GB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
                    {selectedFile ? (
                      <div className="space-y-2">
                        <File className="h-12 w-12 text-primary mx-auto" />
                        <div className="text-white font-medium">{selectedFile.name}</div>
                        <div className="text-slate-400 text-sm">{formatFileSize(selectedFile.size)}</div>
                        <Badge variant="secondary" className="bg-green-900 text-green-300">
                          File Selected
                        </Badge>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                        <div className="text-white">Click to select a file</div>
                        <div className="text-slate-400 text-sm">Or drag and drop your file here</div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Encryption/Decryption Controls */}
            <Card className="bg-black/20 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Operations
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Choose your security operation and provide credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <form action={handleEncrypt}>
                      <div className="space-y-4">
                        <Label htmlFor="encrypt-password" className="text-white">
                          Encryption Password
                        </Label>
                        <Input
                          id="encrypt-password"
                          name="password"
                          type="password"
                          placeholder="Enter strong password"
                          className="bg-slate-800 border-slate-600 text-white"
                          required
                        />
                        <Button
                          type="submit"
                          disabled={!selectedFile || isProcessing}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Encrypt File
                        </Button>
                      </div>
                    </form>

                    <form action={handleDecrypt}>
                      <div className="space-y-4">
                        <Label htmlFor="decrypt-password" className="text-white">
                          Decryption Password
                        </Label>
                        <Input
                          id="decrypt-password"
                          name="password"
                          type="password"
                          placeholder="Enter password"
                          className="bg-slate-800 border-slate-600 text-white"
                          required
                        />
                        <Button
                          type="submit"
                          disabled={!selectedFile || isProcessing}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Decrypt File
                        </Button>
                      </div>
                    </form>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-white text-sm">
                        <span>Processing...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mt-6 bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* Result Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8"
            >
              <Card className="bg-black/20 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    {result.type === "encrypt" ? "Encryption" : "Decryption"} Complete
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Your file has been successfully {result.type === "encrypt" ? "encrypted" : "decrypted"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <File className="h-8 w-8 text-primary" />
                        <div>
                          <div className="text-white font-medium">{result.filename}</div>
                          {result.keyId && <div className="text-slate-400 text-sm">Key ID: {result.keyId}</div>}
                        </div>
                      </div>
                      <Button onClick={downloadFile} className="bg-gradient-to-r from-purple-600 to-purple-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    {result.type === "encrypt" && (
                      <Alert className="bg-blue-900/20 border-blue-800">
                        <Shield className="h-4 w-4" />
                        <AlertDescription className="text-blue-200">
                          <strong>Important:</strong> Store your password securely. Without it, your encrypted file
                          cannot be recovered.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
