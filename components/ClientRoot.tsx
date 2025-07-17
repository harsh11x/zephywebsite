"use client"
import React from "react"
import TerminalMatrixBackground from "@/components/TerminalMatrixBackground"
import { usePathname } from "next/navigation"

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div>
      {pathname === "/" && <TerminalMatrixBackground />}
      {children}
    </div>
  )
} 