"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, File, Key } from "lucide-react"
import { encryptFile, decryptFile, generateSecureKey } from "@/lib/crypto"

export default function FileCrypto() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [encryptedFile, setEncryptedFile] = useState<{ blob: Blob; originalName: string } | null>(null)
  const [decryptedFile, setDecryptedFile] = useState<{ blob: Blob; originalName: string } | null>(null)
  const [password, setPassword] = useState("")

  const encryptFileInputRef = useRef<HTMLInputElement>(null)
  const decryptFileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: "encrypt" | "decrypt") => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError("")
      setEncryptedFile(null)
      setDecryptedFile(null)
    }
  }

  const generateKey = () => {
    const key = generateSecureKey(Math.floor(Math.random() * 11) + 15) // Random length between 15-25
    setPassword(key)
  }

  const handleEncrypt = async (formData: FormData) => {
    if (!selectedFile) {
      setError("Please select a file to encrypt")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const password = formData.get("password") as string
      if (!password) {
        setError("Please provide a password")
        return
      }

      const result = await encryptFile(selectedFile, password)
      setEncryptedFile(result)
    } catch (err) {
      setError("Encryption failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecrypt = async (formData: FormData) => {
    if (!selectedFile) {
      setError("Please select an encrypted file")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const password = formData.get("password") as string
      if (!password) {
        setError("Please provide the password")
        return
      }

      const result = await decryptFile(selectedFile, password)
      setDecryptedFile(result)
    } catch (err) {
      setError("Decryption failed. Please check your password and file.")
    } finally {
      setIsLoading(false)
    }
  }

  const downloadFile = (data: { blob: Blob; originalName: string }, type: "encrypt" | "decrypt") => {
    const url = URL.createObjectURL(data.blob)
    const a = document.createElement("a")
    a.href = url
    if (type === "encrypt") {
      // Remove the original extension and use .enc
      const baseNameWithoutExt = data.originalName.split('.')[0]
      a.download = `${baseNameWithoutExt}.enc`
    } else {
      // For decryption, use the original name with extension
      a.download = data.originalName
    }
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-light text-white">File Encryption & Decryption</CardTitle>
          <CardDescription className="text-white/60 text-base font-light">
            Securely encrypt or decrypt files of any type using AES-256 encryption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="encrypt" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="encrypt" className="text-white/60 data-[state=active]:bg-white data-[state=active]:text-black">
                Encrypt File
              </TabsTrigger>
              <TabsTrigger value="decrypt" className="text-white/60 data-[state=active]:bg-white data-[state=active]:text-black">
                Decrypt File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="encrypt" className="space-y-4">
              <form action={handleEncrypt} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="encrypt-file" className="text-white/60 font-light">Select File to Encrypt</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="encrypt-file"
                      ref={encryptFileInputRef}
                      type="file"
                      onChange={(e) => handleFileSelect(e, "encrypt")}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => encryptFileInputRef.current?.click()}
                      className="border-white/10 text-white hover:bg-white/5">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    {selectedFile && (
                      <div className="flex items-center text-sm text-white/60">
                        <File className="w-4 h-4 mr-1" />
                        {selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encrypt-file-password" className="text-white/60 font-light">Password</Label>
                  <div className="flex space-x-2">
                  <Input
                    id="encrypt-file-password"
                    name="password"
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                    <Button type="button" variant="outline" onClick={generateKey}
                      className="border-white/10 text-white hover:bg-white/5">
                      <Key className="w-4 h-4 mr-2" />
                      Generate Key
                    </Button>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading || !selectedFile}
                  className="bg-white text-black hover:bg-white/90">
                  {isLoading ? "Encrypting..." : "Encrypt File"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="decrypt" className="space-y-4">
              <form action={handleDecrypt} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decrypt-file" className="text-white/60 font-light">Select Encrypted File</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="decrypt-file"
                      ref={decryptFileInputRef}
                      type="file"
                      accept=".enc"
                      onChange={(e) => handleFileSelect(e, "decrypt")}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => decryptFileInputRef.current?.click()}
                      className="border-white/10 text-white hover:bg-white/5">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                    {selectedFile && (
                      <div className="flex items-center text-sm text-white/60">
                        <File className="w-4 h-4 mr-1" />
                        {selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decrypt-file-password" className="text-white/60 font-light">Password</Label>
                  <div className="flex space-x-2">
                  <Input
                    id="decrypt-file-password"
                    name="password"
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the password used for encryption"
                    required
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                    <Button type="button" variant="outline" onClick={generateKey}
                      className="border-white/10 text-white hover:bg-white/5">
                      <Key className="w-4 h-4 mr-2" />
                      Generate Key
                    </Button>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading || !selectedFile}
                  className="bg-white text-black hover:bg-white/90">
                  {isLoading ? "Decrypting..." : "Decrypt File"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
          <AlertDescription className="text-white">{error}</AlertDescription>
        </Alert>
      )}

      {encryptedFile && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-white">Encrypted File Ready</CardTitle>
            <CardDescription className="text-white/60 text-base font-light">
              Your file has been successfully encrypted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => downloadFile(encryptedFile, "encrypt")}
              className="bg-white text-black hover:bg-white/90">
              <Download className="w-4 h-4 mr-2" />
              Download Encrypted File
            </Button>
          </CardContent>
        </Card>
      )}

      {decryptedFile && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-white">Decrypted File Ready</CardTitle>
            <CardDescription className="text-white/60 text-base font-light">
              Your file has been successfully decrypted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => downloadFile(decryptedFile, "decrypt")}
              className="bg-white text-black hover:bg-white/90">
              <Download className="w-4 h-4 mr-2" />
              Download Decrypted File
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
