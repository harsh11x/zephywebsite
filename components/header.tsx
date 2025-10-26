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
    <div className="fixed top-0 left-0 w-full z-50 bg-transparent">
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: '100%' }}
    >
        <div className="w-full px-4 sm:px-6 lg:px-8 flex h-14 sm:h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 group">
              <div className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-sm">
                <div>
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ display: 'inline-block' }}
            >
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
            </motion.div>
                </div>
              </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-light text-white tracking-wide">ZEPHYRN</span>
              <span className="text-xs text-white/40 font-light tracking-[0.2em]">SECURITIES</span>
            </div>
          </Link>
        </div>

          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-light bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl px-3 md:px-4 py-1 mt-0">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative transition-all duration-300 hover:text-white text-white/60 group py-1 px-2 md:px-3 rounded-lg hover:bg-white/10 whitespace-nowrap"
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
              className="mr-1 sm:mr-2 px-2 sm:px-3 text-base hover:bg-white/10 focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <Link href="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
              <div className="p-2 bg-white/10">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-light text-white tracking-wide">ZEPHYRN</span>
                <span className="text-xs text-white/40 tracking-[0.2em]">SECURITIES</span>
              </div>
            </Link>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6 flex flex-col gap-8">
              <div className="flex flex-col space-y-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                      className="text-white/60 transition-all duration-200 hover:text-white hover:bg-white/10 rounded-lg px-3 py-2 text-lg font-light"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
                {/* User actions for mobile */}
                {user ? (
                  <div className="flex flex-col space-y-4 border-t border-white/10 pt-6">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-white/80 hover:text-white text-base font-light">
                      <User className="h-4 w-4" /> Command Center
                    </Link>
                    <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-white/80 hover:text-white text-base font-light">
                      <Settings className="h-4 w-4" /> Admin Console
                    </Link>
                    <button onClick={() => { setIsOpen(false); logout(); }} className="flex items-center gap-2 text-white/60 hover:text-white text-base font-light">
                      <LogOut className="h-4 w-4" /> Secure Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4 border-t border-white/10 pt-6">
                    <Link href="/auth" onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white text-base font-light">Sign In</Link>
                    <Link href="/pricing" onClick={() => setIsOpen(false)} className="bg-white text-black hover:bg-white/90 font-medium px-6 py-2 rounded-none text-base">Start Trial</Link>
                  </div>
                )}
            </div>
          </SheetContent>
        </Sheet>

          <div className="hidden lg:flex items-center space-x-2 md:space-x-3 lg:space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                    <Button variant="ghost" size="sm" className="hover:bg-white/10 text-white font-light px-2 md:px-3">
                      <User className="h-4 w-4 mr-1 md:mr-2" />
                      <span className="hidden xl:inline text-sm">{user.email?.split("@")[0]}</span>
                    </Button>
                  </motion.div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black border-white/10">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer text-white">
                      <User className="h-4 w-4 mr-2" />
                      Command Center
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer text-white">
                      <User className="h-4 w-4 mr-2" />
                      Profile
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
              <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
                  <div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                  <Link href="/auth">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10 font-light px-2 md:px-3 text-sm"
                    >
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
                  </div>
                  <div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                  <Link href="/pricing">
                    <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium px-3 md:px-4 lg:px-6 rounded-none text-sm">
                      Start Trial
                    </Button>
                  </Link>
                </motion.div>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
    </div>
  )
}
