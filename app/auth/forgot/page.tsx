"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api";
import { useToast } from "@/components/ui/custom-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      if (res.success) {
        addToast(
          "success",
          "Email Sent",
          "If an account exists, a password reset link was sent to your email."
        );
        router.push("/auth");
      } else {
        addToast("error", "Error", res.message || "Unable to send email.");
      }
    } catch (err) {
      addToast("error", "Connection Error", "Unable to connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-950 text-white'>
      <div className='max-w-md w-full p-8 bg-slate-900/80 rounded-2xl border border-white/10'>
        <h2 className='text-2xl font-semibold mb-2'>Reset your password</h2>
        <p className='text-sm text-slate-400 mb-6'>
          Enter the email associated with your account and we'll send a reset
          link.
        </p>

        <form onSubmit={submit} className='space-y-4'>
          <div>
            <Label htmlFor='email' className='text-slate-300'>
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='name@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-2 bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20 h-12 rounded-xl'
            />
          </div>

          <div className='flex gap-2'>
            <Button type='submit' disabled={isLoading} className='flex-1'>
              {isLoading ? "Sending…" : "Send Reset Link"}
            </Button>
            <Button
              type='button'
              variant='ghost'
              onClick={() => router.push("/auth")}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
