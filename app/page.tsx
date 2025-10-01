"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Brain, Lock, Globe, ArrowRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function HomePage() {
  const { user } = useAuth()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [stats, setStats] = useState({
    clients: 15400,
    threats: 847000000,
    responseTime: 0.3,
    uptime: 99.99,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        clients: prev.clients + Math.floor(Math.random() * 3),
        threats: prev.threats + Math.floor(Math.random() * 50000),
        responseTime: Math.max(0.1, prev.responseTime + (Math.random() - 0.5) * 0.05),
        uptime: Math.min(99.99, Math.max(99.95, prev.uptime + (Math.random() - 0.5) * 0.01)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Lock,
      title: "Quantum-Resistant Encryption",
      description: "Next-generation cryptographic protocols designed for the post-quantum era",
    },
    {
      icon: Brain,
      title: "AI-Powered Threat Intelligence",
      description: "Advanced machine learning algorithms with predictive threat modeling",
    },
    {
      icon: Zap,
      title: "Zero-Latency Response",
      description: "Sub-millisecond threat detection with automated incident response",
    },
    {
      icon: Globe,
      title: "Global Security Operations",
      description: "24/7 monitoring across 150+ countries with local compliance",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      content:
        "Zephyrn's platform reduced our incident response time by 94%. Their AI-driven approach is revolutionary.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      content: "The quantum-resistant encryption gives us confidence for the next decade of threats.",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      content: "Compliance became effortless. The platform handles everything seamlessly.",
      rating: 5,
    },
    {
      name: "James Mitchell",
      content: "Best security investment we've made. The threat detection is incredibly accurate.",
      rating: 5,
    },
    {
      name: "Lisa Park",
      content: "Implementation was smooth and the support team is exceptional. Highly recommended.",
      rating: 5,
    },
    {
      name: "David Thompson",
      content: "The analytics dashboard provides insights we never had before. Game-changing platform.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen text-white relative z-10 overflow-hidden">
      {/* Subtle grid pattern */}
      {/* Remove the grid background div from the homepage */}

      {/* Minimal geometric accents */}
      <div className="absolute top-20 right-20 w-px h-40 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute bottom-40 left-20 w-40 h-px bg-gradient-to-r from-white/20 to-transparent" />

      <Header />

      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 md:py-32 lg:py-40">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
          {/* Remove the static heading and subtitle here */}
          <motion.div
            style={{ y, opacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight mb-6 sm:mb-8"
            >
              <span className="block text-white">Enterprise</span>
              <span className="block text-white/60">Cybersecurity</span>
              <span className="block text-white/30">Redefined</span>
            </motion.h1>
            <Badge className="bg-white/5 text-white/80 border border-white/10 px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium backdrop-blur-sm mb-6 sm:mb-8">
              Trusted by 15,000+ Global Enterprises
            </Badge>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white/60 max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 font-light px-2 sm:px-0"
            >
              Military-grade security platform powered by quantum-resistant encryption and AI-driven threat
              intelligence.
              <br />
              <span className="text-white/80">Protecting Fortune 500 companies worldwide.</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            >
              {user ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium transform hover:scale-105 transition-all duration-300 rounded-none w-full sm:w-auto"
                  >
                    Access Command Center
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/pricing">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium transform hover:scale-105 transition-all duration-300 rounded-none w-full sm:w-auto"
                  >
                    Start Enterprise Trial
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
              )}
              <Link href="/demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/5 px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg font-medium backdrop-blur-sm rounded-none w-full sm:w-auto"
                >
                  Watch Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Real-time Stats */}
      <section className="py-12 sm:py-16 md:py-20 border-y border-white/10">
        <div className="container px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center"
          >
            <div className="p-2 sm:p-4">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white">
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  {stats.clients.toLocaleString()}
                </motion.span>
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-2">Global Clients</p>
            </div>
            <div className="p-2 sm:p-4">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white">
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  {Math.floor(stats.threats / 1000000)}M+
                </motion.span>
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-2">Threats Neutralized</p>
            </div>
            <div className="p-2 sm:p-4">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white">
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  {stats.responseTime.toFixed(2)}s
                </motion.span>
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-2">Avg. Response Time</p>
            </div>
            <div className="p-2 sm:p-4">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white">
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  {stats.uptime.toFixed(2)}%
                </motion.span>
              </h3>
              <p className="text-xs sm:text-sm text-white/60 mt-2">Platform Uptime</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-light tracking-tight text-white">The Future of Digital Defense</h2>
            <p className="text-xl text-white/60 mt-4">Unparalleled security for the modern enterprise.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="frosted-glass text-center h-full">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-y border-white/10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-light tracking-tight text-white">Trusted by Industry Leaders</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="frosted-glass h-full">
                  <CardContent className="pt-6">
                    <p className="text-white/80 mb-4">"{testimonial.content}"</p>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-white/10">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl sm:text-7xl font-light text-white mb-8">
              Ready to Transform
              <br />
              <span className="text-white/60">Your Security?</span>
            </h2>
            <p className="text-xl text-white/60 mb-12 max-w-3xl mx-auto font-light">
              Join the elite tier of organizations that trust Zephyrn Securities for their most critical assets.
            </p>
          </motion.div>
          {!user && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/pricing">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 px-12 py-4 text-lg font-medium transform hover:scale-105 transition-all duration-300 rounded-none"
                >
                  Start Enterprise Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact-us">
                <Button
                  size="lg"
                  className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 px-12 py-4 text-lg font-medium rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 transition-all duration-200"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
