"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export function GetStartedButton() {
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 1.2,
          duration: 0.5,
          type: "spring",
          stiffness: 200,
        }}
        className='fixed top-6 right-6 z-50 group'
      >
        <div className='relative flex items-center gap-2 px-5 py-3 rounded-full bg-slate-800/30 text-slate-500 text-sm'>
          Loading...
        </div>
      </motion.div>
    );
  }

  // Authenticated - show a simple Dashboard button (no profile dropdown in header)
  if (user) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 1.2,
          duration: 0.5,
          type: "spring",
          stiffness: 200,
        }}
        className='fixed top-6 right-6 z-50 group'
      >
        <Link href='/dashboard'>
          <div className='relative flex items-center gap-2 px-5 py-3 rounded-full bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 font-semibold text-sm'>
            <span className='hidden sm:inline'>Dashboard</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className='w-4 h-4' />
            </motion.div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Unauthenticated - keep Get Started CTA
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5, type: "spring", stiffness: 200 }}
      className='fixed top-6 right-6 z-50 group'
    >
      <Link href='/auth'>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='relative'
        >
          {/* Glow effect */}
          <div className='absolute inset-0 bg-teal-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity' />

          {/* Button */}
          <div className='relative flex items-center gap-2 px-5 py-3 bg-linear-to-r from-teal-500 to-emerald-500 rounded-full text-slate-950 font-semibold text-sm'>
            <span className='hidden sm:inline'>Get Started</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className='w-4 h-4' />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
