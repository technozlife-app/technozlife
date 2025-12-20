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

  // Authenticated menu
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
        <div className='relative'>
          <button
            onClick={() => setOpen((s) => !s)}
            className='relative flex items-center gap-3 px-4 py-2 bg-slate-900/80 rounded-full border border-white/10 text-slate-200'
          >
            <img
              src={user.avatar || "/avatar-placeholder.svg"}
              alt={user.name || user.email || "User"}
              className='w-6 h-6 rounded-full'
            />
            <span className='hidden sm:inline font-medium'>
              {(user.name || user.email || "User").split(" ")[0]}
            </span>
            <ChevronDown className='w-4 h-4 text-slate-400' />
          </button>

          {open && (
            <div className='absolute right-0 mt-3 w-48 bg-slate-900/90 border border-white/5 rounded-xl shadow-lg p-2'>
              <Link
                href='/dashboard'
                className='block px-3 py-2 rounded hover:bg-slate-800'
              >
                Dashboard
              </Link>
              <Link
                href='/dashboard/billing'
                className='block px-3 py-2 rounded hover:bg-slate-800'
              >
                Billing
              </Link>
              <Link
                href='/dashboard/settings'
                className='block px-3 py-2 rounded hover:bg-slate-800'
              >
                Settings
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  setOpen(false);
                }}
                className='w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-rose-400'
              >
                Sign out
              </button>
            </div>
          )}
        </div>
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
