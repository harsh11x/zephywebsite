import React from 'react'
import { Code, Zap, FileText, CheckCircle, BookOpen, Shield, Database, Globe, Cpu, Lock, Activity, Users, Terminal, GitBranch, Cloud, Clock } from 'lucide-react'

const features = [
  {
    icon: Code,
    title: 'Developer-First APIs',
    description: 'Robust, flexible, and easy-to-use APIs designed for seamless integration with comprehensive SDKs.'
  },
  {
    icon: FileText,
    title: 'Comprehensive Reference',
    description: 'Every endpoint, parameter, and response is clearly documented with interactive examples and testing tools.'
  },
  {
    icon: Zap,
    title: 'Rapid Support',
    description: 'Get fast answers and integration help from Zephyrn\'s expert team with dedicated developer support.'
  },
  {
    icon: CheckCircle,
    title: 'Reliability & Security',
    description: 'Our APIs are built for mission-critical use, with industry-leading uptime, security, and compliance.'
  },
  {
    icon: BookOpen,
    title: 'Continuous Improvement',
    description: 'Zephyrn\'s API platform evolves ahead of industry trends, keeping you future-proof and competitive.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Advanced authentication, encryption, and access controls designed for enterprise-grade security.'
  },
  {
    icon: Database,
    title: 'Real-Time Data',
    description: 'WebSocket APIs and streaming endpoints for real-time data synchronization and live updates.'
  },
  {
    icon: Globe,
    title: 'Global Infrastructure',
    description: 'Multi-region deployment with edge computing for optimal performance and low latency worldwide.'
  },
  {
    icon: Cpu,
    title: 'AI-Powered Features',
    description: 'Machine learning APIs for intelligent threat detection, automation, and predictive analytics.'
  },
  {
    icon: Lock,
    title: 'Zero-Trust Architecture',
    description: 'API security built on zero-trust principles with continuous verification and minimal access.'
  },
  {
    icon: Activity,
    title: 'Performance Monitoring',
    description: 'Built-in analytics, rate limiting, and performance optimization for optimal API usage.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Role-based access, team management, and collaborative development tools for your entire team.'
  }
]

const apiEndpoints = [
  {
    method: 'GET',
    path: '/api/v1/security/threats',
    description: 'Retrieve real-time threat intelligence data',
    category: 'Security'
  },
  {
    method: 'POST',
    path: '/api/v1/encryption/encrypt',
    description: 'Encrypt sensitive data with advanced algorithms',
    category: 'Encryption'
  },
  {
    method: 'GET',
    path: '/api/v1/analytics/dashboard',
    description: 'Get comprehensive security analytics and insights',
    category: 'Analytics'
  },
  {
    method: 'POST',
    path: '/api/v1/compliance/audit',
    description: 'Generate compliance reports and audit trails',
    category: 'Compliance'
  },
  {
    method: 'PUT',
    path: '/api/v1/users/permissions',
    description: 'Update user permissions and access controls',
    category: 'User Management'
  },
  {
    method: 'GET',
    path: '/api/v1/system/health',
    description: 'Monitor system health and performance metrics',
    category: 'System'
  }
]

const apiMetrics = [
  { label: 'API Uptime', value: '99.99%', color: 'text-green-400' },
  { label: 'Response Time', value: '<50ms', color: 'text-blue-400' },
  { label: 'Rate Limit', value: '10K/min', color: 'text-yellow-400' },
  { label: 'Success Rate', value: '99.9%', color: 'text-purple-400' }
]

export default function APIReferencePage() {
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
              API Reference & Developer Hub
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Zephyrn\'s APIs are robust, secure, and developer-first—empowering you to build faster, smarter, and more reliably than the competition.
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Comprehensive documentation, interactive examples, and dedicated support to accelerate your development.
            </p>
          </div>

          {/* Coming Soon Section */}
          <div className="text-center mb-16 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-yellow-900/30 rounded-full">
                <Clock className="w-12 h-12 text-yellow-400" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-yellow-400">
              API via ZEPHYRN Coming Soon
            </h2>
            <p className="text-xl text-white/80 mb-6 max-w-3xl mx-auto">
              We're building the next generation of APIs powered by ZEPHYRN technology. Get ready for unprecedented performance, security, and developer experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <span className="px-6 py-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg text-yellow-300 font-semibold">
                🚀 Revolutionary Performance
              </span>
              <span className="px-6 py-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg text-yellow-300 font-semibold">
                🔒 Enhanced Security
              </span>
              <span className="px-6 py-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg text-yellow-300 font-semibold">
                ⚡ Lightning Fast
              </span>
            </div>
            <div className="mt-8">
              <a
                href="/contact-us"
                className="inline-block px-8 py-4 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                Join Waitlist
              </a>
            </div>
          </div>

          {/* API Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {apiMetrics.map((metric) => (
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

          {/* API Endpoints Preview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Popular API Endpoints</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {apiEndpoints.map((endpoint) => (
                <div
                  key={endpoint.path}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      endpoint.method === 'GET' ? 'bg-green-900/30 text-green-400' :
                      endpoint.method === 'POST' ? 'bg-blue-900/30 text-blue-400' :
                      endpoint.method === 'PUT' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                      {endpoint.category}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-blue-400 mb-2">{endpoint.path}</div>
                  <div className="text-white/70 text-sm">{endpoint.description}</div>
                </div>
              ))}
            </div>
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
              Ready to Build with Zephyrn APIs?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust Zephyrn\'s APIs to power their applications with enterprise-grade security and performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact-us"
                className="inline-block px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
              >
                Get API Access
              </a>
              <a
                href="/resources/documentation"
                className="inline-block px-8 py-4 rounded-lg border border-white/20 hover:bg-white/10 text-white font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                View Documentation
              </a>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-xl font-semibold text-blue-400 mb-8">
              Build with the best—choose Zephyrn for your API needs.
            </p>
            <a
              href="/contact-us"
              className="inline-block mt-4 px-8 py-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition"
            >
              Contact API Support
            </a>
          </div>
        </div>
      </main>
    </div>
  )
} 