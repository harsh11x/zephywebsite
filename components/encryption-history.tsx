"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Lock, Unlock, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface EncryptionLog {
  id: string
  file_name: string
  operation: "encrypt" | "decrypt"
  file_size: number
  created_at: string
}

export default function EncryptionHistory() {
  const { user } = useAuth()
  const [history, setHistory] = useState<EncryptionLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadHistory()
    }
  }, [user])

  const loadHistory = async () => {
    if (!user) return

    try {
      // Generate demo encryption history for all users
      const demoHistory: EncryptionLog[] = [
        {
          id: "1",
          file_name: "confidential-report.pdf",
          operation: "encrypt",
          file_size: 2048576,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        },
        {
          id: "2",
          file_name: "financial-data.xlsx",
          operation: "decrypt",
          file_size: 1024000,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: "3",
          file_name: "security-keys.txt",
          operation: "encrypt",
          file_size: 4096,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        },
      ]
      setHistory(demoHistory)
    } catch (error) {
      console.error("Failed to load encryption history:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Card className="bg-black/20 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-300 mt-2">Loading encryption history...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/20 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Recent Encryption Activity
        </CardTitle>
        <CardDescription className="text-slate-300">
          Your latest file encryption and decryption operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-300">No encryption history yet</p>
            <p className="text-slate-400 text-sm">Start encrypting files to see your activity here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((log, index) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', width: '100%' }}
              >
                  <div className={`p-2 rounded-lg ${log.operation === "encrypt" ? "bg-green-900/30 text-green-400" : "bg-blue-900/30 text-blue-400"}`}>
                    {log.operation === "encrypt" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="text-white font-medium">{log.file_name}</div>
                    <div className="text-slate-400 text-sm">{formatFileSize(log.file_size)} • {formatDate(log.created_at)}</div>
                </div>
                <Badge
                  variant={log.operation === "encrypt" ? "default" : "secondary"}
                  className={log.operation === "encrypt" ? "bg-green-900 text-green-300" : "bg-blue-900 text-blue-300"}
                >
                  {log.operation === "encrypt" ? "Encrypted" : "Decrypted"}
                </Badge>
              </motion.div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
