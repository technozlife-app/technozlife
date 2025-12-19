"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cookie_consent";

export default function CookieConsent() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const existing = localStorage.getItem(STORAGE_KEY);
    setConsent(existing);
  }, []);

  if (consent) return null;

  return (
    <div className='fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 border border-slate-800 rounded-xl px-5 py-3 flex items-center gap-4'>
      <div className='text-sm text-slate-300'>
        We use cookies to improve your experience. Accept cookies for full
        functionality?
      </div>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "accepted");
            setConsent("accepted");
          }}
          className='bg-teal-500 text-white px-3 py-2 rounded'
        >
          Accept
        </button>
        <button
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "rejected");
            setConsent("rejected");
          }}
          className='bg-slate-700 text-slate-200 px-3 py-2 rounded'
        >
          Decline
        </button>
      </div>
    </div>
  );
}
