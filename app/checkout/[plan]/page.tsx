import RequireAuth from "@/components/auth/RequireAuth";
import { getPlanBySlug, getAllPlans } from "@/lib/plans";
import CheckoutClient from "../CheckoutClient";

// Static parameters
import { redirect } from "next/navigation";

export default function CheckoutPlanRedirect({
  params,
}: {
  params: { plan: string };
}) {
  // Redirect old /checkout/[plan] routes to the new unified checkout page
  const slug = params.plan;
  const target = `/checkout?plan=${encodeURIComponent(slug)}`;
  return redirect(target);
}
