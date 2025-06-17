"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, FileText, Lock, Unlock, Clock, Calendar, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { cn } from "@/lib/utils"

// Create properly typed motion components
const MotionDiv = motion<HTMLDivElement>("div")
const MotionMain = motion<HTMLElement>("main")
const MotionSection = motion<HTMLElement>("section")
const MotionH1 = motion<HTMLHeadingElement>("h1")
const MotionP = motion<HTMLParagraphElement>("p")
const MotionSpan = motion<HTMLSpanElement>("span")
const MotionLi = motion<HTMLLIElement>("li")

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out Zephyr",
    features: [
      "5 encryptions per day",
      "Max file size: 10MB",
      "Basic encryption algorithms",
      "Email support"
    ],
    maxFileSize: "10MB",
    dailyLimit: 5,
    badge: ""
  },
  {
    name: "Pro",
    price: "$9.99",
    description: "Ideal for individuals and small teams",
    features: [
      "50 encryptions per day",
      "Max file size: 100MB",
      "Advanced encryption algorithms",
      "Priority email support",
      "No watermarks"
    ],
    maxFileSize: "100MB",
    dailyLimit: 50,
    badge: "POPULAR"
  },
  {
    name: "Business",
    price: "$24.99",
    description: "Perfect for small businesses",
    features: [
      "Unlimited encryptions",
      "Max file size: 500MB",
      "Enterprise-grade encryption",
      "24/7 priority support",
      "API access",
      "Team management"
    ],
    maxFileSize: "500MB",
    dailyLimit: -1,
    badge: ""
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited everything",
      "Custom file size limits",
      "Custom encryption algorithms",
      "Dedicated support team",
      "Custom API integration",
      "Advanced analytics",
      "SLA guarantee"
    ],
    maxFileSize: "Custom",
    dailyLimit: -1,
    badge: "ENTERPRISE"
  }
]

// Mock data for usage history - In production, this would come from your backend
const mockUsageHistory = {
  today: [
    { type: "encrypt", fileName: "document.pdf", timestamp: "2024-03-20T10:30:00", size: "2.5MB" },
    { type: "decrypt", fileName: "report.docx", timestamp: "2024-03-20T09:15:00", size: "1.8MB" },
    { type: "encrypt", fileName: "presentation.pptx", timestamp: "2024-03-20T08:45:00", size: "5.2MB" },
  ],
  thisWeek: [
    { type: "encrypt", fileName: "contract.pdf", timestamp: "2024-03-19T15:20:00", size: "3.1MB" },
    { type: "decrypt", fileName: "budget.xlsx", timestamp: "2024-03-19T14:10:00", size: "2.3MB" },
    { type: "encrypt", fileName: "proposal.docx", timestamp: "2024-03-18T11:30:00", size: "1.5MB" },
    { type: "decrypt", fileName: "report.pdf", timestamp: "2024-03-18T10:15:00", size: "4.2MB" },
  ],
  thisMonth: [
    { type: "encrypt", fileName: "annual-report.pdf", timestamp: "2024-03-15T16:45:00", size: "8.7MB" },
    { type: "decrypt", fileName: "financial-statement.xlsx", timestamp: "2024-03-14T13:20:00", size: "3.4MB" },
    { type: "encrypt", fileName: "presentation.pptx", timestamp: "2024-03-13T09:30:00", size: "6.1MB" },
    { type: "decrypt", fileName: "contract.pdf", timestamp: "2024-03-12T14:15:00", size: "2.8MB" },
  ]
}

// Add new UI components
const GradientBorder = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative p-[1px] rounded-xl overflow-hidden", className)}>
    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 animate-gradient-x" />
    <div className="relative bg-black/90 backdrop-blur-xl rounded-xl">
      {children}
    </div>
  </div>
)

const GlowingCard = ({ children, className, glowColor = "white" }: { children: React.ReactNode; className?: string; glowColor?: string }) => (
  <div className={cn("relative group", className)}>
    <div className={cn(
      "absolute -inset-0.5 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500",
      `group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`
    )} />
    <div className="relative bg-black/90 backdrop-blur-xl rounded-xl">
      {children}
    </div>
  </div>
)

const AnimatedNumber = ({ value, className }: { value: number | string; className?: string }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  useEffect(() => {
    const controls = animate(count, typeof value === 'number' ? value : parseFloat(value as string), {
      duration: 1.5,
      ease: "easeOut"
    })
    return controls.stop
  }, [value])

  return <motion.span className={className}>{rounded}</motion.span>
}

export default function PlatformPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [activeTab, setActiveTab] = useState("today")
  const [currentPlan, setCurrentPlan] = useState("Free")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [usageStats, setUsageStats] = useState({
    totalEncryptions: 0,
    totalDecryptions: 0,
    totalFilesProcessed: 0,
    averageFileSize: "0MB"
  })

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const cardScale = useTransform(smoothProgress, [0, 0.5], [1, 0.95])
  const cardOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0.8])
  const cardY = useTransform(smoothProgress, [0, 0.5], [0, 50])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    // Calculate usage statistics
    const allOperations = [...mockUsageHistory.today, ...mockUsageHistory.thisWeek, ...mockUsageHistory.thisMonth]
    const uniqueFiles = new Set(allOperations.map(op => op.fileName))
    
    const totalEncryptions = allOperations.filter(op => op.type === "encrypt").length
    const totalDecryptions = allOperations.filter(op => op.type === "decrypt").length
    
    // Calculate average file size
    const totalSize = allOperations.reduce((acc, op) => {
      const size = parseFloat(op.size)
      return acc + (isNaN(size) ? 0 : size)
    }, 0)
    const avgSize = totalSize / allOperations.length

    setUsageStats({
      totalEncryptions,
      totalDecryptions,
      totalFilesProcessed: uniqueFiles.size,
      averageFileSize: `${avgSize.toFixed(1)}MB`
    })
  }, [])

  if (authLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-32 h-32 rounded-full border-2 border-white/20"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border-t-2 border-white"
              />
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-white/5 blur-xl"
            />
          </div>
        </div>
      </>
    )
  }

  if (!user) {
    return null
  }

  const handleUpgrade = async (planName: string) => {
    setIsUpgrading(true)
    try {
      // Here you would integrate with your payment provider (e.g., Stripe)
      // and handle the subscription change
      console.log(`Upgrading to ${planName}`)
      
      // For enterprise, redirect to contact page
      if (planName === "Enterprise") {
        router.push("/contact-us")
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message or redirect to payment
      alert("This is a demo. In production, this would redirect to payment.")
    } catch (error) {
      console.error("Error upgrading plan:", error)
      alert("Error upgrading plan. Please try again.")
    } finally {
      setIsUpgrading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getOperationIcon = (type: string) => {
    return type === "encrypt" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />
  }

  return (
    <>
      <Header />
      <motion.main
        style={{ opacity: cardOpacity, scale: cardScale, y: cardY }}
        className="container max-w-6xl py-12 space-y-12"
      >
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <h1 className="text-5xl font-light text-white tracking-tight">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Plan</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Select the perfect plan for your needs. All plans include our core encryption features.
          </motion.p>
        </motion.section>

        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * index }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredCard(plan.name)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <GlowingCard
                className={cn(
                  "h-full transition-all duration-300",
                  hoveredCard === plan.name && "shadow-2xl"
                )}
              >
                <Card className="relative overflow-hidden border-0 bg-transparent">
                  {plan.badge && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="absolute -top-3 -right-3 z-10"
                    >
                      <div className="bg-white text-black px-4 py-1.5 text-sm font-medium rounded-full shadow-lg">
                        {plan.badge}
                      </div>
                    </motion.div>
                  )}
                  <CardHeader className="space-y-4">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-light text-white">{plan.name}</CardTitle>
                      <div className="flex items-baseline space-x-1">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 * index }}
                          className="text-3xl font-light text-white"
                        >
                          {plan.price}
                        </motion.span>
                        {plan.price !== "Custom" && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 * index + 0.1 }}
                            className="text-white/40"
                          >
                            /month
                          </motion.span>
                        )}
                      </div>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * featureIndex }}
                          className="flex items-start space-x-3 text-white/80"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.3 }}
                            className="mt-1"
                          >
                            <Check className="w-4 h-4 text-white/60" />
                          </motion.div>
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button
                        onClick={() => handleUpgrade(plan.name)}
                        disabled={isUpgrading}
                        className={cn(
                          "w-full h-12 text-base font-medium transition-all duration-300",
                          plan.name === "Enterprise"
                            ? "bg-white/10 hover:bg-white/20 text-white"
                            : "bg-white text-black hover:bg-white/90"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {isUpgrading ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center space-x-2"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                              </motion.div>
                              <span>Processing...</span>
                            </motion.div>
                          ) : plan.name === "Enterprise" ? (
                            <motion.span
                              key="contact"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center space-x-2"
                            >
                              <span>Contact Sales</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="upgrade"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center space-x-2"
                            >
                              <span>Upgrade Now</span>
                              <Zap className="w-4 h-4" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </GlowingCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Usage Statistics */}
        <GradientBorder>
          <Card className="bg-transparent border-0">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-2"
              >
                <CardTitle className="text-3xl font-light text-white">Usage Statistics</CardTitle>
                <CardDescription className="text-white/60 text-lg">
                  Your encryption activity and usage metrics
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {[
                  { label: "Total Encryptions", value: usageStats.totalEncryptions, icon: Lock },
                  { label: "Total Decryptions", value: usageStats.totalDecryptions, icon: Unlock },
                  { label: "Files Processed", value: usageStats.totalFilesProcessed, icon: FileText },
                  { label: "Avg. File Size", value: usageStats.averageFileSize, icon: ArrowUpRight }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <GlowingCard>
                      <Card className="bg-transparent border-0">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-white/60 text-sm font-medium">{stat.label}</p>
                              <AnimatedNumber
                                value={stat.value}
                                className="text-3xl font-light text-white"
                              />
                            </div>
                            <motion.div
                              whileHover={{ rotate: 360, scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                              className="p-3 bg-white/5 rounded-lg"
                            >
                              <stat.icon className="w-6 h-6 text-white/40" />
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>
                  </motion.div>
                ))}
              </motion.div>

              {/* Usage History */}
              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <Tabs defaultValue="today" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="bg-white/5 border-white/10 backdrop-blur-sm mb-6 p-1">
                    {[
                      { value: "today", icon: Clock, label: "Today" },
                      { value: "week", icon: Calendar, label: "This Week" },
                      { value: "month", icon: Calendar, label: "This Month" }
                    ].map((tab, index) => (
                      <motion.div
                        key={tab.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * index }}
                      >
                        <TabsTrigger
                          value={tab.value}
                          className={cn(
                            "data-[state=active]:bg-white/10 transition-all duration-300",
                            "px-6 py-2.5 text-sm font-medium"
                          )}
                        >
                          <tab.icon className="w-4 h-4 mr-2" />
                          {tab.label}
                        </TabsTrigger>
                      </motion.div>
                    ))}
                  </TabsList>

                  <AnimatePresence mode="wait">
                    {["today", "week", "month"].map((period) => (
                      <TabsContent key={period} value={period} className="space-y-4">
                        {mockUsageHistory[period as keyof typeof mockUsageHistory].map((operation, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3, delay: 0.05 * index }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <GlowingCard>
                              <Card className="bg-transparent border-0">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <motion.div
                                        className="p-3 bg-white/5 rounded-lg"
                                        whileHover={{ scale: 1.1, rotate: 360 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        {getOperationIcon(operation.type)}
                                      </motion.div>
                                      <div className="space-y-1">
                                        <motion.p
                                          className="text-white font-medium"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ duration: 0.3, delay: 0.1 * index }}
                                        >
                                          {operation.fileName}
                                        </motion.p>
                                        <motion.p
                                          className="text-white/60 text-sm"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                          transition={{ duration: 0.3, delay: 0.1 * index + 0.05 }}
                                        >
                                          {formatTimestamp(operation.timestamp)}
                                        </motion.p>
                                      </div>
                                    </div>
                                    <motion.div
                                      className="text-right space-y-1"
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: 0.1 * index }}
                                    >
                                      <p className="text-white/80 font-medium">{operation.size}</p>
                                      <p className="text-white/40 text-sm capitalize">{operation.type}ed</p>
                                    </motion.div>
                                  </div>
                                </CardContent>
                              </Card>
                            </GlowingCard>
                          </motion.div>
                        ))}
                      </TabsContent>
                    ))}
                  </AnimatePresence>
                </Tabs>
              </motion.div>
            </CardContent>
          </Card>
        </GradientBorder>

        {/* Current Usage Limits */}
        <GradientBorder>
          <Card className="bg-transparent border-0">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-2"
              >
                <CardTitle className="text-3xl font-light text-white">Current Usage Limits</CardTitle>
                <CardDescription className="text-white/60 text-lg">
                  Your usage statistics for the current billing period
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                {[
                  {
                    title: "Encryptions Today",
                    value: `${mockUsageHistory.today.length} / ${plans.find(p => p.name === currentPlan)?.dailyLimit || "∞"}`,
                    icon: Lock
                  },
                  {
                    title: "Max File Size",
                    value: plans.find(p => p.name === currentPlan)?.maxFileSize || "10MB",
                    icon: FileText
                  },
                  {
                    title: "Days Remaining",
                    value: currentPlan === "Free" ? "∞" : "30",
                    icon: Clock
                  }
                ].map((limit, index) => (
                  <motion.div
                    key={limit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <GlowingCard>
                      <Card className="bg-transparent border-0">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-light text-white">{limit.title}</CardTitle>
                            <motion.div
                              whileHover={{ rotate: 360, scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                              className="p-2 bg-white/5 rounded-lg"
                            >
                              <limit.icon className="w-5 h-5 text-white/40" />
                            </motion.div>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 * index }}
                          >
                            <CardDescription className="text-2xl text-white font-light">
                              {limit.value}
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                      </Card>
                    </GlowingCard>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </GradientBorder>
      </motion.main>
    </>
  )
} 