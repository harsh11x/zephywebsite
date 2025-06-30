import React from 'react'
import { Shield, FileText, Globe, CheckCircle, Lock } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Automated Compliance',
    description: 'Zephyrn automates regulatory requirements, ensuring your business always meets the highest standards.'
  },
  {
    icon: CheckCircle,
    title: 'Audit-Ready Reporting',
    description: 'Generate instant, bulletproof audit trails and compliance reports for any region.'
  },
  {
    icon: Globe,
    title: 'Global Adaptability',
    description: 'Our platform adapts to global regulations, keeping you ahead of changing laws and standards.'
  },
  {
    icon: Lock,
    title: 'Data Integrity & Security',
    description: 'Protect sensitive data while maintaining full compliance—no compromises.'
  },
  {
    icon: Shield,
    title: 'Industry Trust',
    description: 'Zephyrn is trusted by leading organizations to deliver future-proof compliance solutions.'
  }
]

export default function ComplianceManagementPage() {
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
              Effortless Compliance Management
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Zephyrn automates compliance, adapts to global regulations, and delivers audit-ready reporting—empowering you to lead your industry with total peace of mind.
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
              Stay compliant, stay ahead—choose Zephyrn for total peace of mind.
            </p>
            <a
              href="/contact-us"
              className="inline-block mt-4 px-8 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition"
            >
              Request Compliance Consultation
            </a>
          </div>
        </div>
      </main>
    </div>
  )
} 