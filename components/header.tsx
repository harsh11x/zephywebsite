"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Shield, LogOut, User, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export default function Header() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Platform", href: "/platform" },
    { name: "Solutions", href: "/solutions" },
    { name: "Pricing", href: "/pricing" },
    { name: "Resources", href: "/resources" },
    { name: "Enterprise", href: "/enterprise" },
    { name: "Contact Us", href: "/contact-us" },
    ...(user ? [{ name: "Dashboard", href: "/dashboard" }] : []),
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex h-20 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-4 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="p-2 bg-white/10 backdrop-blur-sm"
            >
              <Shield className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-light text-white tracking-wide">ZEPHYRN</span>
              <span className="text-xs text-white/40 font-light tracking-[0.2em]">SECURITIES</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-10 text-sm font-light">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative transition-all duration-300 hover:text-white text-white/60 group py-2"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

        <div className="flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-white/10 focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6 text-white" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 bg-black border-white/10">
            <Link href="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
              <div className="p-2 bg-white/10">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-light text-white tracking-wide">ZEPHYRN</span>
                <span className="text-xs text-white/40 tracking-[0.2em]">SECURITIES</span>
              </div>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-white/60 transition-colors hover:text-white py-2 text-lg font-light"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="sm" className="hover:bg-white/10 text-white font-light">
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">{user.email?.split("@")[0]}</span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black border-white/10">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer text-white">
                      <User className="h-4 w-4 mr-2" />
                      Command Center
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer text-white">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Console
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-white/60 focus:text-white">
                    <LogOut className="h-4 w-4 mr-2" />
                    Secure Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10 font-light"
                    >
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/pricing">
                    <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium px-6 rounded-none">
                      Start Trial
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
