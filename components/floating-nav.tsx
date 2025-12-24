"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Layers,
  Sparkles,
  DollarSign,
  Users,
  Mail,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { icon: Home, label: "Home", href: "/#hero" },
  { icon: Layers, label: "Features", href: "/#features" },
  { icon: Sparkles, label: "How It Works", href: "/#how-it-works" },
  { icon: DollarSign, label: "Pricing", href: "/#pricing" },
  { icon: Users, label: "About", href: "/#about" },
  { icon: Mail, label: "Contact", href: "/#contact" },
];

import { useAuth } from "@/lib/auth-context";

export function FloatingNav(props: {
  progress?: number;
  showProgress?: boolean;
}) {
  const { progress, showProgress } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { user, isLoading } = useAuth();

  const pct = Math.max(0, Math.min(100, progress ?? 0));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [svgSize, setSvgSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || !pathRef.current) return;

    const updatePath = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      const stroke = 3; // match strokeWidth
      const inset = stroke / 2; // inset so stroke doesn't overflow
      // Make the capsule fully rounded: radius = approx half the inner height
      const r = Math.max(6, Math.floor((h - stroke) / 2));

      // Rounded rect path inset by stroke/2
      const d = [
        `M ${inset + r} ${inset}`,
        `H ${w - inset - r}`,
        `A ${r} ${r} 0 0 1 ${w - inset} ${inset + r}`,
        `V ${h - inset - r}`,
        `A ${r} ${r} 0 0 1 ${w - inset - r} ${h - inset}`,
        `H ${inset + r}`,
        `A ${r} ${r} 0 0 1 ${inset} ${h - inset - r}`,
        `V ${inset + r}`,
        `A ${r} ${r} 0 0 1 ${inset + r} ${inset}`,
        `Z`,
      ].join(" ");

      pathRef.current!.setAttribute("d", d);
      setSvgSize({ w, h });

      const len = (pathRef.current as any).getTotalLength?.();
      if (len) {
        pathRef.current!.style.strokeDasharray = `${len}`;
        const offset = Math.max(0, Math.min(1, 1 - pct / 100)) * len;
        pathRef.current!.style.strokeDashoffset = `${offset}`;
      }
    };

    updatePath();

    const onResize = () => updatePath();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pct]);

  useEffect(() => {
    if (!pathRef.current) return;
    const len = (pathRef.current as any).getTotalLength?.();
    if (len) {
      const offset = Math.max(0, Math.min(1, 1 - pct / 100)) * len;
      // Smoother, slightly longer transition and more natural easing
      pathRef.current!.style.transition =
        "stroke-dashoffset 900ms cubic-bezier(.16,.84,.24,1), opacity 300ms ease";
      pathRef.current!.style.strokeDashoffset = `${offset}`;
    }
  }, [pct]);

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50'
    >
      <div className='relative'>
        <div
          ref={containerRef}
          className='glass-strong rounded-full px-2 py-2 glow-teal relative flex items-center'
        >
          {/* Progress outline (desktop only) */}
          {showProgress && svgSize && (
            <svg
              className='hidden md:block absolute inset-0 pointer-events-none'
              viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
              preserveAspectRatio='none'
              aria-hidden
            >
              <defs>
                <linearGradient id='gradRing' x1='0' x2='1'>
                  <stop offset='0%' stopColor='#14b8a6' />
                  <stop offset='100%' stopColor='#06b6d4' />
                </linearGradient>
              </defs>
              <path
                ref={pathRef}
                d=''
                stroke='url(#gradRing)'
                strokeWidth={3}
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                style={{ willChange: "stroke-dashoffset, opacity" }}
              />
            </svg>
          )}

          <div className='flex items-center gap-1'>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='md:hidden p-3 rounded-full bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors'
            >
              {isExpanded ? (
                <X className='w-5 h-5' />
              ) : (
                <Menu className='w-5 h-5' />
              )}
            </button>

            {/* Desktop navigation */}
            <div className='hidden md:flex items-center gap-1'>
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className='relative p-3 rounded-full text-slate-400 hover:text-teal-400 transition-colors'
                >
                  <item.icon className='w-5 h-5 relative z-10' />

                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <>
                        <motion.div
                          layoutId='nav-hover'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='absolute inset-0 bg-teal-500/10 rounded-full'
                        />
                        <motion.span
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: -40, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.8 }}
                          className='absolute left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium bg-slate-800 text-teal-400 rounded-full whitespace-nowrap border border-slate-700/50'
                        >
                          {item.label}
                        </motion.span>
                      </>
                    )}
                  </AnimatePresence>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile expanded menu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className='md:hidden overflow-hidden'
            >
              <div className='flex flex-col gap-1 pt-2 pb-1'>
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setIsExpanded(false)}
                    className='flex items-center gap-3 px-4 py-2 rounded-full text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors'
                  >
                    <item.icon className='w-4 h-4' />
                    <span className='text-sm'>{item.label}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
