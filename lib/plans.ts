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
    slug: "core",
    name: "Core",
    price: "Free",
    period: "forever",
    description: "Explore the essentials of AI-powered wellness and daily habit tracking.",
    features: [
      "Basic Habit Tracking",
      "Personalized Wellness Insights",
      "Daily Routine Suggestions",
      "Goal Setting & Monitoring",
      "Limited Dashboard Analytics",
      "Basic Wearable Sync",
    ],
    cta: "Start Free",
    popular: false,
    gradient: "from-slate-500/20 to-slate-600/20",
    iconBg: "bg-slate-500/10",
    iconColor: "text-slate-400",
  },
  {
    id: "pro",
    slug: "nexus",
    name: "Nexus",
    price: "$19",
    period: "/month",
    description: "Accelerate your lifestyle optimization with advanced predictive insights and device integration.",
    features: [
      "Everything in Core",
      "Predictive Trend Analysis",
      "AI-Powered Recommendations",
      "Full Wearable & IoT Integration",
      "Advanced Habit Optimization",
      "Progress Milestones & Reports",
      "Priority AI Support",
    ],
    cta: "Upgrade Now",
    popular: true,
    gradient: "from-teal-500/20 to-emerald-500/20",
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
  },
  {
    id: "enterprise",
    slug: "quantum",
    name: "Quantum",
    price: "$49",
    period: "/month",
    description: "Ultimate AI lifestyle intelligence for complete, adaptive, and personalized wellness mastery.",
    features: [
      "Everything in Nexus",
      "Personalized Coaching Insights",
      "Multi-Device Synchronization",
      "Adaptive Predictive Analytics",
      "Behavioral Trend Forecasting",
      "Elite Dashboard Customization",
      "Early Access to New Features",
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
  // Match by slug first, then try id as fallback (case-insensitive)
  const normalized = slug.toLowerCase();
  return TIERS.find(
    (p) =>
      p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized
  );
}
export function getAllPlans(): Plan[] {
  return TIERS;
}
