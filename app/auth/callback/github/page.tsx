"use client";

import { useEffect } from "react";

export default function GithubCallbackPage() {
  useEffect(() => {
    try {
      const search = window.location.search || "";
      const hash = window.location.hash || "";
      window.location.replace(`/auth/complete${search}${hash}`);
    } catch (e) {
      // noop
    }
  }, []);

  return <div>Redirecting to complete authentication...</div>;
}
