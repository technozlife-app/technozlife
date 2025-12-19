"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function GetStartedButton() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5, type: "spring", stiffness: 200 }}
      className="fixed top-6 right-6 z-50 group"
    >
      <Link href="/auth">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-teal-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />

          {/* Button */}
          <div className="relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full text-slate-950 font-semibold text-sm">
            <span className="hidden sm:inline">Get Started</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
