import React from 'react'
import { Brain, Zap, Shield, Globe, Eye } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Leverage advanced AI to predict, detect, and neutralize threats before they impact your business.'
  },
  {
    icon: Eye,
    title: 'Global Threat Visibility',
    description: 'Gain real-time insights from a global network, keeping you ahead of attackers and competitors.'
  },
  {
    icon: Zap,
    title: 'Instant Alerts',
    description: 'Receive actionable alerts the moment a threat is detected, enabling rapid response.'
  },
  {
    icon: Shield,
    title: 'Proactive Defense',
    description: 'Our intelligence platform doesn\'t just react—it anticipates and prevents attacks.'
  },
  {
    icon: Globe,
    title: 'Industry Leadership',
    description: 'Zephyrn\'s threat intelligence is trusted by the world\'s most security-conscious organizations.'
  }
]

export default function ThreatIntelligencePage() {
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
              Threat Intelligence That Outpaces Attackers
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Zephyrn delivers unrivaled threat intelligence—AI-powered, globally connected, and always one step ahead. Dominate the threat landscape with Zephyrn.
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
              Choose Zephyrn for intelligence that outsmarts, outpaces, and outperforms the rest.
            </p>
            <a
              href="/contact-us"
              className="inline-block mt-4 px-8 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition"
            >
              Request Threat Intelligence Briefing
            </a>
          </div>
        </div>
      </main>
    </div>
  )
} 