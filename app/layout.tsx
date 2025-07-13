import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Link from "next/link"
import { CurrencyProvider } from "@/contexts/currency-context"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zephyrn Securities - Secure. Smart. Supreme.",
  description: "Military-grade cybersecurity platform with AI-powered threat detection and real-time breach response.",
  keywords: "cybersecurity, encryption, threat detection, security platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CurrencyProvider>
            <AuthProvider>
              <div className="flex-1 flex flex-col">
                {children}
              </div>
            </AuthProvider>
          </CurrencyProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
