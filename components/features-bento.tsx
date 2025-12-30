"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Brain, Fingerprint, Network, Sparkles, Zap } from "lucide-react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  glowColor: string;
  delay: number;
  className?: string;
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  glowColor,
  delay,
  className = "",
}: FeatureCardProps) {
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

      <div className='relative z-10'>
        <div
          className={`inline-flex p-3 rounded-xl bg-linear-to-br ${gradient} bg-opacity-10 mb-5 group-hover:scale-110 transition-transform duration-300`}
        >
          <img
            src={`/images/${icon}.webp`}
            alt={title}
            className='w-10 h-10 object-contain'
          />
        </div>

        <h3 className='text-xl font-semibold text-slate-100 mb-3'>{title}</h3>
        <p className='text-slate-400 leading-relaxed'>{description}</p>
      </div>
    </motion.div>
  );
}

const features = [
  {
    icon: "AI-Personalized Wellness Intelligence",
    title: "AI-Personalized Wellness Intelligence",
    description:
      "Tailored recommendations for sleep, fitness, nutrition, and mental wellness—continuously refined by your behavior and data patterns.",
    gradient: "from-teal-500/20 to-emerald-500/20",
    glowColor: "bg-teal-500",
  },
  {
    icon: "Habit Optimization Engine",
    title: "Habit Optimization Engine",
    description:
      "AI identifies friction points and growth triggers, helping you build sustainable routines that evolve with your lifestyle.",
    gradient: "from-violet-500/20 to-purple-500/20",
    glowColor: "bg-violet-500",
  },
  {
    icon: "Predictive Lifestyle Analytics",
    title: "Predictive Lifestyle Analytics",
    description:
      "Forecast wellness trends before they surface, enabling proactive decisions rather than reactive health management.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    glowColor: "bg-cyan-500",
  },
  {
    icon: "Wearable & IoT Ecosystem Integration",
    title: "Wearable & IoT Ecosystem Integration",
    description:
      "Seamlessly unify data from wearables and smart devices to create a single, intelligent view of your lifestyle.",
    gradient: "from-amber-500/20 to-orange-500/20",
    glowColor: "bg-amber-500",
  },
];

export function FeaturesBento() {
  return (
    <section id='features' className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0 mesh-gradient opacity-30' />

      <div className='relative max-w-7xl mx-auto px-6'>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='max-w-3xl mb-20'
        >
          <span className='text-sm font-medium text-teal-400 tracking-wider uppercase mb-4 block'>
            Core Capabilities
          </span>
          <h2 className='text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6 text-balance'>
            Intelligence That Understands, Predicts, and Elevates Your Lifestyle
          </h2>
          <p className='text-lg text-slate-400 leading-relaxed'>
            TechnozLife combines behavioral science, AI intelligence, and
            real-time data to transform everyday habits into optimized,
            future-ready wellness decisions.
          </p>
        </motion.div>

        {/* Bento grid layout */}
        <div className='grid md:grid-cols-2 gap-6'>
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
          className='mt-6 glass rounded-2xl p-8 md:p-10 relative overflow-hidden'
        >
          <div className='absolute inset-0 bg-linear-to-br from-teal-500/5 via-violet-500/5 to-emerald-500/5' />
          <div className='absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-teal-500/20 to-transparent blur-3xl' />

          <div className='relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-2 rounded-xl bg-teal-500/10'>
                  <img
                    src='/images/Adaptive AI Coaching.webp'
                    alt='Adaptive AI Coaching'
                    className='w-10 h-10 object-contain'
                  />
                </div>
                <span className='text-sm font-medium text-teal-400'>
                  Coming Soon
                </span>
              </div>
              <h3 className='text-2xl md:text-3xl font-serif font-bold text-slate-100 mb-3'>
                Adaptive AI Coaching
              </h3>
              <p className='text-slate-400 max-w-xl'>
                Next-generation AI coaching that learns, adapts, and guides
                lifestyle improvements in real time as your life changes.
              </p>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex -space-x-3'>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className='w-10 h-10 rounded-full bg-linear-to-br from-slate-700 to-slate-800 border-2 border-slate-900 flex items-center justify-center'
                  >
                    <span className='text-xs text-slate-400'>{i + 1}k</span>
                  </div>
                ))}
              </div>
              <span className='text-sm text-slate-500'>4,200+ on waitlist</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
