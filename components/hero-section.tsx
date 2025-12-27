"use client";

import { motion } from "framer-motion";
import { Dna, Zap, Brain } from "lucide-react";
import Logo from "./logo";

function DNAHelix() {
  return (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      <svg
        className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20'
        viewBox='0 0 400 400'
      >
        <defs>
          <linearGradient
            id='helix-gradient'
            x1='0%'
            y1='0%'
            x2='100%'
            y2='100%'
          >
            <stop offset='0%' stopColor='#14b8a6' />
            <stop offset='50%' stopColor='#8b5cf6' />
            <stop offset='100%' stopColor='#10b981' />
          </linearGradient>
        </defs>
        {/* DNA helix paths */}
        {[...Array(8)].map((_, i) => (
          <motion.ellipse
            key={i}
            cx='200'
            cy={50 + i * 40}
            rx={60 + Math.sin(i * 0.8) * 20}
            ry='15'
            fill='none'
            stroke='url(#helix-gradient)'
            strokeWidth='1.5'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.95, 1.05, 0.95],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
              ease: "linear",
            }}
            style={{ transformOrigin: "center" }}
          />
        ))}
      </svg>
    </div>
  );
}

function FloatingOrb({
  delay,
  x,
  y,
  size,
  color,
}: {
  delay: number;
  x: string;
  y: string;
  size: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1 }}
      className={`absolute ${x} ${y} ${size} rounded-full ${color} blur-3xl`}
      style={{ animation: `float ${6 + delay}s ease-in-out infinite` }}
    />
  );
}

export function HeroSection() {
  return (
    <section
      id='hero'
      className='relative min-h-screen flex items-center justify-center overflow-hidden'
    >
      <Logo className='absolute top-6 left-6' />
      {/* Background layers */}
      <div className='absolute inset-0 bg-slate-950' />
      <div className='absolute inset-0 mesh-gradient' />
      <div className='absolute inset-0 noise-overlay' />

      {/* Floating orbs */}
      <FloatingOrb
        delay={0.2}
        x='left-[10%]'
        y='top-[20%]'
        size='w-64 h-64'
        color='bg-teal-500/20'
      />
      <FloatingOrb
        delay={0.4}
        x='right-[15%]'
        y='top-[30%]'
        size='w-48 h-48'
        color='bg-violet-500/15'
      />
      <FloatingOrb
        delay={0.6}
        x='left-[20%]'
        y='bottom-[20%]'
        size='w-56 h-56'
        color='bg-emerald-500/10'
      />

      {/* DNA Helix visualization */}
      <DNAHelix />

      {/* Content */}
      <div className='relative z-10 max-w-5xl mx-auto px-6 text-center pt-20 md:pt-0'>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8'
        >
          <span className='relative flex h-2 w-2'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75' />
            <span className='relative inline-flex rounded-full h-2 w-2 bg-teal-500' />
          </span>
          <span className='text-sm text-slate-300'>
            Pioneering the Future of Human-Tech Integration
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className='text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-6'
        >
          <span className='text-gradient'>Live Smarter Feel Better</span>
          <br />
          <span className='text-slate-100'>Let AI Design</span>
          <br />
          <span className='text-gradient-violet'>Your Lifestyle</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed'
        >
          An AI-powered platform delivering personalized wellness insights,
          habit optimization, and future-focused lifestyle predictions—powered
          by real behavioral data.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className='flex flex-wrap justify-center gap-4'
        >
          {[
            { icon: Dna, label: "Bio-Integration" },
            { icon: Zap, label: "Neural Sync" },
            { icon: Brain, label: "AI Fusion" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              whileHover={{ scale: 1.05, y: -2 }}
              className='flex items-center gap-2 px-5 py-3 glass rounded-full cursor-default'
            >
              <item.icon className='w-4 h-4 text-teal-400' />
              <span className='text-sm text-slate-300'>{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-1.5 h-1.5 rounded-full bg-teal-400"
            />
          </motion.div>
        </motion.div> */}
      </div>
    </section>
  );
}
