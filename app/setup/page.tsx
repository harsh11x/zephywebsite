"use client"

import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Copy, CheckCircle, AlertCircle, ExternalLink, Database, Key, Shield, Settings } from "lucide-react"
// import { motion } from "framer-motion"
// import Link from "next/link"
// import Header from "@/components/header"

export default function SetupPage() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const envFileContent = `# Firebase Configuration\nNEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key\nNEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain\nNEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id\nNEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket\nNEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id\nNEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id\nNEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id`

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #6d28d9, #0f172a)' }}>
      {/* <Header /> */}
      <main style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ opacity: 1, transform: 'none', transition: 'none' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ padding: '1rem', background: 'linear-gradient(to right, #2563eb, #6d28d9)', borderRadius: 12, marginRight: 16 }}>
                {/* <Settings className="h-8 w-8 text-white" /> */}
                <span role="img" aria-label="settings" style={{ fontSize: 32, color: 'white' }}>⚙️</span>
              </div>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>Zephyrn Securities Setup</h1>
                <p style={{ color: '#cbd5e1', fontSize: 18 }}>Configure your Firebase backend</p>
              </div>
            </div>
          </div>

          {/* Firebase Setup Guide */}
          <div style={{ background: 'rgba(30,41,59,0.5)', borderRadius: 12, marginBottom: '2rem', padding: 24 }}>
            <h2 style={{ color: 'white', fontSize: 20, marginBottom: 8 }}>Firebase Environment Variables</h2>
            <p style={{ color: '#cbd5e1', marginBottom: 16 }}>
              Create a <code>.env.local</code> file in your project root with these variables:
            </p>
            <div style={{ position: 'relative' }}>
              <pre style={{ background: 'rgba(15,23,42,0.5)', padding: 16, borderRadius: 8, color: '#cbd5e1', fontSize: 14, overflowX: 'auto' }}>
                {envFileContent}
              </pre>
              {/* <Button ...> ... </Button> */}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            <div style={{ background: 'rgba(30,41,59,0.5)', borderRadius: 12, padding: 24 }}>
              <h3 style={{ color: 'white', fontSize: 18 }}>Need Help?</h3>
              <p style={{ color: '#cbd5e1', marginBottom: 12 }}>Get support and documentation</p>
              {/* <Button asChild variant="outline" className="w-full"> ... </Button> */}
              <a href="https://firebase.google.com/docs" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: 12, border: '1px solid #6d28d9', borderRadius: 8, color: '#6d28d9', textDecoration: 'none', width: '100%', textAlign: 'center' }}>
                {/* <ExternalLink className="w-4 h-4 mr-2" /> */}
                Firebase Documentation
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
