"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  index: number
}

export function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, index }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:from-teal-500/10 transition-colors" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">{title}</span>
          <div className="p-2 rounded-lg bg-teal-500/10">
            <Icon className="w-4 h-4 text-teal-400" />
          </div>
        </div>

        <p className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</p>

        {change && (
          <p
            className={`text-xs ${
              changeType === "positive"
                ? "text-emerald-400"
                : changeType === "negative"
                  ? "text-red-400"
                  : "text-slate-500"
            }`}
          >
            {change}
          </p>
        )}
      </div>
    </motion.div>
  )
}
