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
          <motion.div
            style={{ y, opacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <Badge className="bg-white/5 text-white/80 border border-white/10 px-6 py-2 text-sm font-medium backdrop-blur-sm">
                Trusted by 15,000+ Global Enterprises
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl sm:text-8xl lg:text-9xl font-light tracking-tight mb-8"
            >
              <span className="block text-white">Enterprise</span>
              <span className="block text-white/60">Cybersecurity</span>
              <span className="block text-white/30">Redefined</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl sm:text-2xl leading-relaxed text-white/60 max-w-4xl mx-auto mb-12 font-light"
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Real-time Stats */}
      <section className="py-20 border-y border-white/10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <motion.div
                className="text-4xl lg:text-6xl font-light text-white mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {stats.clients.toLocaleString()}+
              </motion.div>
              <div className="text-white/60 font-medium">Global Enterprises</div>
              <div className="text-white/40 text-sm">Protected Daily</div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl lg:text-6xl font-light text-white mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              >
                {(stats.threats / 1000000).toFixed(0)}M+
              </motion.div>
              <div className="text-white/60 font-medium">Threats Blocked</div>
              <div className="text-white/40 text-sm">This Month</div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl lg:text-6xl font-light text-white mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              >
                {stats.responseTime.toFixed(1)}ms
              </motion.div>
              <div className="text-white/60 font-medium">Response Time</div>
              <div className="text-white/40 text-sm">Average Detection</div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-4xl lg:text-6xl font-light text-white mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
              >
                {stats.uptime.toFixed(2)}%
              </motion.div>
              <div className="text-white/60 font-medium">Uptime SLA</div>
              <div className="text-white/40 text-sm">Enterprise Grade</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-white/5 text-white/80 border border-white/10 px-4 py-2 mb-8 backdrop-blur-sm">
              Enterprise Capabilities
            </Badge>
            <h2 className="text-5xl sm:text-7xl font-light text-white mb-6">
              Uncompromising
              <br />
              <span className="text-white/60">Security</span>
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light">
              Built for enterprises that demand the highest level of cybersecurity protection and compliance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="bg-black border-0 hover:bg-white/5 transition-all duration-500 h-full rounded-none">
                  <CardHeader className="p-12">
                    <div className="p-4 bg-white/10 rounded-none w-fit mb-6 group-hover:bg-white/20 transition-all duration-300">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-light text-white mb-4">{feature.title}</CardTitle>
                    <CardDescription className="text-white/60 text-lg leading-relaxed font-light">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 border-t border-white/10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="bg-white/5 text-white/80 border border-white/10 px-4 py-2 mb-8 backdrop-blur-sm">
              Customer Success
            </Badge>
            <h2 className="text-5xl sm:text-7xl font-light text-white mb-6">
              Trusted by
              <br />
              <span className="text-white/60">Industry Leaders</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-black border-0 hover:bg-white/5 transition-all duration-500 h-full rounded-none">
                  <CardContent className="p-12">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white/60 rounded-full mr-2" />
                      ))}
                    </div>
                    <p className="text-white/80 text-lg mb-8 font-light leading-relaxed">"{testimonial.content}"</p>
                    <div className="border-t border-white/10 pt-6">
                      <div className="font-light text-white text-lg">{testimonial.name}</div>
                    </div>
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
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
