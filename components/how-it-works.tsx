"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Download, Scan, Cpu, Rocket } from "lucide-react";

/* Updated Data for the steps
1. Define Your Lifestyle Goals
Begin by setting your wellness priorities and lifestyle preferences. TechnozLife creates a personalized profile that becomes the foundation for intelligent, AI-driven analysis.
Set Goals
Choose Focus
Prioritize Health

2. Connect Data & Understand Behavior
We securely analyze habits, routines, and wearable data to uncover behavioral patterns, lifestyle signals, and wellness opportunities unique to you.
Sync Devices

Track Habits

Analyze Patterns

3. Generate Intelligent Insights
Our AI transforms behavioral data into personalized recommendations, predictive trends, and actionable wellness strategies aligned with your daily life.
AI Recommendations

Predict Trends

Actionable Tips

4. Optimize, Adapt, and Evolve
Track progress through dynamic dashboards as TechnozLife continuously adapts recommendations, helping you refine habits and stay ahead of lifestyle challenges.
Track Progress

Adjust Routines

Unlock Wellness


*/
const steps = [
  {
    icon: Download,
    title: "Define Your Lifestyle Goals",
    description:
      "Begin by setting your wellness priorities and lifestyle preferences. TechnozLife creates a personalized profile that becomes the foundation for intelligent, AI-driven analysis.",
    details: ["Set Goals", "Choose Focus", "Prioritize Health"],
  },
  {
    icon: Scan,
    title: "Connect Data & Understand Behavior",
    description:
      "We securely analyze habits, routines, and wearable data to uncover behavioral patterns, lifestyle signals, and wellness opportunities unique to you.",
    details: ["Sync Devices", "Track Habits", "Analyze Patterns"],
  },
  {
    icon: Cpu,
    title: "Generate Intelligent Insights",
    description:
      "Our AI transforms behavioral data into personalized recommendations, predictive trends, and actionable wellness strategies aligned with your daily life.",
    details: ["AI Recommendations", "Predict Trends", "Actionable Tips"],
  },
  {
    icon: Rocket,
    title: "Optimize, Adapt, and Evolve",
    description:
      "Track progress through dynamic dashboards as TechnozLife continuously adapts recommendations, helping you refine habits and stay ahead of lifestyle challenges.",
    details: ["Track Progress", "Adjust Routines", "Unlock Wellness"],
  },
];

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className='relative'>
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`flex flex-col ${
          index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
        } items-center gap-8 lg:gap-16`}
      >
        {/* Content */}
        <div className='flex-1 text-center lg:text-left'>
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6'
          >
            <span className='text-sm font-medium text-teal-400'>
              Step {index + 1}
            </span>
          </motion.div>

          <h3 className='text-3xl md:text-4xl font-serif font-bold text-slate-100 mb-4'>
            {step.title}
          </h3>
          <p className='text-slate-400 leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0'>
            {step.description}
          </p>

          <div className='flex flex-wrap justify-center lg:justify-start gap-3'>
            {step.details.map((detail) => (
              <span
                key={detail}
                className='px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/50 rounded-full'
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
          className='relative'
        >
          <div className='relative w-48 h-48 md:w-64 md:h-64'>
            {/* Glow */}
            <div className='absolute inset-0 bg-teal-500/20 rounded-full blur-3xl' />

            {/* Circle background */}
            <div className='absolute inset-0 glass rounded-full' />

            {/* Icon */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='p-6 rounded-2xl bg-linear-to-br from-teal-500/20 to-violet-500/20'>
                <step.icon className='w-12 h-12 md:w-16 md:h-16 text-teal-400' />
              </div>
            </div>

            {/* Orbital ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className='absolute inset-0'
            >
              <div className='absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-teal-400 rounded-full' />
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
          className='hidden lg:block absolute left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-teal-500/50 to-transparent my-12'
          style={{ originY: 0 }}
        />
      )}
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id='how-it-works' className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0 mesh-gradient opacity-20' />

      <div className='relative max-w-6xl mx-auto px-6'>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <span className='text-sm font-medium text-teal-400 tracking-wider uppercase mb-4 block'>
            The Journey
          </span>
          <h2 className='text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6'>
            Four Steps to a{" "}
            <span className='text-gradient'>Self-Optimizing Lifestyle</span>
          </h2>
          <p className='text-lg text-slate-400 max-w-2xl mx-auto'>
            A future-ready wellness framework powered by behavioral intelligence
            and predictive AI.
          </p>
        </motion.div>

        {/* Steps */}
        <div className='space-y-24 lg:space-y-32'>
          {steps.map((step, index) => (
            <StepCard
              key={step.title}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
