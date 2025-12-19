"use client"

import type React from "react"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Activity, Cpu, Waves, Zap, TrendingUp, Shield } from "lucide-react"

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  delay,
}: {
  icon: React.ElementType
  label: string
  value: string
  trend: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs text-emerald-400 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-100">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </motion.div>
  )
}

function WaveformVisual() {
  return (
    <div className="flex items-end gap-1 h-16">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-gradient-to-t from-teal-500/50 to-teal-400 rounded-full"
          animate={{
            height: [`${20 + Math.random() * 40}%`, `${40 + Math.random() * 50}%`, `${20 + Math.random() * 40}%`],
          }}
          transition={{
            duration: 1 + Math.random(),
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  )
}

export function NeuralDashboard() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-50" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-teal-400 tracking-wider uppercase mb-4 block">
            Neural Interface
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-4">Your Digital Command Center</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Monitor, analyze, and optimize your bio-digital integration in real-time with our advanced neural dashboard.
          </p>
        </motion.div>

        {/* 3D Perspective Dashboard */}
        <motion.div
          initial={{ opacity: 0, rotateX: 20, y: 100 }}
          animate={isInView ? { opacity: 1, rotateX: 8, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-5xl"
          style={{ perspective: "1000px" }}
        >
          <div className="glass-strong rounded-2xl p-6 md:p-8 glow-teal transform-gpu">
            {/* Dashboard header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-500/10">
                  <Cpu className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Neural Core</h3>
                  <p className="text-xs text-slate-500">System Status: Optimal</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-sm text-emerald-400">Live</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={Activity}
                label="Neural Activity"
                value="98.7%"
                trend="+2.4%"
                color="bg-teal-500/10 text-teal-400"
                delay={0.1}
              />
              <StatCard
                icon={Zap}
                label="Sync Rate"
                value="1.2ms"
                trend="-0.3ms"
                color="bg-violet-500/10 text-violet-400"
                delay={0.2}
              />
              <StatCard
                icon={Waves}
                label="Wave Pattern"
                value="Alpha"
                trend="Stable"
                color="bg-emerald-500/10 text-emerald-400"
                delay={0.3}
              />
              <StatCard
                icon={Shield}
                label="Security"
                value="256-bit"
                trend="Encrypted"
                color="bg-cyan-500/10 text-cyan-400"
                delay={0.4}
              />
            </div>

            {/* Waveform visualization */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">Neural Waveform Analysis</span>
                <span className="text-xs text-slate-500">Last 60 seconds</span>
              </div>
              <WaveformVisual />
            </div>
          </div>

          {/* Reflection effect */}
          <div
            className="absolute inset-x-0 -bottom-20 h-20 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"
            style={{ transform: "scaleY(-1) translateY(-100%)", opacity: 0.3, filter: "blur(8px)" }}
          />
        </motion.div>
      </div>
    </section>
  )
}
