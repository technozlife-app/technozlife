"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Lock, Bell, Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { authApi } from "@/lib/api"
import { useToast } from "@/components/ui/custom-toast"

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  })

  const handleUpdateProfile = async () => {
    setIsLoading(true)
    try {
      const result = await authApi.updateProfile(formData)
      if (result.success) {
        await refreshUser()
        addToast("success", "Profile Updated", "Your changes have been saved")
      } else {
        addToast("error", "Update Failed", result.message || "Could not update profile")
      }
    } catch {
      addToast("error", "Connection Error", "Unable to reach server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 md:p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-teal-500/10">
            <User className="w-5 h-5 text-teal-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Profile Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Full Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="bg-slate-800/50 border-slate-700/50 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
              />
            </div>
          </div>
          <Button
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5 md:p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Security</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-2 block">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-slate-800/50 border-slate-700/50 text-white"
              />
            </div>
          </div>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent">
            Update Password
          </Button>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-5 md:p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
            { key: "push", label: "Push Notifications", desc: "Browser push notifications" },
            { key: "marketing", label: "Marketing Emails", desc: "Product news and offers" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
