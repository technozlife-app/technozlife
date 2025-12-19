"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CreditCard, Download, Check, Zap, Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { subscriptionApi } from "@/lib/api"
import { useToast } from "@/components/ui/custom-toast"

const plans = [
  { id: "free", name: "Human", icon: Sparkles, price: "$0" },
  { id: "pro", name: "Cyborg", icon: Zap, price: "$49" },
  { id: "enterprise", name: "Transcendence", icon: Crown, price: "$199" },
]

const mockPayments = [
  { id: "1", date: "Dec 15, 2024", amount: "$49.00", status: "Paid", description: "Cyborg Plan - Monthly" },
  { id: "2", date: "Nov 15, 2024", amount: "$49.00", status: "Paid", description: "Cyborg Plan - Monthly" },
  { id: "3", date: "Oct 15, 2024", amount: "$49.00", status: "Paid", description: "Cyborg Plan - Monthly" },
]

export default function BillingPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [payments, setPayments] = useState(mockPayments)
  const [currentPlan] = useState(user?.plan || "pro")

  useEffect(() => {
    // Fetch payment history
    subscriptionApi.getPaymentHistory().then((result) => {
      if (result.success && result.data) {
        // Use real data if available
      }
    })
  }, [])

  const handleCancelSubscription = async () => {
    const result = await subscriptionApi.cancelSubscription()
    if (result.success) {
      addToast("info", "Subscription Cancelled", "Your subscription will end at the billing period")
    } else {
      addToast("error", "Failed", "Could not cancel subscription")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Billing</h1>
        <p className="text-slate-400">Manage your subscription and payment history</p>
      </motion.div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 md:p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Current Plan</h2>

        <div className="flex flex-col md:flex-row gap-3">
          {plans.map((plan) => {
            const isActive = plan.id === currentPlan
            return (
              <div
                key={plan.id}
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  isActive
                    ? "bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-teal-500/50"
                    : "bg-slate-800/30 border-slate-700/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <plan.icon className={`w-5 h-5 ${isActive ? "text-teal-400" : "text-slate-500"}`} />
                  <span className={`font-medium ${isActive ? "text-white" : "text-slate-400"}`}>{plan.name}</span>
                  {isActive && (
                    <span className="ml-auto px-2 py-0.5 text-xs bg-teal-500/20 text-teal-400 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className={`text-2xl font-bold ${isActive ? "text-white" : "text-slate-500"}`}>
                  {plan.price}
                  <span className="text-sm font-normal text-slate-500">/mo</span>
                </p>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950">Upgrade Plan</Button>
          <Button
            variant="outline"
            onClick={handleCancelSubscription}
            className="border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/50 bg-transparent"
          >
            Cancel Subscription
          </Button>
        </div>
      </motion.div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5 md:p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Payment Method</h2>
          <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300">
            Update
          </Button>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30">
          <div className="p-2 rounded-lg bg-slate-700/50">
            <CreditCard className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-sm text-white">Visa ending in 4242</p>
            <p className="text-xs text-slate-500">Expires 12/25</p>
          </div>
          <Check className="w-5 h-5 text-teal-400 ml-auto" />
        </div>
      </motion.div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-5 md:p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Payment History</h2>

        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="hidden sm:block p-2 rounded-lg bg-emerald-500/10">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-white">{payment.description}</p>
                  <p className="text-xs text-slate-500">{payment.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">{payment.amount}</span>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hidden sm:flex">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
