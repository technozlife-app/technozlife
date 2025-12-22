"use client";

import { useEffect } from "react";

export default function GoogleCallbackPage() {
  useEffect(() => {
    try {
      const search = window.location.search || "";
      const hash = window.location.hash || "";
      // Forward provider callback params to our central /auth/complete handler
      window.location.replace(`/auth/complete${search}${hash}`);
    } catch (e) {
      // noop
    }
  }, []);

  return <div>Redirecting to complete authentication...</div>;
}
