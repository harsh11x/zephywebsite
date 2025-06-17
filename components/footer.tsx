"use client"

import Link from "next/link"
import { Shield, Mail, Phone, Github, Twitter, Linkedin } from "lucide-react"
import { motion } from "framer-motion"

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ]

  const solutions = ["Enterprise Security", "Cloud Protection", "Threat Intelligence", "Compliance Management"]
  const company = ["About", "Leadership", "Careers", "Press", "Investors"]
  const resources = ["Documentation", "API Reference", "Security Center", "Support"]

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-white/10">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="font-light text-2xl text-white tracking-wide">ZEPHYRN</span>
                  <div className="text-white/40 text-sm font-light tracking-[0.2em]">SECURITIES</div>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed max-w-md font-light">
                Protecting the world's most critical digital infrastructure with quantum-resistant encryption and
                AI-powered threat intelligence.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/5 hover:bg-white/10 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Solutions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-light text-white mb-6">Solutions</h3>
              <ul className="space-y-4">
                {solutions.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/solutions/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-white/60 hover:text-white transition-colors duration-300 text-sm font-light"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-light text-white mb-6">Company</h3>
              <ul className="space-y-4">
                {company.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-white/60 hover:text-white transition-colors duration-300 text-sm font-light"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-light text-white mb-6">Resources</h3>
              <ul className="space-y-4">
                {resources.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/resources/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-white/60 hover:text-white transition-colors duration-300 text-sm font-light"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="text-center">
            <h3 className="text-lg font-light text-white mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3 text-white/60">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-light">costumercare@zephyrnsecurities.com</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white/60">
                <Phone className="h-4 w-4" />
                <span className="text-sm font-light">+91 9888322293</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-sm text-white/40 font-light"
            >
              © 2024 Zephyrn Securities Corporation. All rights reserved.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-6 text-xs text-white/30 font-light"
            >
              <span>Enterprise Grade</span>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <span>Quantum-Ready</span>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <span>Global Scale</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
