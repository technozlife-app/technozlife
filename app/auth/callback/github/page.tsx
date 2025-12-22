"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GithubCallbackPage(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const search = window.location.search || "";
    const hash = window.location.hash || "";

    const params = new URLSearchParams(search);
    if (!params.get("provider") && !params.get("p")) {
      params.set("provider", "github");
    }

    const newUrl = `/auth/complete?${params.toString()}${hash}`;
    window.location.replace(newUrl);
  }, [router]);

  return <div className='p-8'>Redirecting…</div>;
}
