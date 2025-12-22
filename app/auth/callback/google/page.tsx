"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Forward the full query string and hash to /auth/complete and add provider flag
    const search = window.location.search || "";
    const hash = window.location.hash || "";

    // If provider param already present, keep as-is; otherwise append provider=google
    const params = new URLSearchParams(search);
    if (!params.get("provider") && !params.get("p")) {
      params.set("provider", "google");
    }

    const newUrl = `/auth/complete?${params.toString()}${hash}`;
    // Use replace to avoid extra history entries
    window.location.replace(newUrl);
  }, [router]);

  return <div className='p-8'>Redirecting…</div>;
}
