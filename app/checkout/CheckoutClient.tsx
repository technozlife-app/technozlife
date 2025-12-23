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

  // Payment form state
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const startCheckout = async () => {
    setIsProcessing(true);
    setFieldErrors({});
    setGeneralError(null);

    try {
      // Ensure user is authenticated before initiating a subscription
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      if (!token) {
        addToast("info", "Sign in required", "Please sign in to continue.");
        // preserve current path
        const next = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        router.push(`/auth?next=${next}`);
        return;
      }

      // Client-side validation
      const localErrors: Record<string, string[]> = {};
      if (!cardHolder.trim())
        localErrors["card_holder"] = ["Cardholder name required"];
      if (!cardNumber.trim())
        localErrors["card_number"] = ["Card number required"];
      if (!cvv.trim()) localErrors["cvv"] = ["CVV required"];
      if (!expiryMonth.trim())
        localErrors["expiry_month"] = ["Expiry month required"];
      if (!expiryYear.trim())
        localErrors["expiry_year"] = ["Expiry year required"];

      if (Object.keys(localErrors).length) {
        setFieldErrors(localErrors);
        setIsProcessing(false);
        return;
      }

      const response = await paymentsApi.createSubscription({
        plan_slug: plan.slug,
        payment_method: {
          card_holder: cardHolder.trim(),
          card_number: cardNumber.replace(/\s+/g, ""),
          cvv: cvv.trim(),
          expiry_month: expiryMonth.trim(),
          expiry_year: expiryYear.trim(),
        },
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

          const nextFieldErrors: Record<string, string[]> = {};
          const parts: string[] = [];

          for (const k of Object.keys(errs)) {
            const val = errs[k];
            if (k.startsWith("payment_method.")) {
              const field = k.replace(/^payment_method\./, "");
              nextFieldErrors[field] = Array.isArray(val) ? val : [String(val)];
            } else if (k === "payment_method") {
              parts.push(Array.isArray(val) ? val.join(", ") : String(val));
            } else {
              parts.push(
                `${k}: ${Array.isArray(val) ? val.join(", ") : String(val)}`
              );
            }
          }

          if (Object.keys(nextFieldErrors).length)
            setFieldErrors(nextFieldErrors);
          if (parts.length) message = parts.join("; ");
        }

        setGeneralError(message);
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

        {/* Payment form */}
        <div className='mb-6 space-y-4'>
          {generalError && (
            <div className='p-3 rounded-md bg-red-900/40 text-red-200'>
              {generalError}
            </div>
          )}

          <div>
            <label className='block text-sm text-slate-300 mb-1'>
              Cardholder
            </label>
            <input
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder='Full name as on card'
              className='input w-full'
            />
            {fieldErrors.card_holder && (
              <p className='text-xs text-red-300 mt-1'>
                {fieldErrors.card_holder.join("; ")}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm text-slate-300 mb-1'>
              Card number
            </label>
            <input
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder='4242 4242 4242 4242'
              inputMode='numeric'
              className='input w-full'
            />
            {fieldErrors.card_number && (
              <p className='text-xs text-red-300 mt-1'>
                {fieldErrors.card_number.join("; ")}
              </p>
            )}
          </div>

          <div className='grid grid-cols-3 gap-3'>
            <div>
              <label className='block text-sm text-slate-300 mb-1'>
                Exp. month
              </label>
              <input
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value)}
                placeholder='MM'
                className='input w-full'
              />
              {fieldErrors.expiry_month && (
                <p className='text-xs text-red-300 mt-1'>
                  {fieldErrors.expiry_month.join("; ")}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm text-slate-300 mb-1'>
                Exp. year
              </label>
              <input
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value)}
                placeholder='YYYY'
                className='input w-full'
              />
              {fieldErrors.expiry_year && (
                <p className='text-xs text-red-300 mt-1'>
                  {fieldErrors.expiry_year.join("; ")}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm text-slate-300 mb-1'>CVV</label>
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder='123'
                inputMode='numeric'
                className='input w-full'
              />
              {fieldErrors.cvv && (
                <p className='text-xs text-red-300 mt-1'>
                  {fieldErrors.cvv.join("; ")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className='flex gap-3'>
          <button
            className='btn-primary'
            onClick={startCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing…" : `Pay ${plan.price}`}
          </button>

          <button
            className='btn-ghost'
            onClick={() => router.push("/#pricing")}
          >
            Back to pricing
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
