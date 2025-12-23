"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Download,
  Check,
  Zap,
  Crown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { subscriptionApi } from "@/lib/api";
import { useToast } from "@/components/ui/custom-toast";
import { PlanCard } from "@/components/dashboard/plan-card";

const plansInitial = [] as Array<any>;
const mockPayments = [
  {
    id: "pay-1",
    description: "Pro Plan - Monthly",
    amount: "$29.99",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    status: "completed",
  },
  {
    id: "pay-2",
    description: "Pro Plan - Monthly",
    amount: "$29.99",
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    status: "completed",
  },
  {
    id: "pay-3",
    description: "Pro Plan - Monthly",
    amount: "$29.99",
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    status: "completed",
  },
];

export default function BillingPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [payments, setPayments] = useState<any[]>(mockPayments);
  const [plans, setPlans] = useState<any[]>(plansInitial);
  const [currentPlan, setCurrentPlan] = useState<string | null>(
    (user as any)?.plan || (user as any)?.current_plan || null
  );

  useEffect(() => {
    // keep currentPlan in sync with user changes
    const up = (user as any)?.plan || (user as any)?.current_plan || null;
    if (up) setCurrentPlan(up);
  }, [user]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Always use local plans for display and checkout (consistent slugs)
        const { getAllPlans } = await import("@/lib/plans");
        const localPlans = getAllPlans();
        if (mounted) {
          setPlans(localPlans);
        }

        // Try to get payment history from API
        const paymentsRes = await subscriptionApi.getPaymentHistory();
        if (mounted && paymentsRes.status === "success" && paymentsRes.data) {
          setPayments(paymentsRes.data.payments || []);
        }
      } catch (e) {
        addToast(
          "error",
          "Failed to load billing data",
          "Please try again later"
        );
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [addToast]);
  const handleCancelSubscription = async () => {
    const result = await subscriptionApi.cancelSubscription();
    if (result.status === "success") {
      addToast(
        "info",
        "Subscription Cancelled",
        "Your subscription will end at the billing period"
      );
    } else {
      addToast("error", "Failed", "Could not cancel subscription");
    }
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-2'>
          Billing
        </h1>
        <p className='text-slate-400'>
          Manage your subscription and payment history
        </p>
      </motion.div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='glass rounded-2xl p-5 md:p-6 mb-6'
      >
        <h2 className='text-lg font-semibold text-white mb-4'>Current Plan</h2>

        <div className='flex flex-col md:flex-row gap-3'>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              id={plan.slug || plan.id}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              active={plan.slug === currentPlan || plan.id === currentPlan}
              onSelect={async (planId) => {
                // determine if plan is free
                const isFree =
                  typeof plan.price === "string"
                    ? /free/i.test(plan.price)
                    : Number(plan.price) === 0;
                try {
                  if (!isFree) {
                    // Redirect paid plans to checkout flow
                    // Use slug first, fallback to id
                    const slug = plan.name.toLowerCase() || plan.id;
                    addToast(
                      "info",
                      "Taking you to checkout",
                      "Proceeding to secure checkout..."
                    );
                    console.log(
                      "[Billing] Redirecting to checkout with slug:",
                      slug,
                      "from plan:",
                      plan
                    );
                    // navigate to the unified checkout page with query param
                    window.location.href = `/checkout?plan=${encodeURIComponent(
                      slug
                    )}`;
                    return;
                  }

                  // Free plan - create subscription directly
                  // Ensure user is signed in
                  const token =
                    typeof window !== "undefined"
                      ? localStorage.getItem("accessToken")
                      : null;
                  if (!token) {
                    addToast(
                      "info",
                      "Sign in required",
                      "Please sign in to continue."
                    );
                    window.location.href = `/auth?next=${encodeURIComponent(
                      window.location.pathname
                    )}`;
                    return;
                  }
                  const res = await subscriptionApi.createSubscription({
                    plan_slug: planId,
                  });

                  // Explicitly handle unauthorized responses
                  if (res.status === "error" && res.code === 401) {
                    addToast(
                      "info",
                      "Session expired",
                      "Please sign in again."
                    );
                    localStorage.removeItem("accessToken");
                    window.location.href = `/auth?next=${encodeURIComponent(
                      window.location.pathname
                    )}`;
                    return;
                  }

                  if (res.status === "success" && res.data) {
                    if (res.data.url) {
                      window.location.href = res.data.url;
                      return;
                    }
                    addToast("success", "Subscribed", "Subscription created");
                    setCurrentPlan(planId);
                  } else {
                    // show friendly validation messages if provided
                    let message =
                      res.message || "Unable to create subscription";
                    if ((res as any).errors) {
                      const errs = (res as any).errors;
                      const messages: string[] = [];
                      for (const k of Object.keys(errs)) {
                        if (Array.isArray(errs[k]))
                          messages.push(`${k}: ${errs[k].join(", ")}`);
                        else messages.push(`${k}: ${String(errs[k])}`);
                      }
                      if (messages.length) message = messages.join("; ");
                    }
                    addToast("error", "Subscription Failed", message);
                  }
                } catch (e) {
                  addToast(
                    "error",
                    "Subscription Failed",
                    "Unable to create subscription"
                  );
                }
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='glass rounded-2xl p-5 md:p-6 mb-6'
      >
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-white'>Payment Method</h2>
          <Button
            variant='ghost'
            size='sm'
            className='text-teal-400 hover:text-teal-300'
          >
            Update
          </Button>
        </div>

        <div className='flex items-center gap-4 p-4 rounded-xl bg-slate-800/30'>
          <div className='p-2 rounded-lg bg-slate-700/50'>
            <CreditCard className='w-5 h-5 text-slate-400' />
          </div>
          <div>
            <p className='text-sm text-white'>Visa ending in 4242</p>
            <p className='text-xs text-slate-500'>Expires 12/25</p>
          </div>
          <Check className='w-5 h-5 text-teal-400 ml-auto' />
        </div>
      </motion.div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className='glass rounded-2xl p-5 md:p-6'
      >
        <h2 className='text-lg font-semibold text-white mb-4'>
          Payment History
        </h2>

        <div className='space-y-3'>
          {payments.map((payment) => (
            <div
              key={payment.id}
              className='flex items-center justify-between p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors'
            >
              <div className='flex items-center gap-4'>
                <div className='hidden sm:block p-2 rounded-lg bg-emerald-500/10'>
                  <Check className='w-4 h-4 text-emerald-400' />
                </div>
                <div>
                  <p className='text-sm text-white'>{payment.description}</p>
                  <p className='text-xs text-slate-500'>{payment.date}</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-sm font-medium text-white'>
                  {payment.amount}
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-slate-400 hover:text-white hidden sm:flex'
                >
                  <Download className='w-4 h-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
