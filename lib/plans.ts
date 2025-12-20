export type PlanId = "free" | "pro" | "enterprise";

export interface Plan {
  id: PlanId;
  slug: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  gradient?: string;
  iconBg?: string;
  iconColor?: string;
  // Optional icon component (set by UI layer if needed)
  icon?: any;
}

export const TIERS: Plan[] = [
  {
    id: "free",
    slug: "free",
    name: "Human",
    price: "Free",
    period: "forever",
    description: "Begin your journey into the bio-digital frontier",
    features: [
      "Basic neural interface",
      "5GB cloud sync storage",
      "Standard cognitive enhancement",
      "Community forum access",
      "Email support",
    ],
    cta: "Start Free",
    popular: false,
    gradient: "from-slate-500/20 to-slate-600/20",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-400",
  },
  {
    id: "pro",
    slug: "pro",
    name: "Cyborg",
    price: "$49",
    period: "/month",
    description: "Enhanced capabilities for the ambitious integrator",
    features: [
      "Advanced neural processing",
      "100GB cloud sync storage",
      "Priority cognitive enhancement",
      "Real-time biometric tracking",
      "API access & integrations",
      "24/7 priority support",
      "Custom neural patterns",
    ],
    cta: "Upgrade Now",
    popular: true,
    gradient: "from-teal-500/20 to-emerald-500/20",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
  },
  {
    id: "enterprise",
    slug: "enterprise",
    name: "Transcendence",
    price: "$199",
    period: "/month",
    description: "Unlimited potential for those who seek more",
    features: [
      "Quantum neural bridge access",
      "Unlimited cloud storage",
      "Maximum cognitive enhancement",
      "Direct thought-to-action",
      "Dedicated success manager",
      "Custom hardware integration",
      "Beta feature access",
      "White-glove onboarding",
    ],
    cta: "Contact Sales",
    popular: false,
    gradient: "from-violet-500/20 to-purple-500/20",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
  },
];

export function getPlanById(id: string): Plan | undefined {
  return TIERS.find((p) => p.id === id || p.slug === id);
}

export function getPlanBySlug(slug: string): Plan | undefined {
  return TIERS.find((p) => p.slug === slug);
}
export function getAllPlans(): Plan[] {
  return TIERS;
}
