"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function AuthCompletePage() {
  const { refreshUser, googleLogin, githubLogin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || params.get("access_token");
    const code = params.get("code");
    const provider = params.get("provider") || params.get("p");

    async function handleToken(tokenValue: string) {
      localStorage.setItem("accessToken", tokenValue);
      const refresh = params.get("refresh_token");
      if (refresh) localStorage.setItem("refreshToken", refresh);

      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("access_token");
      url.searchParams.delete("refresh_token");
      window.history.replaceState({}, document.title, url.pathname);

      try {
        await refreshUser();
        toast({ title: "Signed in", description: "Authentication completed." });
        router.replace("/dashboard");
      } catch (e) {
        toast({
          title: "Sign in incomplete",
          description: "Please sign in manually.",
        });
        router.replace("/auth");
      }
    }

    async function handleCode(codeValue: string, providerValue?: string) {
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("provider");
      url.searchParams.delete("p");
      window.history.replaceState({}, document.title, url.pathname);

      try {
        let res;
        if (providerValue === "google") {
          res = await googleLogin(codeValue);
        } else if (providerValue === "github") {
          res = await githubLogin(codeValue);
        } else {
          // Try google then github as fallback
          res = await googleLogin(codeValue);
          if (!res || !res.success) {
            res = await githubLogin(codeValue);
          }
        }

        if (res && res.success) {
          toast({ title: "Signed in", description: "Welcome!" });
          router.replace("/dashboard");
        } else {
          toast({
            title: "Sign in failed",
            description: res?.message || "Unable to complete sign in.",
          });
          router.replace("/auth");
        }
      } catch (e) {
        toast({
          title: "Sign in failed",
          description: "Unable to complete sign in.",
        });
        router.replace("/auth");
      }
    }

    if (token) {
      handleToken(token);
    } else if (code) {
      handleCode(code, provider || undefined);
    } else {
      toast({ title: "No token found", description: "Authentication failed." });
      router.replace("/auth");
    }
  }, [refreshUser, router, toast]);

  return <div className='p-8'>Completing authentication...</div>;
}
