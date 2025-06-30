import React from 'react'
import { Shield, Eye, AlertTriangle, Lock, Activity, Zap, CheckCircle, BarChart3, Users, Globe } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Real-Time Threat Detection',
    description: 'Advanced AI-powered monitoring that identifies and neutralizes threats before they impact your operations.'
  },
  {
    icon: Eye,
    title: 'Comprehensive Visibility',
    description: 'Complete oversight of your security posture with detailed analytics and actionable insights.'
  },
  {
    icon: AlertTriangle,
    title: 'Instant Alert System',
    description: 'Immediate notifications for security events with automated response protocols and escalation procedures.'
  },
  {
    icon: Lock,
    title: 'Zero-Trust Architecture',
    description: 'Multi-layered security framework that verifies every access attempt and maintains strict access controls.'
  },
  {
    icon: Activity,
    title: 'Performance Monitoring',
    description: 'Real-time system health tracking with automated optimization and performance tuning.'
  },
  {
    icon: Zap,
    title: 'Automated Response',
    description: 'Intelligent threat response that adapts to new attack patterns and minimizes manual intervention.'
  },
  {
    icon: CheckCircle,
    title: 'Compliance Management',
    description: 'Built-in compliance frameworks for SOC 2, ISO 27001, GDPR, and industry-specific regulations.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Deep security insights with predictive analytics and trend analysis for proactive defense.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamless security team coordination with role-based access and collaborative incident response.'
  },
  {
    icon: Globe,
    title: 'Global Threat Intelligence',
    description: 'Access to worldwide threat feeds and intelligence sharing networks for enhanced protection.'
  }
]

const securityMetrics = [
  { label: 'Threat Detection Rate', value: '99.9%', color: 'text-green-400' },
  { label: 'False Positive Rate', value: '<0.1%', color: 'text-blue-400' },
  { label: 'Response Time', value: '<30s', color: 'text-yellow-400' },
  { label: 'Uptime', value: '99.99%', color: 'text-purple-400' }
]

export default function SecurityCenterPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      {/* Minimal geometric accent */}
      <div className="absolute top-20 right-20 w-px h-40 bg-gradient-to-b from-white/20 to-transparent" />
      <div className="absolute bottom-40 left-20 w-40 h-px bg-gradient-to-r from-white/20 to-transparent" />
      <main className="container py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">
              Security Center
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Zephyrn's Security Center is the nerve center of digital defense, providing real-time monitoring, instant alerts, and actionable insights. Our platform is engineered to detect, respond, and neutralize threats faster and more effectively than any competitor.
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              With Zephyrn, you gain total visibility and control, ensuring your organization stays ahead of evolving threats and regulatory demands.
            </p>
          </div>

          {/* Security Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {securityMetrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className={`text-3xl font-bold mb-2 ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-sm text-white/70">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col gap-4 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="p-3 bg-blue-900/30 rounded-lg w-fit group-hover:bg-blue-900/50 transition-colors">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white/90">{feature.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Ready to Transform Your Security Posture?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of organizations that trust Zephyrn's Security Center to protect their digital assets and maintain compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact-us"
                className="inline-block px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                Schedule Security Demo
              </a>
              <a
                href="/pricing"
                className="inline-block px-8 py-4 rounded-lg border border-white/20 hover:bg-white/10 text-white font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                View Security Plans
              </a>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-xl font-semibold text-blue-400 mb-8">
              Lead the market—secure your operations with Zephyrn's Security Center.
            </p>
            <a
              href="/contact-us"
              className="inline-block mt-4 px-8 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition"
            >
              Contact Security Team
            </a>
          </div>
        </div>
      </main>
    </div>
  )
} 