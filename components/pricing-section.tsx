"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { TIERS, getPlanById } from "@/lib/plans";
import type { Plan } from "@/lib/plans";
import { useToast } from "@/components/ui/custom-toast";

function PricingCard({
  tier,
  index,
  onSubscribe,
  isSubscribing,
}: {
  tier: Plan;
  index: number;
  onSubscribe: (planId: string) => void;
  isSubscribing: string | null;
}) {
  const isLoading = isSubscribing === tier.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
      className={`relative group ${tier.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
    >
      {/* Popular badge */}
      {tier.popular && (
        <div className='absolute -top-4 left-1/2 -translate-x-1/2 z-10'>
          <div className='px-4 py-1.5 bg-linear-to-r from-teal-500 to-emerald-500 rounded-full text-xs font-semibold text-slate-950'>
            Most Popular
          </div>
        </div>
      )}

      <div
        className={`h-full glass rounded-2xl p-8 relative overflow-hidden transition-all duration-500 ${
          tier.popular
            ? "ring-2 ring-teal-500/50 glow-teal"
            : "hover:ring-1 hover:ring-slate-700"
        }`}
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${tier.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        <div className='relative z-10'>
          {/* Header */}
          <div className='flex items-center gap-3 mb-6'>
            <div className={`p-2.5 rounded-xl ${tier.iconBg}`}>
              {tier.icon ? (
                <img
                  src={`/images/${tier.icon}.webp`}
                  className={`w-10 h-10 ${tier.iconColor}`}
                />
              ) : (
                <Sparkles
                  className={`w-5 h-5 ${tier.iconColor || "text-slate-400"}`}
                />
              )}
            </div>
            <h3 className='text-xl font-semibold text-slate-100'>
              {tier.name}
            </h3>
          </div>

          {/* Price */}
          <div className='mb-4'>
            <span className='text-4xl md:text-5xl font-bold text-slate-100'>
              {tier.price}
            </span>
            <span className='text-slate-500 ml-1'>{tier.period}</span>
          </div>

          <p className='text-slate-400 mb-8 text-sm'>{tier.description}</p>

          {/* CTA - Connected to subscription handler */}
          <Button
            onClick={() => onSubscribe(tier.id)}
            disabled={isLoading}
            className={`w-full mb-8 ${
              tier.popular
                ? "bg-linear-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400"
                : "bg-slate-800 text-slate-200 hover:bg-slate-700"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Processing...
              </>
            ) : (
              tier.cta
            )}
          </Button>

          {/* Features */}
          <div className='space-y-4'>
            {tier.features.map((feature) => (
              <div key={feature} className='flex items-start gap-3'>
                <div
                  className={`mt-0.5 p-1 rounded-full ${
                    tier.popular ? "bg-teal-500/20" : "bg-slate-700/50"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 ${
                      tier.popular ? "text-teal-400" : "text-slate-400"
                    }`}
                  />
                </div>
                <span className='text-sm text-slate-300'>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PricingSection() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    // Free tier - just redirect to dashboard or auth
    if (planId === "free") {
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/auth");
      }
      return;
    }
    // Enterprise tier - contact sales
    if (planId === "enterprise") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
        addToast(
          "info",
          "For Teams",
          "Fill out the form below to discuss enterprise options"
        );
      }
      return;
    }

    // Paid tiers - check auth first
    if (!isAuthenticated) {
      addToast(
        "warning",
        "Authentication Required",
        "Please sign in to purchase a subscription"
      );
      router.push("/auth");
      return;
    }

    // Paid tier - redirect to checkout page
    setIsSubscribing(planId);
    try {
      const plan = getPlanById(planId);
      const slug = plan?.slug || planId;
      addToast(
        "info",
        "Redirecting",
        "Taking you to the secure checkout page..."
      );
      router.push(`/checkout?plan=${encodeURIComponent(slug)}`);
    } finally {
      setIsSubscribing(null);
    }
  };

  return (
    <section id='pricing' className='relative py-32 overflow-hidden'>
      <div className='absolute inset-0 mesh-gradient opacity-20' />

      <div className='relative max-w-7xl mx-auto px-6'>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <span className='text-sm font-medium text-teal-400 tracking-wider uppercase mb-4 block'>
            Investment
          </span>
          <h2 className='text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6'>
            Choose Your <span className='text-gradient'>Evolution</span>
          </h2>
          <p className='text-lg text-slate-400 max-w-2xl mx-auto'>
            Select the tier that matches your ambition. All plans include our
            core bio-digital integration platform.
          </p>
        </motion.div>

        {/* Pricing grid */}
        <div className='grid lg:grid-cols-3 gap-6 lg:gap-8 items-start'>
          {(() => {
            const iconMap: Record<string, any> = {
              free: "free",
              pro: "pro",
              enterprise: "enterprise",
            };
            return TIERS.map((tier, index) => (
              <PricingCard
                key={tier.name}
                tier={{ ...tier, icon: iconMap[tier.id] }}
                index={index}
                onSubscribe={handleSubscribe}
                isSubscribing={isSubscribing}
              />
            ));
          })()}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className='flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-slate-800/50'
        >
          {[
            "256-bit Encryption",
            "99.9% Uptime",
            "GDPR Compliant",
            "24/7 Support",
          ].map((badge) => (
            <div key={badge} className='flex items-center gap-2 text-slate-500'>
              <Check className='w-4 h-4 text-teal-500' />
              <span className='text-sm'>{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
