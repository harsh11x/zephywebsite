"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, FileText, Key, ArrowRight, Building2, Users, Zap, Brain, LockKeyhole, Infinity, Server, Globe, Scale, CheckCircle2 } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EnterprisePage() {
  const features = [
    {
      title: "Unlimited Storage",
      description: "Scale your storage needs without limits. Our enterprise solution provides unlimited storage capacity for all your encryption needs.",
      icon: Infinity,
      metrics: [
        "Unlimited file uploads",
        "No storage restrictions",
        "Automatic scaling",
        "Global CDN distribution"
      ]
    },
    {
      title: "Advanced Security",
      description: "Enterprise-grade security with military-grade encryption, advanced access controls, and comprehensive audit trails.",
      icon: Shield,
      metrics: [
        "AES-256 encryption",
        "Zero-knowledge architecture",
        "Multi-factor authentication",
        "Role-based access control"
      ]
    },
    {
      title: "High Performance",
      description: "Optimized for enterprise workloads with parallel processing, hardware acceleration, and global edge computing.",
      icon: Zap,
      metrics: [
        "Hardware-accelerated encryption",
        "Parallel processing",
        "Global edge network",
        "99.99% uptime SLA"
      ]
    }
  ]

  const enterpriseBenefits = [
    {
      title: "Compliance & Certifications",
      icon: Scale,
      items: [
        "SOC 2 Type II certified",
        "ISO 27001 compliant",
        "GDPR compliant",
        "HIPAA compliant",
        "Custom compliance frameworks"
      ]
    },
    {
      title: "Enterprise Support",
      icon: Users,
      items: [
        "24/7 dedicated support",
        "Technical account manager",
        "Custom onboarding",
        "Training & documentation",
        "Priority response times"
      ]
    },
    {
      title: "Global Infrastructure",
      icon: Globe,
      items: [
        "Multi-region deployment",
        "Global CDN network",
        "Disaster recovery",
        "Geographic redundancy",
        "Low-latency access"
      ]
    }
  ]

  const securityFeatures = [
    {
      title: "Zero-Knowledge Architecture",
      description: "Your data is encrypted before it leaves your device. We never have access to your encryption keys or unencrypted data.",
      icon: LockKeyhole
    },
    {
      title: "Advanced Access Controls",
      description: "Granular permission management with role-based access control, IP restrictions, and device management.",
      icon: Key
    },
    {
      title: "Audit & Compliance",
      description: "Comprehensive audit logs, compliance reporting, and real-time security monitoring for complete visibility.",
      icon: FileText
    },
    {
      title: "Quantum-Resistant Security",
      description: "Future-proof encryption with quantum-resistant algorithms and regular security updates.",
      icon: Brain
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
          {/* Hero Section */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-6"
            >
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full">
                <Building2 className="h-5 w-5 text-white" />
                <span className="text-white/80">Enterprise Solutions</span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl font-light mb-6"
            >
              Enterprise-Grade Security
              <br />
              <span className="text-white/60">Without Compromise</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-white/60 max-w-3xl mx-auto mb-8"
            >
              Unlock unlimited storage, military-grade encryption, and enterprise-grade security
              for your organization's most sensitive data.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link href="/contact-us">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full">
                  <CardHeader className="p-8">
                    <div className="p-3 bg-white/10 rounded-lg w-fit mb-4">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-light text-white mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-white/60 text-lg">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <ul className="space-y-3">
                      {feature.metrics.map((metric) => (
                        <li key={metric} className="flex items-center text-white/80">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-white/40" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Security Features */}
          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl font-light text-center mb-12"
            >
              Advanced Security Features
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full">
                    <CardContent className="p-8">
                      <div className="p-3 bg-white/10 rounded-lg w-fit mb-4">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-light text-white mb-3">{feature.title}</h3>
                      <p className="text-white/60">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enterprise Benefits */}
          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl font-light text-center mb-12"
            >
              Enterprise Benefits
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {enterpriseBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.6 }}
                >
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full">
                    <CardHeader className="p-8">
                      <div className="p-3 bg-white/10 rounded-lg w-fit mb-4">
                        <benefit.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-light text-white">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                      <ul className="space-y-3">
                        {benefit.items.map((item) => (
                          <li key={item} className="flex items-center text-white/80">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-white/40" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-center"
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-12">
                <h2 className="text-3xl font-light text-white mb-6">Ready to Secure Your Enterprise?</h2>
                <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
                  Join leading enterprises that trust Zephyrn for their most sensitive data.
                  Get in touch with our team to discuss your security requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact-us">
                    <Button size="lg" className="bg-white text-black hover:bg-white/90">
                      Contact Sales
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/resources/encryption-algorithms">
                    <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
} 