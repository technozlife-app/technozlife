"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Brain, Fingerprint, Network, Sparkles, Zap } from "lucide-react"

interface FeatureCardProps {
  icon: React.ElementType
  title: string
  description: string
  gradient: string
  glowColor: string
  delay: number
  className?: string
}

function FeatureCard({ icon: Icon, title, description, gradient, glowColor, delay, className = "" }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`group relative glass rounded-2xl p-6 md:p-8 overflow-hidden ${className}`}
    >
      {/* Gradient background on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`}
      />

      {/* Glow effect */}
      <div
        className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${glowColor} blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
      />

      <div className="relative z-10">
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 mb-5 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-xl font-semibold text-slate-100 mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

const features = [
  {
    icon: Brain,
    title: "Neural Processing",
    description:
      "Advanced AI algorithms that adapt to your cognitive patterns, creating a seamless mind-machine interface for enhanced decision making.",
    gradient: "from-teal-500/20 to-emerald-500/20",
    glowColor: "bg-teal-500",
  },
  {
    icon: Fingerprint,
    title: "Biometric Security",
    description:
      "256-bit encrypted bio-authentication ensuring your digital identity remains uniquely yours. Multi-layer verification protocols.",
    gradient: "from-violet-500/20 to-purple-500/20",
    glowColor: "bg-violet-500",
  },
  {
    icon: Network,
    title: "Mesh Connectivity",
    description:
      "Decentralized network architecture enabling instant synchronization across all your devices and neural endpoints.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    glowColor: "bg-cyan-500",
  },
  {
    icon: Zap,
    title: "Instant Sync",
    description:
      "Sub-millisecond response times with our proprietary quantum-bridging technology. Experience zero latency in bio-digital communication.",
    gradient: "from-amber-500/20 to-orange-500/20",
    glowColor: "bg-amber-500",
  },
]

export function FeaturesBento() {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-20"
        >
          <span className="text-sm font-medium text-teal-400 tracking-wider uppercase mb-4 block">
            Core Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6 text-balance">
            Technology That Evolves With You
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Our platform combines cutting-edge biotechnology with advanced artificial intelligence, creating an
            ecosystem that grows alongside your needs.
          </p>
        </motion.div>

        {/* Bento grid layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
          ))}
        </div>

        {/* Additional highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-6 glass rounded-2xl p-8 md:p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-violet-500/5 to-emerald-500/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-teal-500/20 to-transparent blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-teal-500/10">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                </div>
                <span className="text-sm font-medium text-teal-400">Coming Soon</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-100 mb-3">Quantum Neural Bridge</h3>
              <p className="text-slate-400 max-w-xl">
                The next generation of human-machine interface. Direct thought-to-action translation with zero
                perceptible delay. Join the waitlist for early access.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-900 flex items-center justify-center"
                  >
                    <span className="text-xs text-slate-400">{i + 1}k</span>
                  </div>
                ))}
              </div>
              <span className="text-sm text-slate-500">4,200+ on waitlist</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
