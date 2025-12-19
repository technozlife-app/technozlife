"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Fingerprint } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/custom-toast"

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { googleLogin } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    const code = searchParams.get("code")

    if (code) {
      googleLogin(code).then((result) => {
        if (result.success) {
          addToast("success", "Google Sign In", "Successfully authenticated with Google")
          router.push("/dashboard")
        } else {
          addToast("error", "Authentication Failed", result.message || "Unable to complete Google sign in")
          router.push("/auth")
        }
      })
    } else {
      addToast("error", "Authentication Error", "No authorization code received")
      router.push("/auth")
    }
  }, [searchParams, googleLogin, router, addToast])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center"
          >
            <Fingerprint className="w-8 h-8 text-slate-950" />
          </motion.div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 blur-xl opacity-50 animate-pulse" />
        </div>
        <p className="text-slate-400">Completing Google sign in...</p>
      </motion.div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  )
}
