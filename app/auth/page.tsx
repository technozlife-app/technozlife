"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Fingerprint,
  Sparkles,
  ChevronRight,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/custom-toast";
import { API_BASE } from "@/lib/api";

// Google Icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      />
      <path
        fill='currentColor'
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      />
      <path
        fill='currentColor'
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      />
      <path
        fill='currentColor'
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      />
    </svg>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
    agreeTerms: false,
  });

  const router = useRouter();
  const { login, register } = useAuth();
  const { addToast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        if (!formData.agreeTerms) {
          addToast(
            "error",
            "Terms Required",
            "Please agree to the Terms of Service and Privacy Policy"
          );
          setIsLoading(false);
          return;
        }

        // Execute reCAPTCHA for registration
        let recaptchaToken: string | undefined = undefined;
        try {
          const { executeRecaptcha } = await import("@/lib/recaptcha");
          recaptchaToken = await executeRecaptcha("register");
        } catch (e) {
          addToast(
            "error",
            "reCAPTCHA Error",
            "Unable to verify captcha. Please try again or contact support."
          );
          setIsLoading(false);
          return;
        }

        const result = await register(
          formData.email,
          formData.password,
          formData.name,
          recaptchaToken
        );
        if (result.success) {
          addToast(
            "success",
            "Account Created",
            "Welcome to Technozlife! Redirecting to dashboard..."
          );
          setTimeout(() => router.push("/dashboard"), 1500);
        } else {
          addToast(
            "error",
            "Registration Failed",
            result.message || "Please check your details and try again"
          );
        }
      } else {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          addToast(
            "success",
            "Welcome Back",
            "Successfully signed in. Redirecting..."
          );
          setTimeout(() => router.push("/dashboard"), 1500);
        } else {
          addToast(
            "error",
            "Sign In Failed",
            result.message || "Invalid email or password"
          );
        }
      }
    } catch {
      addToast(
        "error",
        "Connection Error",
        "Unable to connect to server. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth redirect handlers (browser flow)
  const handleGoogleAuth = () => {
    setIsLoading(true);
    // Redirect the browser to backend OAuth endpoint which will return a token in the callback
    window.location.href = API_BASE + "/auth/google/redirect";
  };

  const handleGithubAuth = () => {
    setIsLoading(true);
    window.location.href = API_BASE + "/auth/github/redirect";
  };

  return (
    <div className='min-h-screen bg-slate-950 relative overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-gradient-radial from-teal-500/10 via-transparent to-transparent' />
        <div className='absolute bottom-0 right-0 w-150 h-150 bg-gradient-radial from-violet-500/10 via-transparent to-transparent' />
        <div
          className='absolute inset-0 opacity-[0.02]'
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className='absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl'
        />
        <motion.div
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl'
        />
      </div>

      {/* Back Button */}
      <Link href='/'>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className='fixed top-6 left-6 z-50'
        >
          <Button
            variant='ghost'
            className='gap-2 text-slate-400 hover:text-white hover:bg-white/5'
          >
            <ArrowLeft className='w-4 h-4' />
            Back
          </Button>
        </motion.div>
      </Link>

      {/* Main Content */}
      <div className='relative z-10 min-h-screen flex'>
        {/* Left Panel - Branding */}
        <div className='hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href='/' className='inline-block mb-12'>
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <div className='w-12 h-12 rounded-xl bg-linear-to-br from-teal-400 to-emerald-500 flex items-center justify-center'>
                    <Fingerprint className='w-6 h-6 text-slate-950' />
                  </div>
                  <div className='absolute inset-0 rounded-xl bg-linear-to-br from-teal-400 to-emerald-500 blur-lg opacity-50' />
                </div>
                <span className='text-2xl font-bold text-white'>
                  Technozlife
                </span>
              </div>
            </Link>

            <h1 className='text-5xl xl:text-6xl font-serif font-light text-white leading-tight mb-6'>
              Step into the
              <span className='block text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-400'>
                future of you
              </span>
            </h1>

            <p className='text-xl text-slate-400 leading-relaxed mb-12 max-w-lg'>
              Join thousands who have already enhanced their potential through
              our bio-digital fusion platform.
            </p>

            <div className='space-y-4'>
              {[
                "Neural synchronization in real-time",
                "Personalized enhancement protocols",
                "24/7 AI companion support",
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className='flex items-center gap-3 text-slate-300'
                >
                  <div className='w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center'>
                    <Sparkles className='w-3 h-3 text-teal-400' />
                  </div>
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className='w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='w-full max-w-md'
          >
            {/* Mobile Logo */}
            <Link href='/' className='lg:hidden inline-block mb-8'>
              <div className='flex items-center gap-3'>
                <div className='relative'>
                  <div className='w-10 h-10 rounded-xl bg-linear-to-br from-teal-400 to-emerald-500 flex items-center justify-center'>
                    <Fingerprint className='w-5 h-5 text-slate-950' />
                  </div>
                </div>
                <span className='text-xl font-bold text-white'>
                  Technozlife
                </span>
              </div>
            </Link>

            {/* Card */}
            <div className='relative'>
              <div className='absolute -inset-1 bg-linear-to-r from-teal-500/20 to-violet-500/20 rounded-3xl blur-xl opacity-50' />

              <div className='relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8'>
                {/* Toggle */}
                <div className='flex gap-1 p-1 bg-slate-800/50 rounded-xl mb-8'>
                  {(["login", "signup"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMode(tab)}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                        mode === tab
                          ? "bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {tab === "login" ? "Sign In" : "Create Account"}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <AnimatePresence mode='wait'>
                  <motion.form
                    key={mode}
                    initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className='space-y-5'
                  >
                    {mode === "signup" && (
                      <div className='space-y-2'>
                        <Label htmlFor='name' className='text-slate-300'>
                          Full Name
                        </Label>
                        <div className='relative'>
                          <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500' />
                          <Input
                            id='name'
                            type='text'
                            placeholder='Enter your name'
                            value={formData.name}
                            onChange={handleInputChange}
                            className='pl-11 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20 h-12 rounded-xl'
                          />
                        </div>
                      </div>
                    )}

                    <div className='space-y-2'>
                      <Label htmlFor='email' className='text-slate-300'>
                        Email
                      </Label>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500' />
                        <Input
                          id='email'
                          type='email'
                          placeholder='name@example.com'
                          value={formData.email}
                          onChange={handleInputChange}
                          className='pl-11 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20 h-12 rounded-xl'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='password' className='text-slate-300'>
                          Password
                        </Label>
                        {mode === "login" && (
                          <Link
                            href='/auth/forgot'
                            className='text-sm text-teal-400 hover:text-teal-300 transition-colors'
                          >
                            Forgot password?
                          </Link>
                        )}
                      </div>
                      <div className='relative'>
                        <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500' />
                        <Input
                          id='password'
                          type={showPassword ? "text" : "password"}
                          placeholder='Enter your password'
                          value={formData.password}
                          onChange={handleInputChange}
                          className='pl-11 pr-11 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20 h-12 rounded-xl'
                        />
                        <button
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors'
                        >
                          {showPassword ? (
                            <EyeOff className='w-5 h-5' />
                          ) : (
                            <Eye className='w-5 h-5' />
                          )}
                        </button>
                      </div>
                    </div>

                    {mode === "signup" && (
                      <div className='flex items-start gap-3'>
                        <Checkbox
                          id='terms'
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              agreeTerms: checked as boolean,
                            }))
                          }
                          className='mt-1 border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500'
                        />
                        <label
                          htmlFor='terms'
                          className='text-sm text-slate-400 leading-relaxed'
                        >
                          I agree to the{" "}
                          <Link
                            href='/terms'
                            className='text-teal-400 hover:underline'
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href='/privacy'
                            className='text-teal-400 hover:underline'
                          >
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    )}

                    {mode === "login" && (
                      <div className='flex items-center gap-3'>
                        <Checkbox
                          id='remember'
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              rememberMe: checked as boolean,
                            }))
                          }
                          className='border-white/20 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500'
                        />
                        <label
                          htmlFor='remember'
                          className='text-sm text-slate-400'
                        >
                          Remember me for 30 days
                        </label>
                      </div>
                    )}

                    <Button
                      type='submit'
                      disabled={isLoading}
                      className='w-full h-12 bg-linear-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-semibold rounded-xl transition-all relative overflow-hidden group'
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className='w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full'
                        />
                      ) : (
                        <>
                          <span>
                            {mode === "login" ? "Sign In" : "Create Account"}
                          </span>
                          <ChevronRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform' />
                        </>
                      )}
                    </Button>
                  </motion.form>
                </AnimatePresence>

                {/* Divider */}
                <div className='relative my-8'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-white/10' />
                  </div>
                  <div className='relative flex justify-center'>
                    <span className='px-4 bg-slate-900 text-sm text-slate-500'>
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login - Connected to OAuth handlers */}
                <div className='grid grid-cols-2 gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleGithubAuth}
                    disabled={isLoading}
                    className='h-12 bg-slate-800/50 border-white/10 hover:bg-slate-800 hover:border-white/20 text-white rounded-xl'
                  >
                    <Github className='w-5 h-5 mr-2' />
                    GitHub
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className='h-12 bg-slate-800/50 border-white/10 hover:bg-slate-800 hover:border-white/20 text-white rounded-xl'
                  >
                    <GoogleIcon className='w-5 h-5 mr-2' />
                    Google
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom text */}
            <p className='text-center text-sm text-slate-500 mt-6'>
              {mode === "login" ? (
                <>
                  New to Technozlife?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className='text-teal-400 hover:underline'
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className='text-teal-400 hover:underline'
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
