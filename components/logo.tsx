"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Logo({ className, type = "default" }: { className?: string; type?: "default" | "compact" }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageExists, setImageExists] = useState<boolean | null>(null);

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/images/Logo.webp`;
    const iconUrl = `${origin}/images/Icon.webp`;
    const finalUrl = type === "compact" ? iconUrl : url;
    setImageUrl(finalUrl);

    // Check if the image loads successfully in the browser
    const img = new window.Image();
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
    img.src = url;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  if (imageExists === true && imageUrl) {
    return (
      <Link
        href='/'
        className={`flex items-center space-x-2 z-50 ${className || ""}`}
      >
        <img
          src={imageUrl}
          alt='TechnozLife Logo'
          className='w-32 h-auto shadow-lg'
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </Link>
    );
  }

  return (
    <Link
      href='/'
      className={`flex items-center space-x-2 z-50 ${className || ""}`}
    >
      <div className='w-12 h-12 bg-linear-to-r from-teal-400 via-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg'>
        <span className='text-white font-bold'>TZL</span>
      </div>
      {type !== "compact" && (
        <span className='text-xl font-semibold text-gradient'>TechnozLife</span>
      )}
    </Link>
  );
}
