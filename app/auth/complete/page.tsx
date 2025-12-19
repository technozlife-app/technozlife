"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function AuthCompletePage() {
  const { refreshUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || params.get("access_token");

    if (token) {
      localStorage.setItem("accessToken", token);
      // If refresh token provided as well
      const refresh = params.get("refresh_token");
      if (refresh) localStorage.setItem("refreshToken", refresh);

      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("access_token");
      url.searchParams.delete("refresh_token");
      window.history.replaceState({}, document.title, url.pathname);

      // Refresh user and redirect
      refreshUser()
        .then(() => {
          toast({
            title: "Signed in",
            description: "Authentication completed.",
          });
          router.replace("/dashboard");
        })
        .catch(() => {
          toast({
            title: "Sign in incomplete",
            description: "Please sign in manually.",
          });
          router.replace("/auth");
        });
    } else {
      toast({ title: "No token found", description: "Authentication failed." });
      router.replace("/auth");
    }
  }, [refreshUser, router, toast]);

  return <div className='p-8'>Completing authentication...</div>;
}
