"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { getPlanBySlug, getAllPlans, type Plan } from "@/lib/plans";

export default function ClientCheckoutWrapper() {
  const searchParams = useSearchParams();
  const planSlug = searchParams?.get("plan") ?? "";

  const plan: Plan | undefined = useMemo(() => {
    return planSlug ? getPlanBySlug(planSlug) : undefined;
  }, [planSlug]);



  if (!plan) {
    return (
      <main className='max-w-3xl mx-auto px-6 py-20'>
        <h1 className='text-2xl font-bold text-slate-100'>Plan not found</h1>
        <p className='mt-4 text-slate-400'>
          We couldn't find the plan "{planSlug}". Please go back to the pricing
          page.
        </p>
      </main>
    );
  }

  return <CheckoutClient plan={plan} />;
}
