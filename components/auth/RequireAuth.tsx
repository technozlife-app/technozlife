"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue.",
      });
      const next =
        typeof window !== "undefined" ? window.location.pathname : "/";
      router.replace(`/auth?next=${encodeURIComponent(next)}`);
    }
  }, [isLoading, isAuthenticated, router, toast]);

  if (isLoading) return <div className='p-8'>Checking authentication…</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
