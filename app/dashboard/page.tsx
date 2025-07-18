"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, FileText, MessageCircle, Phone } from "lucide-react"
import { MotionDiv, MotionH1, MotionP } from "@/components/motion"
import Link from "next/link"
import Header from "@/components/header"
import GlassPanel from "@/components/GlassPanel"

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
    {
      title: "Secure Chat",
      description: "Connect with other users for real-time encrypted messaging and file sharing",
      icon: MessageCircle,
      href: "/dashboard/chat",
      color: "from-white/20 to-white/5",
    },
    {
      title: "Voice & Video Call",
      description: "Make secure, end-to-end encrypted voice and video calls with AES-256 encryption",
      icon: Phone,
      href: "/dashboard/voice",
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
          <div className="mb-8 sm:mb-12 md:mb-16 text-center">
            <MotionH1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-2 sm:mb-4">
              Welcome back, {getUserDisplayName()}
              </div>
            </MotionH1>
            <MotionP 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="text-base sm:text-lg md:text-xl text-white/60 font-light px-4 sm:px-0">
              Choose your encryption tool below
              </div>
            </MotionP>
          </div>

          {/* Encryption Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl sm:max-w-5xl mx-auto px-4 sm:px-0">
            {encryptionTools.map((tool, index) => (
              <div key={tool.title} className="bg-white/10 backdrop-blur-lg border-2 border-white/20 shadow-lg rounded-xl p-6 group cursor-pointer h-full transition-transform duration-300 hover:bg-white/20 hover:shadow-xl">
                <Link href={tool.href} className="block h-full">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-b ${tool.color} backdrop-blur-sm w-fit group-hover:scale-110 transition-transform`}>
                        <tool.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="text-lg sm:text-xl md:text-2xl font-light text-white mt-3 sm:mt-4">{tool.title}</div>
                      <div className="text-sm sm:text-base text-white/60 font-light mt-2">{tool.description}</div>
                    </div>
                    <div className="text-xs sm:text-sm text-white/40 font-light mt-4 sm:mt-6 md:mt-8">Click to access {tool.title.toLowerCase()} tools</div>
                  </div>
                  </Link>
              </div>
              ))}
          </div>
        </MotionDiv>
      </main>
    </div>
  )
}
