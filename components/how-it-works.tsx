"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Download, Scan, Cpu, Rocket } from "lucide-react"

const steps = [
  {
    icon: Download,
    title: "Initialize",
    description:
      "Download and install the Technozlife core package. Our intelligent installer configures your system automatically, detecting hardware capabilities and optimizing settings.",
    details: ["Auto-hardware detection", "System optimization", "Secure installation"],
  },
  {
    icon: Scan,
    title: "Calibrate",
    description:
      "Complete a brief neural mapping session. Our AI learns your unique cognitive patterns, creating a personalized interface blueprint for optimal integration.",
    details: ["Neural pattern analysis", "Cognitive mapping", "Personalization engine"],
  },
  {
    icon: Cpu,
    title: "Integrate",
    description:
      "Your bio-digital bridge is established. The system begins synchronizing with your daily activities, learning and adapting to enhance your natural capabilities.",
    details: ["Real-time sync", "Adaptive learning", "Seamless fusion"],
  },
  {
    icon: Rocket,
    title: "Transcend",
    description:
      "Experience the full potential of human-tech convergence. Access enhanced cognitive abilities, instant data recall, and intuitive control over your digital ecosystem.",
    details: ["Enhanced cognition", "Instant recall", "Unified control"],
  },
]

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0]
  index: number
  isLast: boolean
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8 lg:gap-16`}
      >
        {/* Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
          >
            <span className="text-sm font-medium text-teal-400">Step {index + 1}</span>
          </motion.div>

          <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-4">{step.title}</h3>
          <p className="text-slate-400 leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">{step.description}</p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {step.details.map((detail) => (
              <span
                key={detail}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 rounded-full"
              >
                {detail}
              </span>
            ))}
          </div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div className="relative w-48 h-48 md:w-64 md:h-64">
            {/* Glow */}
            <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-3xl" />

            {/* Circle background */}
            <div className="absolute inset-0 glass rounded-full" />

            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/20 to-violet-500/20">
                <step.icon className="w-12 h-12 md:w-16 md:h-16 text-teal-400" />
              </div>
            </div>

            {/* Orbital ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-400 rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Connecting line */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-teal-500/50 to-transparent my-12"
          style={{ originY: 0 }}
        />
      )}
    </div>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-20" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-teal-400 tracking-wider uppercase mb-4 block">The Journey</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6">
            Four Steps to <span className="text-gradient">Transcendence</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Your transformation begins with a simple download and evolves into a complete bio-digital integration.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-24 lg:space-y-32">
          {steps.map((step, index) => (
            <StepCard key={step.title} step={step} index={index} isLast={index === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
