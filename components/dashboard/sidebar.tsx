"use client";

import { useState, useEffect } from "react";
import { API_BASE } from "@/lib/api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/custom-toast";
import { userApi } from "@/lib/api";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Sparkles, label: "AI Generate", href: "/dashboard/generate" },
  { icon: History, label: "History", href: "/dashboard/history" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading, refreshUser } = useAuth();
  const [remoteUser, setRemoteUser] = useState<any | null>(null);
  const { addToast } = useToast();

  // Helper to select a display user (AuthProvider user preferred)
  const displayUser = user || remoteUser || null;

  const handleLogout = async () => {
    await logout();
    addToast("success", "Signed Out", "You have been logged out successfully");
    router.push("/");
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className='flex flex-col h-full'>
      {/* Logo */}
      <div className='p-4 border-b border-slate-800/50'>
        <Link href='/' className='flex items-center gap-3'>
          <div className='relative shrink-0'>
            <div className='w-10 h-10 rounded-xl bg-linear-to-br from-teal-400 to-emerald-500 flex items-center justify-center'>
              <Fingerprint className='w-5 h-5 text-slate-950' />
            </div>
          </div>
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className='text-lg font-bold text-white whitespace-nowrap overflow-hidden'
              >
                Technozlife
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className='flex-1 p-3 space-y-1'>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-linear-to-r from-teal-500/20 to-emerald-500/20 text-teal-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <item.icon className='w-5 h-5 shrink-0' />
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className='whitespace-nowrap overflow-hidden'
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className='p-3 border-t border-slate-800/50'>
        <div
          className={`flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 mb-3 ${
            isCollapsed && !isMobile ? "justify-center" : ""
          }`}
        >
          <div className='w-9 h-9 rounded-full bg-linear-to-br from-teal-500 to-emerald-500 flex items-center justify-center shrink-0'>
            <User className='w-4 h-4 text-slate-950' />
          </div>
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className='flex-1 min-w-0 overflow-hidden'
              >
                <p className='text-sm font-medium text-white truncate'>
                  {isLoading
                    ? "Loading..."
                    : // Prefer AuthProvider user, fallback to remoteUser
                    displayUser?.first_name ||
                      (displayUser as any)?.firstName ||
                      (displayUser as any)?.name
                    ? `${
                        (displayUser?.first_name ||
                          (displayUser as any)?.firstName ||
                          (displayUser as any)?.name) as string
                      }${
                        displayUser?.last_name || (displayUser as any)?.lastName
                          ? ` ${
                              displayUser?.last_name ||
                              (displayUser as any)?.lastName
                            }`
                          : ""
                      }`
                    : displayUser?.username || displayUser?.email || "Guest"}
                </p>
                <p className='text-xs text-slate-500 truncate'>
                  {isLoading ? "" : user?.email || "Not signed in"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant='ghost'
          onClick={handleLogout}
          className={`w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 ${
            isCollapsed && !isMobile ? "px-3" : ""
          }`}
        >
          <LogOut className='w-5 h-5 shrink-0' />
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='whitespace-nowrap'
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
          className='absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors'
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Dev auth debug (visible in non-production) */}
      {process.env.NODE_ENV !== "production" && (
        <div className='p-3 border-t border-slate-800/50 mt-2'>
          <div className='text-xs text-slate-500 mb-2'>
            Auth Debug (dev only)
          </div>
          <div className='flex gap-2'>
            <button
              className='btn-ghost text-xs'
              onClick={async () => {
                try {
                  const token = localStorage.getItem("accessToken");
                  const tokenPreview = token
                    ? `${token.slice(0, 8)}...${token.slice(-8)}`
                    : "(no token)";
                  const res = await userApi.getProfile();
                  if (res.success && res.data?.user) {
                    addToast(
                      "success",
                      "Auth OK",
                      "Fetched /user successfully"
                    );
                    setRemoteUser(res.data.user);
                  } else if (res.code === 401) {
                    addToast(
                      "error",
                      "401 Unauthorized",
                      "Token invalid or expired"
                    );
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    setRemoteUser(null);
                  } else {
                    addToast(
                      "error",
                      "Profile fetch failed",
                      res.message || "Unknown error"
                    );
                  }
                  // show console-friendly debug
                  console.debug("Auth Debug - token preview:", tokenPreview);
                  console.debug("Auth Debug - /user response:", res);
                } catch (err) {
                  console.error("Auth Debug failed:", err);
                  addToast("error", "Auth Debug failed", String(err));
                }
              }}
            >
              Run Auth Debug
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // If there is an access token but no user in context, attempt to refresh
  // the profile using the central AuthProvider. This avoids ad-hoc fetches
  // and keeps token/error handling consistent across the app.
  useEffect(() => {
    let mounted = true;
    try {
      if (
        typeof window !== "undefined" &&
        !user &&
        !isLoading &&
        localStorage.getItem("accessToken")
      ) {
        // First try AuthProvider refresh to populate global user
        (async () => {
          try {
            const res = await refreshUser();
            if (res.success) {
              // AuthProvider now has user; nothing else needed
              return;
            }

            // If refreshUser failed, attempt a direct API profile fetch
            const profile = await userApi.getProfile();
            if (profile.success && profile.data?.user && mounted) {
              setRemoteUser(profile.data.user);
              // Also trigger AuthProvider refresh in the background
              try {
                await refreshUser();
              } catch (_) {
                /* ignore */
              }
              return;
            }

            // If profile fetch failed (e.g., 401), clear tokens and notify
            if (profile.code === 401) {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("tokenExpiry");
              setRemoteUser(null);
              addToast("info", "Session expired", "Please sign in again");
            }
          } catch (err) {
            // ignore
          }
        })();
      }
    } catch (e) {
      // noop
    }

    return () => {
      mounted = false;
    };
  }, [user, isLoading, refreshUser, addToast]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 text-slate-400'
      >
        <Menu className='w-5 h-5' />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
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
            className='lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 z-50'
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className='absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white'
            >
              <X className='w-5 h-5' />
            </button>
            <SidebarContent isMobile />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 256 }}
        className='hidden lg:block fixed left-0 top-0 bottom-0 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 z-30'
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
}
