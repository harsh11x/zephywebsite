"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, CheckCircle, AlertCircle, ExternalLink, Database, Key, Shield, Settings } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { validateSupabaseConfig, SUPABASE_SETUP_GUIDE } from "@/lib/supabase-setup"
import Header from "@/components/header"

export default function SetupPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const { isValid, missing, config } = validateSupabaseConfig()

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const envFileContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional: Stripe Configuration (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret`

  // Ensure steps array exists before mapping
  const setupSteps = SUPABASE_SETUP_GUIDE?.steps || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Zephyrn Securities Setup</h1>
                <p className="text-slate-300 text-lg">Configure your cybersecurity platform</p>
              </div>
            </div>
          </div>

          {/* Configuration Status */}
          <Card className="frosted-glass mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  {config.url ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">Supabase URL</p>
                    <p className="text-slate-400 text-sm">{config.url ? "Configured" : "Missing"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {config.anonKey ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">Anonymous Key</p>
                    <p className="text-slate-400 text-sm">{config.anonKey ? "Configured" : "Missing"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {config.serviceKey ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  )}
                  <div>
                    <p className="text-white font-medium">Service Role Key</p>
                    <p className="text-slate-400 text-sm">{config.serviceKey ? "Configured" : "Optional"}</p>
                  </div>
                </div>
              </div>

              {isValid ? (
                <Alert className="mt-4 bg-green-900/20 border-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-200">
                    <strong>Configuration Complete!</strong> Your Supabase integration is ready.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive" className="mt-4 bg-red-900/20 border-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-200">
                    <strong>Configuration Required:</strong> Missing environment variables: {missing.join(", ")}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Setup Guide */}
          <Tabs defaultValue="guide" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/80">
              <TabsTrigger
                value="guide"
                className="text-slate-300 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Setup Guide
              </TabsTrigger>
              <TabsTrigger
                value="env"
                className="text-slate-300 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Environment Variables
              </TabsTrigger>
              <TabsTrigger
                value="database"
                className="text-slate-300 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Database Setup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="space-y-6">
              <div>
                {setupSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="frosted-glass">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <div className="p-2 bg-blue-600 rounded-lg mr-3 text-white font-bold text-sm">{step.step}</div>
                          {step.title}
                        </CardTitle>
                        <CardDescription className="text-slate-300">{step.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {step.details?.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start space-x-2 text-slate-300">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{detail}</span>
                            </li>
                          ))}
                        </ul>
                        {step.step === 1 && (
                          <div className="mt-4">
                            <Button asChild className="bg-green-600 hover:bg-green-700">
                              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open Supabase
                              </a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="env" className="space-y-6">
              <div>
                <Card className="frosted-glass">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Key className="h-5 w-5 mr-2" />
                      Environment Variables Setup
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Create a .env.local file in your project root with these variables
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <pre className="bg-slate-900/50 p-4 rounded-lg text-slate-300 text-sm overflow-x-auto">
                        {envFileContent}
                      </pre>
                      <Button
                        onClick={() => copyToClipboard(envFileContent, "env-file")}
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        variant="ghost"
                      >
                        {copiedText === "env-file" ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {SUPABASE_SETUP_GUIDE.steps[2].envVars?.map((envVar, index) => (
                        <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <code className="text-blue-300 font-mono text-sm">{envVar.name}</code>
                            <Badge variant={envVar.required ? "destructive" : "secondary"}>
                              {envVar.required ? "Required" : "Optional"}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm mb-2">Example: {envVar.example}</p>
                          {envVar.note && <p className="text-slate-500 text-xs">{envVar.note}</p>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <div>
                <Card className="frosted-glass">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Database Schema Setup
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Run this SQL in your Supabase SQL Editor to set up the required tables
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-slate-900/50 p-4 rounded-lg text-slate-300 text-sm overflow-x-auto max-h-96">
                        {SUPABASE_SETUP_GUIDE.steps[4].sql}
                      </pre>
                      <Button
                        onClick={() => copyToClipboard(SUPABASE_SETUP_GUIDE.steps[4].sql || "", "sql")}
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                        variant="ghost"
                      >
                        {copiedText === "sql" ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <Alert className="mt-4 bg-blue-900/20 border-blue-700">
                      <Database className="h-4 w-4" />
                      <AlertDescription className="text-blue-200">
                        <strong>How to run:</strong> Go to your Supabase project → SQL Editor → New query → Paste the SQL
                        above → Run
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="frosted-glass">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
                <CardDescription className="text-slate-300">Get support and documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Supabase Documentation
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href="https://supabase.com/docs/guides/auth" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Authentication Guide
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="frosted-glass">
              <CardHeader>
                <CardTitle className="text-white">Ready to Go?</CardTitle>
                <CardDescription className="text-slate-300">Test your configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isValid ? (
                  <>
                    <Link href="/auth">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-green-700">
                        Test Authentication
                      </Button>
                    </Link>
                    <Link href="/admin">
                      <Button variant="outline" className="w-full">
                        Admin Panel
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button disabled className="w-full">
                    Complete Setup First
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
