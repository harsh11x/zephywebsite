"use client"

import Link from "next/link"
import { Shield, Mail, Phone, Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ]

  const solutions = ["Enterprise Security", "Cloud Protection", "Threat Intelligence", "Compliance Management"]
  const company = [
    { name: "About", href: "/about" },
    { name: "Leadership", href: "/leadership" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Investors", href: "/investors" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Cancellation & Refund", href: "/cancellation-and-refund" },
    { name: "Privacy Policy", href: "/privacy-policy" },
  ]
  const resources = [
    { name: "Documentation", href: "/resources/documentation" },
    { name: "API Reference", href: "/resources/api-reference" },
    { name: "Security Center", href: "/resources/security-center" },
    { name: "Support", href: "/contact-us" },
  ]

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
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
              <div className="flex space-x-4 mt-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-3 bg-white/5 hover:bg-white/10 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-white/60 hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-light text-white mb-6">Solutions</h3>
              <ul className="space-y-4">
                {solutions.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/solutions/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="relative transition-colors duration-300 text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 text-sm font-light py-2"
                    >
                      {item}
                      <span className={item === "Terms & Conditions" ? "" : "absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"}></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-light text-white mb-6">Company</h3>
              <ul className="space-y-4">
                {company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="relative transition-colors duration-300 text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 text-sm font-light py-2"
                    >
                      {item.name}
                      <span className={item.name === "Terms & Conditions" ? "" : "absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"}></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-light text-white mb-6">Resources</h3>
              <ul className="space-y-4">
                {resources.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="relative transition-colors duration-300 text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 text-sm font-light py-2"
                    >
                      {item.name}
                      <span className={item.name === "Terms & Conditions" ? "" : "absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"}></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-white/40 font-light">
              © 2024 Zephyrn Securities Corporation. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-xs text-white/30 font-light">
              <span>Enterprise Grade</span>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <span>Quantum-Ready</span>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <span>Global Scale</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
