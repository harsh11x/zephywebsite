"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Zap, FileText, Lock, Unlock, Clock, Calendar, ArrowUpRight, Shield, Crown, Building, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent, animate } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { MotionDivWrapper, MotionH1, MotionP } from "@/components/motion"
import { useCurrency } from "@/contexts/currency-context"

const plans = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    priceDisplay: "$0",
    period: "forever",
    description: "Essential security for small teams",
    icon: Shield,
    popular: false,
    features: [
      "File upload limit: 100 MB per file",
      "Daily encryption limit: 3 files",
      "Daily decryption limit: 3 files",
      "Any type of file supported",
      "Basic AES-256 encryption",
      "Email support",
    ],
  },
  {
    id: "standard",
    name: "Professional",
    price: 19.99,
    priceDisplay: "$19.99",
    period: "per month",
    description: "Advanced security for growing businesses",
    icon: Zap,
    popular: true,
    features: [
      "File upload limit: 1 GB per file",
      "Daily encryption limit: 50 files",
      "Daily decryption limit: 50 files",
      "Any type of file supported",
      "Advanced AES-256 encryption",
      "Priority support",
      "Encryption analytics",
      "API access",
    ],
  },
  {
    id: "professional",
    name: "Enterprise",
    price: 89.99,
    priceDisplay: "$89.99",
    period: "per month",
    description: "Complete security for large organizations",
    icon: Crown,
    popular: false,
    features: [
      "File upload limit: 10 GB per file",
      "Daily encryption limit: Unlimited",
      "Daily decryption limit: Unlimited",
      "Advanced threat detection",
      "Military-grade encryption",
      "24/7 dedicated support",
      "Advanced analytics",
      "Custom integrations",
      "Compliance reporting",
    ],
  },
  {
    id: "enterprise",
    name: "Global",
    price: 0,
    priceDisplay: "Custom",
    period: "contact us",
    description: "Tailored solutions for global enterprises",
    icon: Building,
    popular: false,
    features: [
      "Unlimited file upload size",
      "Unlimited daily operations",
      "Custom deployment",
      "Dedicated infrastructure",
      "White-label solutions",
      "SLA guarantees",
      "Custom security protocols",
      "On-premise deployment",
      "Global compliance",
    ],
  },
];

// Mock data for usage history - In production, this would come from your backend
const mockUsageHistory: Record<string, { type: string; fileName: string; timestamp: string; size: string }[]> = {
  today: [
    { type: "encrypt", fileName: "document.pdf", timestamp: "2024-03-20T10:30:00", size: "2.5MB" },
    { type: "decrypt", fileName: "report.docx", timestamp: "2024-03-20T09:15:00", size: "1.8MB" },
    { type: "encrypt", fileName: "presentation.pptx", timestamp: "2024-03-20T08:45:00", size: "5.2MB" },
  ],
  week: [
    { type: "encrypt", fileName: "contract.pdf", timestamp: "2024-03-19T15:20:00", size: "3.1MB" },
    { type: "decrypt", fileName: "budget.xlsx", timestamp: "2024-03-19T14:10:00", size: "2.3MB" },
    { type: "encrypt", fileName: "proposal.docx", timestamp: "2024-03-18T11:30:00", size: "1.5MB" },
    { type: "decrypt", fileName: "report.pdf", timestamp: "2024-03-18T10:15:00", size: "4.2MB" },
  ],
  month: [
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
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(count, typeof value === 'number' ? value : parseFloat(value as string), {
      duration: 1.5,
      ease: "easeOut"
    })
    return controls.stop
  }, [value, count])

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v))
    return unsubscribe
  }, [rounded])

  return <p className={className}>{display}</p>
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

  const { currency, rates } = useCurrency()

  function getCurrencySymbol(code: string) {
    const map: Record<string, string> = {
      USD: "$",
      INR: "₹",
      EUR: "€",
      GBP: "£",
      AUD: "A$",
      CAD: "C$",
      SGD: "S$",
    }
    return map[code] || code + " "
  }

  function formatPrice(usd: number, display: string) {
    if (display === "Custom" || usd === 0) return display
    if (currency === "USD") return `$${usd}`
    const rate = rates[currency] || 1
    const converted = (usd * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })
    return `${getCurrencySymbol(currency)}${converted}`
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    // Calculate usage statistics
    const allOperations = [...(mockUsageHistory.today || []), ...(mockUsageHistory.week || []), ...(mockUsageHistory.month || [])]
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

  const handleUpgrade = (planId: string) => {
    if (planId === "enterprise") {
      window.open("https://calendly.com/zephyrn-securities/30min", "_blank");
      return;
    }
    if (planId === "free") {
      // No upgrade for free plan
      return;
    }
    router.push(`/payment?plan=${planId}`);
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getOperationIcon = (type: string) => {
    return type === "encrypt" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />
  }

  return (
    <TooltipProvider>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 mb-20"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-white text-black px-4 py-1 font-medium">Most Popular</Badge>
                </div>
              )}
              <Card
                className={`bg-black border-0 hover:bg-white/5 transition-all duration-500 h-full rounded-none ${
                  plan.popular ? "ring-1 ring-white/20" : ""
                }`}
              >
                <CardHeader className="text-center p-12">
                  <div className="p-4 bg-white/10 w-fit mx-auto mb-6">
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-light text-white mb-4">{plan.name}</CardTitle>
                  <div className="text-center mb-4">
                    <span className="text-4xl font-light text-white">{formatPrice(plan.price, plan.priceDisplay)}</span>
                    {plan.priceDisplay !== "Custom" && <span className="text-white/60 ml-2 font-light">/{plan.period}</span>}
                  </div>
                  <CardDescription className="text-white/60 font-light">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-12 pt-0">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div className="w-1 h-1 bg-white/60 rounded-full mt-3 flex-shrink-0" />
                        <span className="text-white/80 text-sm font-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    {plan.id === "enterprise" ? (
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        className="w-full bg-white text-black hover:bg-white/90 font-medium rounded-none"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Call
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        className={`w-full font-medium rounded-none ${
                          plan.popular
                            ? "bg-white text-black hover:bg-white/90"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {plan.id === "free" ? "Get Started Free" : "Upgrade"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Total Encryptions", value: usageStats.totalEncryptions, icon: Lock, color: "from-green-400 to-green-600", tooltip: "Number of files encrypted" },
                  { label: "Total Decryptions", value: usageStats.totalDecryptions, icon: Unlock, color: "from-blue-400 to-blue-600", tooltip: "Number of files decrypted" },
                  { label: "Files Processed", value: usageStats.totalFilesProcessed, icon: FileText, color: "from-purple-400 to-purple-600", tooltip: "Unique files processed" },
                  { label: "Avg. File Size", value: usageStats.averageFileSize, icon: ArrowUpRight, color: "from-yellow-400 to-yellow-600", tooltip: "Average file size processed" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.04 }}
                  >
                    <GlowingCard>
                      <Card className="bg-gradient-to-br border-0 p-0 from-black/80 to-slate-900/80">
                        <CardContent className="p-6 flex items-center gap-4">
                          <div className={`rounded-full p-3 bg-gradient-to-br ${stat.color} shadow-lg flex items-center justify-center`}>
                            <Tooltip content={stat.tooltip}>
                              <stat.icon className="w-7 h-7 text-white" />
                            </Tooltip>
                          </div>
                          <div>
                            <p className="text-white/70 text-xs font-medium mb-1">{stat.label}</p>
                            <AnimatedNumber value={stat.value} className="text-2xl font-bold text-white" />
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>
                  </motion.div>
                ))}
              </div>

              {/* Usage History Timeline */}
              <div className="mt-12">
                <Tabs defaultValue="today" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 bg-white/5 p-1 h-12 rounded-xl">
                    <TabsTrigger value="today" onClick={() => setActiveTab("today")} className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg">Today</TabsTrigger>
                    <TabsTrigger value="week" onClick={() => setActiveTab("week")} className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg">This Week</TabsTrigger>
                    <TabsTrigger value="month" onClick={() => setActiveTab("month")} className="text-white/60 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg">This Month</TabsTrigger>
                  </TabsList>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6"
                    >
                      <ol className="relative border-l border-white/10 ml-4">
                        {mockUsageHistory[activeTab] && mockUsageHistory[activeTab].length > 0 ? (
                          mockUsageHistory[activeTab].map((item, index) => (
                            <li key={index} className="mb-10 ml-6">
                              <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-black/80 ${item.type === "encrypt" ? "bg-green-500/80" : "bg-blue-500/80"}`}>
                                {item.type === "encrypt" ? <Lock className="w-4 h-4 text-white" /> : <Unlock className="w-4 h-4 text-white" />}
                              </span>
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                  <p className="text-white font-semibold">{item.fileName}</p>
                                  <p className="text-white/60 text-xs">{item.type === "encrypt" ? "Encrypted" : "Decrypted"} • {item.size}</p>
                                </div>
                                <span className="text-white/40 text-xs">{formatTimestamp(item.timestamp)}</span>
                              </div>
                            </li>
                          ))
                        ) : (
                          <div className="text-center text-white/60 py-8">No operations found for the selected period.</div>
                        )}
                      </ol>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </div>
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
                    value: `${mockUsageHistory.today.length} / ${plans.find(p => p.id === currentPlan)?.features.find(f => f.includes("encryptions"))?.split(" ")[2] || "∞"}`,
                    icon: Lock
                  },
                  {
                    title: "Max File Size",
                    value: plans.find(p => p.id === currentPlan)?.features.find(f => f.includes("file"))?.split(" ")[2] || "10MB",
                    icon: FileText
                  },
                  {
                    title: "Days Remaining",
                    value: currentPlan === "free" ? "∞" : "30",
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
    </TooltipProvider>
  )
} 