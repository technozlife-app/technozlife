import React, { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function Page() {
  return (
    <div className='max-w-2xl mx-auto px-6 py-16'>
      <Suspense
        fallback={<p className='text-slate-400'>Verifying your email...</p>}
      >
        <VerifyClient />
      </Suspense>
    </div>
  );
}
