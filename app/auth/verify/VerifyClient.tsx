"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function VerifyClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    authApi
      .verifyEmail(token)
      .then((res) => {
        if (res.success) {
          setStatus("success");
          toast({
            title: "Email verified",
            description: "Your email has been verified.",
          });
          router.replace("/auth");
        } else {
          setStatus("error");
          toast({
            title: "Verification failed",
            description: res.message || "Unable to verify email.",
          });
        }
      })
      .catch(() => {
        setStatus("error");
        toast({
          title: "Verification failed",
          description: "Unable to verify email.",
        });
      });
  }, [params, router, toast]);

  return (
    <div>
      {status === "pending" && (
        <p className='text-slate-400'>Verifying your email...</p>
      )}
      {status === "success" && (
        <p className='text-teal-400'>Success! Redirecting to sign in...</p>
      )}
      {status === "error" && (
        <div>
          <p className='text-red-400'>
            Verification failed. Please try resending the verification email.
          </p>
          <button
            className='mt-4 px-4 py-2 bg-teal-500 text-white rounded'
            onClick={async () => {
              await authApi.resendVerification();
              toast({
                title: "Verification sent",
                description: "Check your email for the verification link.",
              });
            }}
          >
            Resend Verification
          </button>
        </div>
      )}
    </div>
  );
}
