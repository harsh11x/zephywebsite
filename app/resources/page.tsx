"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, FileText, Key, ArrowRight, Book, Cpu, Zap, Brain, LockKeyhole } from "lucide-react"
import Header from "@/components/header"
import Link from "next/link"

export default function ResourcesPage() {
  const resources = [
    {
      title: "Encryption Algorithms",
      description: "Learn about our advanced encryption technologies, including AES-256 for file encryption and Vigenère cipher for text security.",
      icon: Lock,
      href: "/resources/encryption-algorithms",
      features: [
        "Military-grade AES-256 encryption",
        "Advanced Vigenère cipher implementation",
        "Quantum-resistant security",
        "Industry-standard compliance"
      ]
    },
    {
      title: "Security Best Practices",
      description: "Discover essential security practices and guidelines for protecting your data effectively.",
      icon: Shield,
      href: "/resources/security-best-practices",
      features: [
        "Key management guidelines",
        "Secure communication protocols",
        "Data protection strategies",
        "Compliance requirements"
      ]
    },
    {
      title: "Technical Documentation",
      description: "Access detailed technical documentation and API references for developers.",
      icon: Book,
      href: "/resources/technical-docs",
      features: [
        "API documentation",
        "Integration guides",
        "SDK references",
        "Code examples"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-6xl font-light mb-6"
            >
              Resources
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-white/60 max-w-3xl mx-auto"
            >
              Explore our comprehensive resources to understand Zephyrn's security features,
              technical capabilities, and best practices.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
              >
                <Link href={resource.href}>
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-colors duration-300">
                    <CardHeader className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-lg">
                          <resource.icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-light text-white">{resource.title}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-white/60 text-lg">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                      <ul className="space-y-3">
                        {resource.features.map((feature) => (
                          <li key={feature} className="flex items-center text-white/80">
                            <ArrowRight className="h-4 w-4 mr-2 text-white/40" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-32 text-center"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-12">
                <h2 className="text-3xl font-light text-white mb-6">Why Choose Zephyrn</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                  <div>
                    <div className="p-4 bg-white/10 rounded-lg w-fit mx-auto mb-6">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Enterprise-Grade Security</h3>
                    <p className="text-white/60">
                      Our security solutions are designed to meet the highest industry standards
                      and protect your most sensitive data.
                    </p>
                  </div>
                  <div>
                    <div className="p-4 bg-white/10 rounded-lg w-fit mx-auto mb-6">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Optimal Performance</h3>
                    <p className="text-white/60">
                      Advanced encryption technologies ensure maximum security without
                      compromising on performance.
                    </p>
                  </div>
                  <div>
                    <div className="p-4 bg-white/10 rounded-lg w-fit mx-auto mb-6">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Intelligent Solutions</h3>
                    <p className="text-white/60">
                      Smart encryption algorithms that adapt to your needs while maintaining
                      the highest security standards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
} 