"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, UserPlus, CheckCircle, AlertCircle, Copy, Info, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function AddTestUserButton() {
  const { isSupabaseConfigured } = useAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    setupUrl?: string
    userId?: string
    email?: string
    password?: string
  }>({})
  const [copied, setCopied] = useState(false)

  const addTestUser = async () => {
    setLoading(true)
    setResult({})

    try {
      const response = await fetch("/api/auth/add-test-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: "Test user created successfully!",
          userId: data.userId,
          email: data.email,
          password: data.password,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to create test user",
          setupUrl: data.setupUrl,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error occurred. Please check your connection.",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyCredentials = () => {
    if (result.email && result.password) {
      const credentials = `Email: ${result.email}\nPassword: ${result.password}`
      navigator.clipboard.writeText(credentials)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="space-y-4">
        <Alert className="bg-amber-900/20 border-amber-700">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-amber-200">
            <strong>Configuration Required:</strong> Supabase environment variables are not set up.
          </AlertDescription>
        </Alert>
        <div className="text-center py-8">
          <UserPlus className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 mb-2">User Management Unavailable</p>
          <p className="text-slate-400 text-sm mb-4">Configure Supabase to enable user creation</p>
          <Link href="/setup">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <ExternalLink className="w-4 h-4 mr-2" />
              Setup Guide
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          style={{ display: 'block' }}
        >
          <Button
            onClick={addTestUser}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? (
              <div className="mr-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  style={{ display: 'inline-block' }}
                >
                  <Shield className="h-5 w-5" />
                </motion.div>
              </div>
            ) : (
              <UserPlus className="mr-2 h-5 w-5" />
            )}
            {loading ? "Creating User..." : "Create Test User"}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {result.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              variant={result.success ? "default" : "destructive"}
              className={`border-2 ${
                result.success
                  ? "bg-green-900/20 border-green-700 text-green-200"
                  : "bg-red-900/20 border-red-700 text-red-200"
              }`}
            >
              {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription className="font-medium">
                {result.message}
                {result.setupUrl && (
                  <div className="mt-2">
                    <Link href={result.setupUrl}>
                      <Button variant="outline" size="sm" className="text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Setup Guide
                      </Button>
                    </Link>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result.success && result.email && result.password && (
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring" }}
              style={{ display: 'block' }}
            >
              <div className="relative overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600 rounded-xl backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white text-lg flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-green-400" />
                        Test User Created
                      </h3>
                      <div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          style={{ display: 'inline-block' }}
                        >
                          <button
                            onClick={copyCredentials}
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
                          >
                            {copied ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4 text-slate-300" />
                            )}
                          </button>
                        </motion.div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-black/30 rounded-lg border border-slate-600">
                        <p className="text-sm text-slate-400 mb-1">Email Address</p>
                        <p className="font-mono text-white font-medium">{result.email}</p>
                      </div>
                      <div className="p-3 bg-black/30 rounded-lg border border-slate-600">
                        <p className="text-sm text-slate-400 mb-1">Password</p>
                        <p className="font-mono text-white font-medium">{result.password}</p>
                      </div>
                      {result.userId && (
                        <div className="p-3 bg-black/30 rounded-lg border border-slate-600">
                          <p className="text-sm text-slate-400 mb-1">User ID</p>
                          <p className="font-mono text-white font-medium text-xs">{result.userId}</p>
                        </div>
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      style={{ display: 'block' }}
                    >
                      <div className="mt-4">
                        <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                          <p className="text-blue-200 text-sm">
                            💡 <strong>Success!</strong> You can now use these credentials to log in at{" "}
                            <Link href="/auth" className="underline hover:text-blue-100">
                              /auth
                            </Link>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
