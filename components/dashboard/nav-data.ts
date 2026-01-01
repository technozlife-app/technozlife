import {
  LayoutDashboard,
  Sparkles,
  History,
  Settings,
  CreditCard,
  Fingerprint,
  TrendingUp,
  List,
  CheckSquare,
} from "lucide-react";

export type NavItem = {
  icon: any;
  label: string;
  href: string;
};

export function getDashboardNavItems(): NavItem[] {
  const base: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    // { icon: Sparkles, label: "AI Generate", href: "/dashboard/generate" },
    {
      icon: List,
      label: "Recommendations",
      href: "/dashboard/recommendations",
    },
    { icon: Fingerprint, label: "Devices", href: "/dashboard/devices" },
    { icon: History, label: "History", href: "/dashboard/history" },
    { icon: TrendingUp, label: "Trends", href: "/dashboard/trends" },
    { icon: CheckSquare, label: "Habits", href: "/dashboard/habits" },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  // Dev-only Data Manager (only on localhost / non-production)
  try {
    if (
      process.env.NODE_ENV !== "production" &&
      typeof window !== "undefined"
    ) {
      const hostname = window.location.hostname || "";
      const isLocalhost =
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".localhost");
      if (isLocalhost) {
        base.push({
          icon: Sparkles,
          label: "Data Manager",
          href: "/dashboard/admin-sim",
        });
      }
    }
  } catch (e) {
    /* ignore */
  }

  return base;
}
