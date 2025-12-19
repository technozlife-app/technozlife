"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithRefresh";
import { useToast } from "@/components/ui/custom-toast";
import type { Plan } from "@/lib/plans";

export default function CheckoutClient({ plan }: { plan: Plan }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const startCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await fetchWithAuth(`/subscriptions`, {
        method: "POST",
        body: JSON.stringify({ plan_slug: plan.slug }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch (e) {
        addToast(
          "error",
          "Invalid Response",
          "Payment service returned invalid data"
        );
        return;
      }

      const payload = json?.data || json;

      if (!res.ok) {
        addToast(
          "error",
          "Checkout Failed",
          payload?.message || "Unable to start checkout"
        );
        return;
      }

      // If backend returns a hosted checkout url, redirect
      if (payload?.url) {
        addToast("info", "Redirecting", "Opening secure payment provider...");
        window.location.href = payload.url;
        return;
      }

      // Otherwise, if subscription was created immediately
      if (payload?.subscriptionId) {
        addToast(
          "success",
          "Subscription Active",
          "Thank you — redirecting to dashboard..."
        );
        setTimeout(() => router.push("/dashboard"), 1200);
        return;
      }

      addToast(
        "error",
        "Unexpected Response",
        "Payment endpoint returned an unexpected response"
      );
    } catch (e) {
      addToast(
        "error",
        "Connection Error",
        "Unable to connect to the payment service"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className='max-w-3xl mx-auto px-6 py-20'>
      <div className='glass rounded-2xl p-8'>
        <h1 className='text-2xl font-bold text-slate-100 mb-2'>
          Checkout — {plan.name}
        </h1>
        <p className='text-slate-400 mb-6'>{plan.description}</p>

        <div className='mb-6'>
          <div className='text-4xl font-bold text-slate-100'>{plan.price}</div>
          {plan.period && <div className='text-slate-500'>{plan.period}</div>}
        </div>

        <div className='space-y-2 mb-6'>
          {plan.features.map((f) => (
            <div key={f} className='text-slate-300'>
              • {f}
            </div>
          ))}
        </div>

        <div className='flex gap-3'>
          <button
            className='btn-primary'
            onClick={startCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing…" : "Proceed to Secure Checkout"}
          </button>

          <button className='btn-ghost' onClick={() => router.push("/pricing")}>
            Back
          </button>
        </div>

        <p className='mt-6 text-sm text-slate-500'>
          Secure payments are processed off-site by our payment provider. We do
          not store card numbers on this site.
        </p>
      </div>
    </main>
  );
}
