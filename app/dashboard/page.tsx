"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, FileText } from "lucide-react"
import { MotionDiv, MotionH1, MotionP } from "@/components/motion"
import Link from "next/link"
import Header from "@/components/header"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getUserDisplayName = () => {
    const metadata = user as { user_metadata?: { full_name?: string }; email?: string }
    if (metadata.user_metadata?.full_name) {
      return metadata.user_metadata.full_name
    }
    if (metadata.email) {
      return metadata.email.split("@")[0]
    }
    return "User"
  }

  const encryptionTools = [
    {
      title: "File Encryption",
      description: "Securely encrypt and decrypt files using AES-256 encryption",
      icon: Lock,
      href: "/dashboard/files",
      color: "from-white/20 to-white/5",
    },
    {
      title: "Text Encryption",
      description: "Encrypt sensitive text and messages with advanced encryption",
      icon: FileText,
      href: "/dashboard/text",
      color: "from-white/20 to-white/5",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Minimal geometric accents */}
      <div className="absolute top-20 right-20 w-px h-40 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute bottom-40 left-20 w-40 h-px bg-gradient-to-r from-white/20 to-transparent" />

      <Header />

      <main className="container py-20">
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-16 text-center">
            <MotionH1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl font-light tracking-tight mb-4"
            >
              Welcome back, {getUserDisplayName()}
            </MotionH1>
            <MotionP 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl text-white/60 font-light"
            >
              Choose your encryption tool below
            </MotionP>
          </div>

          {/* Encryption Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {encryptionTools.map((tool, index) => (
              <MotionDiv
                key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                <Link href={tool.href}>
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer group h-full">
                      <CardHeader>
                      <div className={`p-3 rounded-lg bg-gradient-to-b ${tool.color} backdrop-blur-sm w-fit group-hover:scale-110 transition-transform`}>
                        <tool.icon className="h-6 w-6 text-white" />
                        </div>
                      <CardTitle className="text-2xl font-light text-white mt-4">{tool.title}</CardTitle>
                      <CardDescription className="text-white/60 text-base font-light">
                        {tool.description}
                      </CardDescription>
                      </CardHeader>
                      <CardContent>
                      <div className="text-sm text-white/40 font-light">
                        Click to access {tool.title.toLowerCase()} tools
                      </div>
                      </CardContent>
                    </Card>
                  </Link>
              </MotionDiv>
              ))}
          </div>
        </MotionDiv>
      </main>
    </div>
  )
}
