"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Crown, Building, Calendar, ArrowRight } from "lucide-react"
import { MotionDivWrapper } from "@/components/motion"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCurrency, SUPPORTED_CURRENCIES } from "@/contexts/currency-context"

export default function PricingPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const { currency, rates, loading } = useCurrency()

  const plans = [
    {
      id: "free",
      name: "Starter",
      price: 0,
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
  ]

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    if (planId === "enterprise") {
      return
    }
    router.push(`/auth?plan=${planId}`)
  }

  const openCalendly = () => {
    window.open("https://calendly.com/zephyrn-securities/30min", "_blank")
  }

  // Helper to get currency symbol
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

  // Helper to format price
  function formatPrice(usd: number) {
    if (usd === 0) return "Free"
    if (currency === "USD") return `$${usd}`
    const rate = rates[currency] || 1
    const converted = (usd * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })
    return `${getCurrencySymbol(currency)}${converted}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <Header />

      <main className="container py-16 relative z-10">
        <MotionDivWrapper initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header Section */}
          <div className="text-center mb-20">
            <Badge className="bg-white/5 text-white/80 border border-white/10 px-4 py-2 mb-8 backdrop-blur-sm">
              Enterprise Pricing
            </Badge>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white mb-8">
              <span className="block">Simple,</span>
              <span className="block text-white/60">Transparent</span>
              <span className="block text-white/30">Security</span>
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto mb-8 font-light">
              Choose the perfect plan for your cybersecurity needs. All plans include military-grade AES-256 encryption
              and our advanced threat protection.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 font-light">
                  Already have an account? Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 mb-20">
            {plans.map((plan, index) => (
              <MotionDivWrapper
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
                      {loading ? (
                        <span className="text-4xl font-light text-white animate-pulse">...</span>
                      ) : (
                        <span className="text-4xl font-light text-white">{plan.id === "enterprise" ? "Custom" : formatPrice(plan.price)}</span>
                      )}
                      {plan.period && <span className="text-white/60 ml-2 font-light">/{plan.period}</span>}
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
                          onClick={openCalendly}
                          className="w-full bg-white text-black hover:bg-white/90 font-medium rounded-none"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Call
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handlePlanSelect(plan.id)}
                          className={`w-full font-medium rounded-none ${
                            plan.popular
                              ? "bg-white text-black hover:bg-white/90"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {plan.id === "free" ? "Get Started Free" : "Get Started"}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </MotionDivWrapper>
            ))}
          </div>

          {/* Features Comparison */}
          <MotionDivWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <Card className="bg-black border border-white/10">
              <CardHeader className="text-center p-12">
                <CardTitle className="text-3xl font-light text-white mb-4">Why Choose Zephyrn Securities?</CardTitle>
                <CardDescription className="text-white/60 font-light text-lg">
                  All plans include our core security features with varying limits and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="p-12 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="text-center">
                    <div className="p-4 bg-white/10 w-fit mx-auto mb-6">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Military-Grade Security</h3>
                    <p className="text-white/60 font-light">
                      AES-256 encryption with quantum-resistant protocols for maximum security
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-white/10 w-fit mx-auto mb-6">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Lightning Fast</h3>
                    <p className="text-white/60 font-light">
                      Sub-millisecond processing with real-time threat detection and response
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="p-4 bg-white/10 w-fit mx-auto mb-6">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">24/7 Support</h3>
                    <p className="text-white/60 font-light">
                      Round-the-clock expert support with guaranteed response times
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDivWrapper>

          {/* FAQ Section */}
          <MotionDivWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-light text-white mb-12">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
              {[
                {
                  question: "Can I upgrade or downgrade my plan?",
                  answer:
                    "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
                },
                {
                  question: "Is my data secure?",
                  answer:
                    "Absolutely. We use military-grade AES-256 encryption and never store your encryption keys. Your data is encrypted client-side before transmission.",
                },
                {
                  question: "What file types are supported?",
                  answer:
                    "All plans support any file type - documents, images, videos, archives, and more. There are no restrictions on file formats.",
                },
                {
                  question: "Do you offer refunds?",
                  answer:
                    "Yes, we offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance.",
                },
              ].map((faq, index) => (
                <Card
                  key={index}
                  className="bg-black border-0 hover:bg-white/5 transition-all duration-500 rounded-none"
                >
                  <CardHeader className="p-8">
                    <CardTitle className="text-white text-lg font-light text-left">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-white/60 font-light text-left">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </MotionDivWrapper>
        </MotionDivWrapper>
      </main>

      <Footer />
    </div>
  )
}
