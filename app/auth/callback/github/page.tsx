"use client";

import { useEffect } from "react";

export default function GithubCallbackPage() {
  useEffect(() => {
    try {
      const search = window.location.search || "";
      const hash = window.location.hash || "";

      // Parse token from query or hash and store immediately (bearer token flow)
      try {
        const params = new URLSearchParams(search);
        const hashParams = new URLSearchParams(hash.replace(/^#/, ""));
        const token =
          params.get("token") ||
          params.get("access_token") ||
          hashParams.get("token") ||
          hashParams.get("access_token");
        const refresh =
          params.get("refresh_token") || hashParams.get("refresh_token");
        if (token) {
          localStorage.setItem("accessToken", token);
        }
        if (refresh) {
          localStorage.setItem("refreshToken", refresh);
        }
      } catch (e) {
        // ignore storage errors
      }

      const target = `${window.location.origin}/auth/complete${search}${hash}`;
      window.location.replace(target);
    } catch (e) {
      // noop
    }
  }, []);

  return <div>Redirecting to complete authentication...</div>;
}
