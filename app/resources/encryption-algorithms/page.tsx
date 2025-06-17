"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, FileText, Key, ArrowRight, ArrowLeft, RefreshCw, Cpu, Zap, Brain, LockKeyhole, Binary } from "lucide-react"
import Header from "@/components/header"

export default function EncryptionAlgorithmsPage() {
  const algorithms = [
    {
      title: "AES-256 Encryption",
      subtitle: "Military-Grade File Protection",
      description: "Advanced Encryption Standard (AES) with 256-bit key length, the gold standard in file encryption",
      icon: Lock,
      features: [
        {
          title: "Quantum-Resistant",
          description: "AES-256's key space of 2^256 makes it resistant to quantum computing attacks, ensuring long-term security",
          icon: Cpu,
        },
        {
          title: "Block Cipher Excellence",
          description: "Processes data in 128-bit blocks with sophisticated substitution-permutation network, providing robust security",
          icon: Binary,
        },
        {
          title: "Performance Optimized",
          description: "Hardware-accelerated encryption with parallel processing capabilities, ensuring minimal performance impact",
          icon: Zap,
        },
        {
          title: "Industry Standard",
          description: "Certified by NIST and trusted by governments, military, and financial institutions worldwide",
          icon: Shield,
        },
      ],
      process: [
        {
          step: "Key Expansion",
          description: "The 256-bit key is expanded into 14 round keys using a sophisticated key schedule algorithm",
        },
        {
          step: "Initial Round",
          description: "AddRoundKey operation combines the plaintext with the first round key",
        },
        {
          step: "Main Rounds",
          description: "14 rounds of SubBytes, ShiftRows, MixColumns, and AddRoundKey operations",
        },
        {
          step: "Final Round",
          description: "Final transformation without MixColumns, producing the encrypted output",
        },
      ],
      securityMetrics: {
        keySpace: "2^256 possible keys",
        attackComplexity: "Computationally infeasible",
        certification: "FIPS 197, ISO/IEC 18033-3",
        recommendedUse: "File encryption, secure storage, data at rest",
      },
    },
    {
      title: "Vigenère Cipher",
      subtitle: "Advanced Text & Number Encryption",
      description: "Polyalphabetic substitution cipher with dynamic key rotation for optimal text security",
      icon: FileText,
      features: [
        {
          title: "Dynamic Key Rotation",
          description: "Automatically rotates encryption keys based on content patterns, preventing frequency analysis",
          icon: RefreshCw,
        },
        {
          title: "Pattern Resistance",
          description: "Multiple substitution alphabets eliminate common patterns in encrypted text",
          icon: Brain,
        },
        {
          title: "Key Management",
          description: "Advanced key derivation and rotation system ensures unique encryption for each message",
          icon: Key,
        },
        {
          title: "Real-time Processing",
          description: "Optimized for instant text encryption with minimal computational overhead",
          icon: Zap,
        },
      ],
      process: [
        {
          step: "Key Generation",
          description: "Dynamic key generation based on content analysis and security requirements",
        },
        {
          step: "Pattern Analysis",
          description: "Advanced analysis of text patterns to determine optimal encryption strategy",
        },
        {
          step: "Multi-layer Encryption",
          description: "Application of multiple substitution alphabets with dynamic rotation",
        },
        {
          step: "Key Rotation",
          description: "Automatic key rotation based on content length and complexity",
        },
      ],
      securityMetrics: {
        keySpace: "Dynamic based on content",
        attackComplexity: "Resistant to frequency analysis",
        certification: "Custom implementation with NIST guidelines",
        recommendedUse: "Text messages, numerical data, real-time communication",
      },
    },
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
              Advanced Encryption Algorithms
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-white/60 max-w-3xl mx-auto"
            >
              Discover the cutting-edge encryption technologies powering Zephyrn's security platform.
              Engineered for maximum protection and optimal performance.
            </motion.p>
          </div>

          <div className="space-y-32">
            {algorithms.map((algorithm, index) => (
              <motion.div
                key={algorithm.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardHeader className="p-12">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="p-3 bg-white/10 rounded-lg">
                            <algorithm.icon className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-3xl font-light text-white">{algorithm.title}</CardTitle>
                            <CardDescription className="text-xl text-white/60 font-light mt-2">
                              {algorithm.subtitle}
                            </CardDescription>
                          </div>
                        </div>
                        <p className="text-white/80 text-lg mt-6 max-w-3xl">
                          {algorithm.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-12 pt-0">
                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                      {algorithm.features.map((feature) => (
                        <div key={feature.title} className="bg-white/5 p-6 rounded-lg">
                          <div className="p-3 bg-white/10 rounded-lg w-fit mb-4">
                            <feature.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-lg font-light text-white mb-2">{feature.title}</h3>
                          <p className="text-white/60 text-sm">{feature.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Process Steps */}
                    <div className="mb-16">
                      <h3 className="text-2xl font-light text-white mb-8">Encryption Process</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {algorithm.process.map((step, stepIndex) => (
                          <div key={step.step} className="relative">
                            <div className="bg-white/5 p-6 rounded-lg h-full">
                              <div className="flex items-center mb-4">
                                <div className="p-2 bg-white/10 rounded-lg mr-3">
                                  <span className="text-white font-light">{stepIndex + 1}</span>
                                </div>
                                <h4 className="text-lg font-light text-white">{step.step}</h4>
                              </div>
                              <p className="text-white/60 text-sm">{step.description}</p>
                            </div>
                            {stepIndex < algorithm.process.length - 1 && (
                              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                                <ArrowRight className="h-6 w-6 text-white/20" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Security Metrics */}
                    <div className="bg-white/5 p-8 rounded-lg">
                      <h3 className="text-2xl font-light text-white mb-8">Security Metrics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                          <h4 className="text-white/60 text-sm mb-2">Key Space</h4>
                          <p className="text-white font-light">{algorithm.securityMetrics.keySpace}</p>
                        </div>
                        <div>
                          <h4 className="text-white/60 text-sm mb-2">Attack Complexity</h4>
                          <p className="text-white font-light">{algorithm.securityMetrics.attackComplexity}</p>
                        </div>
                        <div>
                          <h4 className="text-white/60 text-sm mb-2">Certification</h4>
                          <p className="text-white font-light">{algorithm.securityMetrics.certification}</p>
                        </div>
                        <div>
                          <h4 className="text-white/60 text-sm mb-2">Recommended Use</h4>
                          <p className="text-white font-light">{algorithm.securityMetrics.recommendedUse}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                <h2 className="text-3xl font-light text-white mb-6">Why Our Encryption is Superior</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                  <div>
                    <div className="p-4 bg-white/10 rounded-lg w-fit mx-auto mb-6">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Uncompromising Security</h3>
                    <p className="text-white/60">
                      Our encryption algorithms are designed to withstand the most sophisticated attacks,
                      including quantum computing threats.
                    </p>
                  </div>
                  <div>
                    <div className="p-4 bg-white/10 rounded-lg w-fit mx-auto mb-6">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Optimal Performance</h3>
                    <p className="text-white/60">
                      Hardware-accelerated encryption ensures minimal impact on system performance
                      while maintaining maximum security.
                    </p>
                  </div>
                  <div>
                    <div className="p-4 bg-white/10 rounded-lg w-fit mx-auto mb-6">
                      <LockKeyhole className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-4">Proven Reliability</h3>
                    <p className="text-white/60">
                      Our encryption methods are battle-tested and trusted by enterprises worldwide
                      for their reliability and security.
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