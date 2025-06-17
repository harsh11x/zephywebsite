"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Download, Key } from "lucide-react"
import { encryptText, decryptText, generateSecureKey } from "@/lib/crypto"

export default function TextCrypto() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [password, setPassword] = useState("")
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")

  const generateKey = () => {
    const key = generateSecureKey(Math.floor(Math.random() * 11) + 15) // Random length between 15-25
    setPassword(key)
  }

  const handleEncrypt = async (formData: FormData) => {
    if (!inputText) {
      setError("Please enter text to encrypt")
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

      const encrypted = await encryptText(inputText, password)
      setOutputText(encrypted)
    } catch (err) {
      setError("Encryption failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecrypt = async (formData: FormData) => {
    if (!inputText) {
      setError("Please enter encrypted text")
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

      const decrypted = await decryptText(inputText, password)
      setOutputText(decrypted)
    } catch (err) {
      setError("Decryption failed. Please check your password and text.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
    } catch (err) {
      setError("Failed to copy to clipboard")
    }
  }

  const downloadResult = () => {
    const blob = new Blob([outputText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "encrypted_text.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-light text-white">Text Encryption & Decryption</CardTitle>
          <CardDescription className="text-white/60 text-base font-light">
            Securely encrypt or decrypt text using AES-256 encryption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="encrypt" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="encrypt" className="text-white/60 data-[state=active]:bg-white data-[state=active]:text-black">
                Encrypt Text
              </TabsTrigger>
              <TabsTrigger value="decrypt" className="text-white/60 data-[state=active]:bg-white data-[state=active]:text-black">
                Decrypt Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="encrypt" className="space-y-4">
              <form action={handleEncrypt} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="encrypt-text" className="text-white/60 font-light">Text to Encrypt</Label>
                  <Textarea
                    id="encrypt-text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to encrypt"
                    className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="encrypt-text-password" className="text-white/60 font-light">Password</Label>
                  <div className="flex space-x-2">
                  <Input
                      id="encrypt-text-password"
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
                <Button type="submit" disabled={isLoading || !inputText}
                  className="bg-white text-black hover:bg-white/90">
                  {isLoading ? "Encrypting..." : "Encrypt Text"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="decrypt" className="space-y-4">
              <form action={handleDecrypt} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decrypt-text" className="text-white/60 font-light">Encrypted Text</Label>
                  <Textarea
                    id="decrypt-text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter encrypted text"
                    className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decrypt-text-password" className="text-white/60 font-light">Password</Label>
                  <div className="flex space-x-2">
                  <Input
                      id="decrypt-text-password"
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
                <Button type="submit" disabled={isLoading || !inputText}
                  className="bg-white text-black hover:bg-white/90">
                  {isLoading ? "Decrypting..." : "Decrypt Text"}
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

      {outputText && (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-light text-white">Result</CardTitle>
            <CardDescription className="text-white/60 text-base font-light">
              Your text has been processed successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={outputText}
              readOnly
              className="min-h-[100px] bg-white/5 border-white/10 text-white"
            />
            <div className="flex space-x-2">
              <Button onClick={copyToClipboard} variant="outline"
                className="border-white/10 text-white hover:bg-white/5">
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </Button>
              <Button onClick={downloadResult} variant="outline"
                className="border-white/10 text-white hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" />
                Download as File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
