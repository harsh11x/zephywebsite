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

// Motion-wrapped components
const MotionDiv = motion.div
const MotionH1 = motion.h1
const MotionP = motion.p
const MotionSpan = motion.span

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Minimal geometric accents */}
      <div className="absolute top-20 right-20 w-px h-40 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute bottom-40 left-20 w-40 h-px bg-gradient-to-r from-white/20 to-transparent" />

      <Header />

      {/* Hero Section */}
      <section className="relative py-32 sm:py-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <MotionDiv
            style={{ y, opacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <MotionDiv
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <Badge className="bg-white/5 text-white/80 border border-white/10 px-6 py-2 text-sm font-medium backdrop-blur-sm">
                Trusted by 15,000+ Global Enterprises
              </Badge>
            </MotionDiv>

            <MotionH1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl sm:text-8xl lg:text-9xl font-light tracking-tight mb-8"
            >
              <span className="block text-white">Enterprise</span>
              <span className="block text-white/60">Cybersecurity</span>
              <span className="block text-white/30">Redefined</span>
            </MotionH1>

            <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl sm:text-2xl leading-relaxed text-white/60 max-w-4xl mx-auto mb-12 font-light"
            >
              Military-grade security platform powered by quantum-resistant encryption and AI-driven threat
              intelligence.
              <br />
              <span className="text-white/80">Protecting Fortune 500 companies worldwide.</span>
            </MotionP>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              {user ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 px-12 py-4 text-lg font-medium transform hover:scale-105 transition-all duration-300 rounded-none"
                  >
                    Access Command Center
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/pricing">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 px-12 py-4 text-lg font-medium transform hover:scale-105 transition-all duration-300 rounded-none"
                  >
                    Start Enterprise Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              )}
              <Link href="/demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/5 px-12 py-4 text-lg font-medium backdrop-blur-sm rounded-none"
                >
                  Watch Demo
                </Button>
              </Link>
            </MotionDiv>
          </MotionDiv>
        </div>
      </section>

      {/* Real-time Stats */}
      <section className="py-20 border-y border-white/10">
        <div className="container">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <div className="p-4">
              <h3 className="text-5xl font-light text-white">
                <MotionSpan animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  {stats.clients.toLocaleString()}
                </MotionSpan>
              </h3>
              <p className="text-white/60 mt-2">Global Clients</p>
            </div>
            <div className="p-4">
              <h3 className="text-5xl font-light text-white">
                <MotionSpan
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  {Math.floor(stats.threats / 1000000)}M+
                </MotionSpan>
              </h3>
              <p className="text-white/60 mt-2">Threats Neutralized</p>
            </div>
            <div className="p-4">
              <h3 className="text-5xl font-light text-white">
                <MotionSpan
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  {stats.responseTime.toFixed(2)}s
                </MotionSpan>
              </h3>
              <p className="text-white/60 mt-2">Avg. Response Time</p>
            </div>
            <div className="p-4">
              <h3 className="text-5xl font-light text-white">
                <MotionSpan
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  {stats.uptime.toFixed(2)}%
                </MotionSpan>
              </h3>
              <p className="text-white/60 mt-2">Platform Uptime</p>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="container">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-light tracking-tight text-white">The Future of Digital Defense</h2>
            <p className="text-xl text-white/60 mt-4">Unparalleled security for the modern enterprise.</p>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border border-white/10 text-center h-full">
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
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-y border-white/10">
        <div className="container">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-light tracking-tight text-white">Trusted by Industry Leaders</h2>
          </MotionDiv>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 h-full">
                  <CardContent className="pt-6">
                    <p className="text-white/80 mb-4">"{testimonial.content}"</p>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                  </CardContent>
                </Card>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-white/10">
        <div className="container text-center">
          <MotionDiv
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
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/5 px-12 py-4 text-lg font-medium rounded-none"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            )}
          </MotionDiv>
        </div>
      </section>

      <Footer />
    </div>
  )
}
