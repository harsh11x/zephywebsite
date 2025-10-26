import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next"
import Link from "next/link"
import { CurrencyProvider } from "@/contexts/currency-context"
import PageTransition from "@/components/PageTransition"
import ClientRoot from "@/components/ClientRoot"

const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["300","400","500","600","700"] })

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
      <body className={`${mono.className} flex min-h-screen flex-col relative overflow-x-hidden`}>
        <ClientRoot>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <CurrencyProvider>
            <AuthProvider>
                <PageTransition>
                {children}
                </PageTransition>
            </AuthProvider>
          </CurrencyProvider>
        </ThemeProvider>
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </ClientRoot>
      </body>
    </html>
  )
}
