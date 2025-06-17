"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, CheckCircle, ExternalLink, Chrome } from "lucide-react"

export default function GoogleSetupGuide() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const redirectUrls = [
    "http://localhost:3000/auth/callback",
    "https://your-domain.com/auth/callback", // Replace with your actual domain
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Chrome className="h-5 w-5 mr-2" />
            Google OAuth Setup Guide
          </CardTitle>
          <CardDescription className="text-slate-300">
            Set up Google authentication for your Zephyrn Securities platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="console" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/80">
              <TabsTrigger
                value="console"
                className="text-slate-300 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Google Console
              </TabsTrigger>
              <TabsTrigger
                value="supabase"
                className="text-slate-300 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Supabase Config
              </TabsTrigger>
              <TabsTrigger
                value="test"
                className="text-slate-300 data-[state=active]:bg-white data-[state=active]:text-black"
              >
                Test & Debug
              </TabsTrigger>
            </TabsList>

            <TabsContent value="console" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                      1
                    </span>
                    Create Google Cloud Project
                  </h3>
                  <ul className="space-y-2 text-slate-300 text-sm ml-8">
                    <li>• Go to Google Cloud Console: console.cloud.google.com</li>
                    <li>• Create a new project or select existing one</li>
                    <li>• Enable the Google+ API (if not already enabled)</li>
                  </ul>
                  <Button asChild className="mt-3" size="sm">
                    <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Google Console
                    </a>
                  </Button>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                      2
                    </span>
                    Configure OAuth Consent Screen
                  </h3>
                  <ul className="space-y-2 text-slate-300 text-sm ml-8">
                    <li>• Go to APIs & Services → OAuth consent screen</li>
                    <li>• Choose "External" user type</li>
                    <li>• Fill in app name: "Zephyrn Securities"</li>
                    <li>• Add your email as developer contact</li>
                    <li>• Add scopes: email, profile, openid</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                      3
                    </span>
                    Create OAuth Credentials
                  </h3>
                  <ul className="space-y-2 text-slate-300 text-sm ml-8">
                    <li>• Go to APIs & Services → Credentials</li>
                    <li>• Click "Create Credentials" → "OAuth 2.0 Client IDs"</li>
                    <li>• Application type: "Web application"</li>
                    <li>• Name: "Zephyrn Securities Web Client"</li>
                  </ul>

                  <div className="mt-4">
                    <h4 className="text-white font-medium mb-2">Authorized Redirect URIs:</h4>
                    <div className="space-y-2">
                      {redirectUrls.map((url, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <code className="bg-slate-900/50 px-2 py-1 rounded text-slate-300 text-xs flex-1">{url}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(url, `url-${index}`)}>
                            {copiedText === `url-${index}` ? (
                              <CheckCircle className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-400 text-xs mt-2">
                      Replace "your-domain.com" with your actual production domain
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="supabase" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                      1
                    </span>
                    Configure Supabase Authentication
                  </h3>
                  <ul className="space-y-2 text-slate-300 text-sm ml-8">
                    <li>• Go to your Supabase project: tcouoidmdvlxvsbkvfku.supabase.co</li>
                    <li>• Navigate to Authentication → Providers</li>
                    <li>• Find "Google" and toggle it ON</li>
                    <li>• Enter your Google OAuth credentials</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                      2
                    </span>
                    Required Information
                  </h3>
                  <div className="space-y-3 ml-8">
                    <div>
                      <label className="text-slate-400 text-sm">Client ID:</label>
                      <p className="text-slate-300 text-sm">
                        Copy from Google Console → Credentials → Your OAuth Client
                      </p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm">Client Secret:</label>
                      <p className="text-slate-300 text-sm">
                        Copy from Google Console → Credentials → Your OAuth Client
                      </p>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm">Redirect URL:</label>
                      <code className="bg-slate-900/50 px-2 py-1 rounded text-slate-300 text-xs block mt-1">
                        https://tcouoidmdvlxvsbkvfku.supabase.co/auth/v1/callback
                      </code>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                      3
                    </span>
                    Site URL Configuration
                  </h3>
                  <ul className="space-y-2 text-slate-300 text-sm ml-8">
                    <li>• Go to Authentication → Settings</li>
                    <li>• Set Site URL to: http://localhost:3000 (development)</li>
                    <li>• Add production URL when deploying</li>
                    <li>• Add redirect URLs for both development and production</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="test" className="space-y-4">
              <Alert className="bg-blue-900/20 border-blue-700">
                <Chrome className="h-4 w-4" />
                <AlertDescription className="text-blue-200">
                  <strong>Testing Google OAuth:</strong> Make sure to test in an incognito window to avoid cached
                  sessions.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-3">Common Issues & Solutions</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-red-300 font-medium">Error: "redirect_uri_mismatch"</p>
                      <p className="text-slate-300">
                        Solution: Make sure the redirect URI in Google Console exactly matches Supabase's callback URL
                      </p>
                    </div>
                    <div>
                      <p className="text-red-300 font-medium">Error: "invalid_client"</p>
                      <p className="text-slate-300">
                        Solution: Double-check your Client ID and Client Secret in Supabase settings
                      </p>
                    </div>
                    <div>
                      <p className="text-red-300 font-medium">Error: "access_denied"</p>
                      <p className="text-slate-300">
                        Solution: Make sure your OAuth consent screen is properly configured and published
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-medium mb-3">Test Checklist</h3>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input type="checkbox" className="rounded" />
                      <span>Google Cloud project created</span>
                    </label>
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input type="checkbox" className="rounded" />
                      <span>OAuth consent screen configured</span>
                    </label>
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input type="checkbox" className="rounded" />
                      <span>OAuth credentials created</span>
                    </label>
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input type="checkbox" className="rounded" />
                      <span>Supabase Google provider enabled</span>
                    </label>
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input type="checkbox" className="rounded" />
                      <span>Client ID and Secret added to Supabase</span>
                    </label>
                    <label className="flex items-center space-x-2 text-slate-300">
                      <input type="checkbox" className="rounded" />
                      <span>Site URLs configured</span>
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
