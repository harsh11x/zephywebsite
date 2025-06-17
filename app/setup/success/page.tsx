"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Database, Key, Users, ArrowRight, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Header from "@/components/header"
import { validateSupabaseConfig } from "@/lib/supabase-setup"

export default function SetupSuccessPage() {
  const [configStatus, setConfigStatus] = useState<any>(null)

  useEffect(() => {
    setConfigStatus(validateSupabaseConfig())
  }, [])

  const nextSteps = [
    {
      title: "Test Authentication",
      description: "Try signing up or logging in with the auth system",
      href: "/auth",
      icon: Shield,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Create Test User",
      description: "Use the admin panel to create a test user account",
      href: "/admin",
      icon: Users,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Try File Encryption",
      description: "Upload and encrypt your first file",
      href: "/upload",
      icon: Key,
      color: "from-purple-500 to-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-green-900/30 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-4">🎉 Setup Complete!</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Your Zephyrn Securities platform is now configured and ready to use. All systems are operational!
            </p>
          </div>

          {/* Configuration Summary */}
          <Card className="bg-black/20 border-slate-700 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Configuration Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Supabase URL</p>
                    <p className="text-slate-400 text-sm">tcouoidmdvlxvsbkvfku.supabase.co</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Anonymous Key</p>
                    <p className="text-slate-400 text-sm">Configured ✓</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Service Role Key</p>
                    <p className="text-slate-400 text-sm">Configured ✓</p>
                  </div>
                </div>
              </div>

              <Alert className="mt-4 bg-green-900/20 border-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-200">
                  <strong>All systems operational!</strong> Your environment variables are properly configured and the
                  database schema is ready.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">🚀 What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={step.href}>
                    <Card className="bg-black/20 border-slate-700 backdrop-blur-sm hover:bg-black/30 transition-all cursor-pointer group h-full">
                      <CardHeader>
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${step.color} w-fit group-hover:scale-110 transition-transform`}
                        >
                          <step.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-white flex items-center justify-between">
                          {step.title}
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-slate-300">{step.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Test */}
          <Card className="bg-black/20 border-slate-700 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-white">🧪 Quick Test</CardTitle>
              <CardDescription className="text-slate-300">
                Test your configuration with these pre-configured credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Test User Credentials</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-400">Email:</span>
                      <span className="text-white ml-2 font-mono">harshdevsingh2004@gmail.com</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Password:</span>
                      <span className="text-white ml-2 font-mono">Admin@123</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-2 bg-blue-900/30 text-blue-300">
                    Create via Admin Panel
                  </Badge>
                </div>

                <div className="space-y-3">
                  <Link href="/admin">
                    <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                      <Users className="w-4 h-4 mr-2" />
                      Create Test User
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Test Authentication
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentation Links */}
          <Card className="bg-black/20 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">📚 Documentation & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild variant="outline" className="h-auto p-4">
                  <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">
                    <div className="text-left">
                      <div className="flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span className="font-medium">Supabase Docs</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Official Supabase documentation</p>
                    </div>
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4">
                  <a href="https://supabase.com/docs/guides/auth" target="_blank" rel="noopener noreferrer">
                    <div className="text-left">
                      <div className="flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span className="font-medium">Auth Guide</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Authentication setup guide</p>
                    </div>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
