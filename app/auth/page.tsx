"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, EyeOff, AlertCircle, ArrowLeft, Check, Phone, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AuthPage() {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get("plan")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const [countryCode, setCountryCode] = useState("+1")

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    if (selectedPlan) {
      setActiveTab("signup")
    }
  }, [selectedPlan])

  const handleEmailAuth = async (formData: FormData, isSignUp: boolean) => {
    setIsLoading(true)
    setError("")

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password)
        if (selectedPlan && selectedPlan !== "free") {
          router.push(`/payment?plan=${selectedPlan}&email=${email}`)
          return
        }
      } else {
        await signInWithEmail(email, password)
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || `Failed to ${isSignUp ? "sign up" : "sign in"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")

    try {
      await signInWithGoogle()
      if (selectedPlan && selectedPlan !== "free") {
        router.push(`/payment?plan=${selectedPlan}`)
      }
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Failed to sign in with Google")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
          >
          <Link href="/" className="inline-block mb-8">
            <div className="p-3 bg-white/5 backdrop-blur-sm inline-block mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-light text-white mb-2">ZEPHYRN SECURITIES</h1>
            <p className="text-white/40 text-sm font-light tracking-[0.2em]">ENTERPRISE SECURITY PLATFORM</p>
          </Link>
          </motion.div>

            <Card className="bg-black border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-xl font-light">
                  {selectedPlan ? "Complete Registration" : "Access Platform"}
                </CardTitle>
                <CardDescription className="text-white/60 font-light">
                  {selectedPlan ? "Join the enterprise security platform" : "Access your security dashboard"}
                </CardDescription>
              </CardHeader>

          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full bg-white/5 text-white hover:bg-white/10 font-medium py-3 transition-all duration-300"
              disabled={isLoading}
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-white/40">Or continue with email</span>
              </div>
            </div>

            <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-white/5">
                    <TabsTrigger
                      value="signin"
                  className="text-white/60 data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                  className="text-white/60 data-[state=active]:bg-white data-[state=active]:text-black"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

              <TabsContent value="signin">
                <form onSubmit={(e) => { e.preventDefault(); handleEmailAuth(new FormData(e.currentTarget), false) }}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email" className="text-white">Email</Label>
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                        placeholder="name@company.com"
                        className="bg-white/5 border-white/10 text-white"
                          required
                        />
                    </div>
                    <div>
                      <Label htmlFor="signin-password" className="text-white">Password</Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                          className="bg-white/5 border-white/10 text-white pr-10"
                            required
                          />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? (
                            <EyeOff className="h-4 w-4 text-white/60" />
                            ) : (
                            <Eye className="h-4 w-4 text-white/60" />
                            )}
                        </button>
                      </div>
                    </div>
                        </div>
                  {error && (
                    <Alert variant="destructive" className="mt-4 bg-red-500/10 border-red-500/20">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                        <Button
                          type="submit"
                    className="w-full mt-6 bg-white text-black hover:bg-white/90"
                          disabled={isLoading}
                        >
                    {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                  </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={(e) => { e.preventDefault(); handleEmailAuth(new FormData(e.currentTarget), true) }}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                        placeholder="name@company.com"
                        className="bg-white/5 border-white/10 text-white"
                              required
                            />
                          </div>
                    <div>
                      <Label htmlFor="signup-password" className="text-white">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                          className="bg-white/5 border-white/10 text-white pr-10"
                            required
                          />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            {showPassword ? (
                            <EyeOff className="h-4 w-4 text-white/60" />
                            ) : (
                            <Eye className="h-4 w-4 text-white/60" />
                            )}
                        </button>
                      </div>
                    </div>
                        </div>
                  {error && (
                    <Alert variant="destructive" className="mt-4 bg-red-500/10 border-red-500/20">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                        <Button
                          type="submit"
                    className="w-full mt-6 bg-white text-black hover:bg-white/90"
                          disabled={isLoading}
                        >
                    {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
      </div>
    </div>
  )
}
