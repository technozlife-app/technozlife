"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { API_BASE } from "@/lib/api";

export default function AuthCompletePage() {
  const { refreshUser, googleLogin, githubLogin } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate processing
    if (processedRef.current) return;
    processedRef.current = true;

    // Read both query string and hash fragment to support different redirects
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(
      window.location.hash.replace(/^#/, "")
    );

    const token =
      params.get("token") ||
      params.get("access_token") ||
      hashParams.get("token") ||
      hashParams.get("access_token");
    const code = params.get("code") || hashParams.get("code");
    const provider =
      params.get("provider") ||
      params.get("p") ||
      hashParams.get("provider") ||
      hashParams.get("p");
    const refresh =
      params.get("refresh_token") || hashParams.get("refresh_token");

    async function handleToken(tokenValue: string) {
      localStorage.setItem("accessToken", tokenValue);
      if (refresh) localStorage.setItem("refreshToken", refresh);

      // Clean URL (remove query params and hash tokens)
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("access_token");
      url.searchParams.delete("refresh_token");
      // strip token-like hash params
      const newHash = window.location.hash.replace(
        /([#&]?token=[^&]*)|([#&]?access_token=[^&]*)|([#&]?refresh_token=[^&]*)/g,
        ""
      );
      window.history.replaceState(
        {},
        document.title,
        url.pathname + (newHash || "")
      );

      // Give a tiny delay to ensure localStorage is flushed
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Use the central refreshUser() and rely on AuthProvider for state population
      try {
        const res = await refreshUser();

        if (res.success) {
          toast({
            title: "Signed in",
            description: "Authentication completed.",
          });
          // Wait a bit more to ensure AuthProvider state is updated
          await new Promise((resolve) => setTimeout(resolve, 200));
          router.push("/dashboard");
          return;
        }

        // If verification failed, check if token is still in localStorage (might have been cleared by 401)
        const stillHasToken = localStorage.getItem("accessToken");
        console.warn(
          "[AuthComplete] refreshUser failed, token still exists:",
          !!stillHasToken
        );

        if (!stillHasToken) {
          // Token was cleared due to 401, clear everything and redirect
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenExpiry");
          toast({
            title: "Sign in failed",
            description:
              "The authentication token was invalid. Please try again.",
          });
          router.replace("/auth");
        } else {
          // Token exists but refresh failed - might be a temporary issue
          // Let the user proceed to dashboard and let the auth guards handle it
          console.warn(
            "[AuthComplete] Token exists but refresh failed, proceeding to dashboard anyway"
          );
          toast({
            title: "Signed in",
            description: "Please refresh if you see any issues.",
          });
          await new Promise((resolve) => setTimeout(resolve, 200));
          router.push("/dashboard");
        }
      } catch (e) {
        console.error("[AuthComplete] refreshUser threw:", e);
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
      router.push("/auth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className='p-8'>Completing authentication...</div>;
}
