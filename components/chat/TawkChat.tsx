"use client";

import React, { useEffect } from "react";

export default function TawkChat() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Avoid loading the script multiple times
    if ((window as any).Tawk_API) return;

    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    s1.type = "text/javascript";
    s1.async = true;
    s1.src = "https://embed.tawk.to/694b63d99914c8197bb91c6c/1jd77s32o";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    s0?.parentNode?.insertBefore(s1, s0);

    return () => {
      // Clean up: remove inserted script and some global globals where possible
      try {
        if (s1.parentNode) s1.parentNode.removeChild(s1);
        try {
          delete (window as any).Tawk_API;
          delete (window as any).Tawk_LoadStart;
        } catch (e) {
          // ignore
        }
      } catch (err) {
        // ignore
      }
    };
  }, []);

  return null;
}
