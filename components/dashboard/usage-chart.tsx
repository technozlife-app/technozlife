"use client"

import { motion } from "framer-motion"

interface UsageChartProps {
  data: { label: string; value: number; max: number }[]
}

export function UsageChart({ data }: UsageChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass rounded-2xl p-5"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Usage Overview</h3>

      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.value / item.max) * 100
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{item.label}</span>
                <span className="text-sm text-slate-300">
                  {item.value.toLocaleString()} / {item.max.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    percentage > 80
                      ? "bg-gradient-to-r from-red-500 to-rose-500"
                      : percentage > 50
                        ? "bg-gradient-to-r from-amber-500 to-orange-500"
                        : "bg-gradient-to-r from-teal-500 to-emerald-500"
                  }`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
