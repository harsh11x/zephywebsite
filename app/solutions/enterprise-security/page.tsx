import React from 'react'
import { Shield, Lock, Brain, Globe, Zap } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Quantum-Resistant Encryption',
    description: 'Protect your enterprise with cryptography engineered for the post-quantum era. Zephyrn leads the industry with protocols that no competitor can match.'
  },
  {
    icon: Brain,
    title: 'AI-Driven Threat Intelligence',
    description: 'Our AI anticipates, detects, and neutralizes threats before they reach your business. Stay ahead of attackers and the competition.'
  },
  {
    icon: Lock,
    title: 'Zero-Compromise Reliability',
    description: '99.99% uptime, bulletproof compliance, and seamless integration for mission-critical operations.'
  },
  {
    icon: Globe,
    title: 'Global Leadership',
    description: 'Chosen by Fortune 500s and industry leaders to secure their most valuable assets worldwide.'
  },
  {
    icon: Zap,
    title: 'Instant Response',
    description: 'Sub-millisecond detection and automated incident response, so you never miss a threat.'
  }
]

export default function EnterpriseSecurityPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      {/* Minimal geometric accent */}
      <div className="absolute top-20 right-20 w-px h-40 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute bottom-40 left-20 w-40 h-px bg-gradient-to-r from-white/20 to-transparent" />
      <main className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
              Unbreakable Security for Industry Leaders
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Zephyrn Securities delivers the world's most advanced enterprise security platform—trusted by global giants, engineered for tomorrow's threats.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-8 flex items-start gap-4 hover:scale-[1.03] hover:shadow-2xl transition-transform duration-300"
              >
                <div className="p-3 bg-blue-900/30 rounded-lg">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-white/90">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold text-blue-400 mb-8">
              Don't settle for less—choose Zephyrn and leave your competitors behind.
            </p>
            <a
              href="/contact-us"
              className="inline-block mt-4 px-8 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition"
            >
              Get a Custom Security Assessment
            </a>
          </div>
        </div>
      </main>
    </div>
  )
} 