"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { paymentsApi } from "@/lib/api";
import { useToast } from "@/components/ui/custom-toast";
import type { Plan } from "@/lib/plans";

export default function CheckoutClient({ plan }: { plan: Plan }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const startCheckout = async () => {
    setIsProcessing(true);
    try {
      // Ensure user is authenticated before initiating a subscription
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      if (!token) {
        addToast("info", "Sign in required", "Please sign in to continue.");
        // preserve current path
        const next = encodeURIComponent(window.location.pathname);
        router.push(`/auth?next=${next}`);
        return;
      }

      const response = await paymentsApi.createSubscription({
        plan_slug: plan.slug,
      });

      // Handle unauthorized explicitly
      if (response.status === "error" && response.code === 401) {
        addToast("info", "Session expired", "Please sign in again.");
        localStorage.removeItem("accessToken");
        router.push(
          `/auth?next=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }

      if (response.status === "success" && response.data) {
        const payload = response.data;

        // If backend returns a hosted checkout url, redirect
        if (payload?.url) {
          addToast("info", "Redirecting", "Opening secure payment provider...");
          window.location.href = payload.url;
          return;
        }

        // Otherwise, if subscription was created immediately
        if (payload?.subscription?.id) {
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
      } else {
        // Show validation errors if present
        let message = response.message || "Unable to start checkout";
        // @ts-ignore
        if ((response as any).errors) {
          // @ts-ignore
          const errs = (response as any).errors;
          const parts: string[] = [];
          for (const k of Object.keys(errs)) {
            if (Array.isArray(errs[k]))
              parts.push(`${k}: ${errs[k].join(", ")}`);
            else parts.push(`${k}: ${String(errs[k])}`);
          }
          if (parts.length) message = parts.join("; ");
        }

        addToast("error", "Checkout Failed", message);
      }
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
