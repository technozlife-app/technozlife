"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Globe, Award, Target } from "lucide-react";

const stats = [
  { icon: Users, value: "50K+", label: "Active Integrators" },
  { icon: Globe, value: "120+", label: "Countries Reached" },
  { icon: Award, value: "15+", label: "Industry Awards" },
  { icon: Target, value: "99.8%", label: "Satisfaction Rate" },
];

const team = [
  {
    name: "Dr. Elena Voss",
    role: "Founder & Chief Scientist",
    specialty: "Neural Engineering",
  },
  { name: "Marcus Chen", role: "CTO", specialty: "Quantum Computing" },
  {
    name: "Dr. Aisha Rahman",
    role: "Head of Research",
    specialty: "Biotech Integration",
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id='about' className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0 mesh-gradient opacity-20' />

      <div className='relative max-w-7xl mx-auto px-6'>
        {/* Main content - two column layout */}
        <div
          ref={ref}
          className='flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24'
        >
          {/* Left column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className='flex-1'
          >
            <span className='text-sm font-medium text-teal-400 tracking-wider uppercase mb-4 block'>
              Our Story
            </span>
            <h2 className='text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-8'>
              Pioneering the <span className='text-gradient'>Next Chapter</span>{" "}
              of Human Evolution
            </h2>

            <div className='space-y-6 text-slate-400 leading-relaxed'>
              <p>
                Founded in 2019, Technozlife emerged from a singular vision: to
                dissolve the barrier between human consciousness and digital
                capability. What began in a small research lab has evolved into
                a global movement redefining what it means to be human in the
                digital age.
              </p>
              <p>
                Our team of neuroscientists, quantum physicists, and software
                architects work at the bleeding edge of possibility, developing
                technology that doesn't just augment human capability—it
                transcends it.
              </p>
              <p>
                We believe the future belongs to those who embrace the
                convergence. Every line of code we write, every neural pathway
                we map, brings us closer to a world where human potential knows
                no bounds.
              </p>
            </div>

            {/* Mission statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className='mt-10 p-6 glass rounded-xl border-l-4 border-teal-500'
            >
              <p className='text-lg text-slate-300 italic'>
                "Our mission is not to replace humanity, but to amplify
                it—creating technology that serves the human spirit while
                expanding its reach into the infinite."
              </p>
              <p className='mt-4 text-sm text-teal-400'>
                — Dr. Elena Voss, Founder
              </p>
            </motion.div>
          </motion.div>

          {/* Right column - Visual elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='flex-1 flex flex-col gap-6'
          >
            {/* Stats grid */}
            <div className='grid grid-cols-2 gap-4'>
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className='glass rounded-xl p-6 text-center group hover:bg-slate-800/30 transition-colors'
                >
                  <div className='inline-flex p-3 rounded-xl bg-teal-500/10 mb-4 group-hover:bg-teal-500/20 transition-colors'>
                    <stat.icon className='w-5 h-5 text-teal-400' />
                  </div>
                  <div className='text-3xl font-bold text-slate-100 mb-1'>
                    {stat.value}
                  </div>
                  <div className='text-sm text-slate-500'>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Team preview */}
            <div className='glass rounded-xl p-6'>
              <h3 className='text-sm font-medium text-slate-400 mb-6'>
                Leadership Team
              </h3>
              <div className='space-y-4'>
                {team.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className='flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/30 transition-colors'
                  >
                    <div className='w-12 h-12 rounded-full bg-linear-to-br from-teal-500/20 to-violet-500/20 flex items-center justify-center'>
                      <span className='text-sm font-medium text-slate-300'>
                        {(member.name || "")
                          .split(" ")
                          .map((n) => n[0] || "")
                          .join("")}
                      </span>
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium text-slate-200'>
                        {member.name}
                      </div>
                      <div className='text-xs text-slate-500'>
                        {member.role}
                      </div>
                    </div>
                    <span className='px-2 py-1 text-xs bg-slate-800/50 text-slate-400 rounded'>
                      {member.specialty}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
