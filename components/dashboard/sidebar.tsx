"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Sparkles,
  History,
  Settings,
  CreditCard,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Fingerprint,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/custom-toast"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Sparkles, label: "AI Generate", href: "/dashboard/generate" },
  { icon: History, label: "History", href: "/dashboard/history" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { addToast } = useToast()

  const handleLogout = async () => {
    await logout()
    addToast("success", "Signed Out", "You have been logged out successfully")
    router.push("/")
  }

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-slate-950" />
            </div>
          </div>
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold text-white whitespace-nowrap overflow-hidden"
              >
                Technozlife
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-slate-800/50">
        <div
          className={`flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 mb-3 ${isCollapsed && !isMobile ? "justify-center" : ""}`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-slate-950" />
          </div>
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="text-sm font-medium text-white truncate">{user?.name || "Guest"}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || "Not signed in"}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 ${isCollapsed && !isMobile ? "px-3" : ""}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Collapse button - desktop only */}
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 text-slate-400"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 z-50"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent isMobile />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 256 }}
        className="hidden lg:block fixed left-0 top-0 bottom-0 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 z-30"
      >
        <SidebarContent />
      </motion.aside>
    </>
  )
}
