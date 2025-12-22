import { paymentsApi, plansApi } from "./api";
import { getAllPlans } from "./plans";
import type { UserProfile } from "./api";

/**
 * Ensure the provided user has a subscription plan. Returns chosen plan slug or null.
 * Strategy:
 *  - If user has `current_plan` property, do nothing and return that value
 *  - Fetch backend plans via plansApi.getPlans(); pick the first plan if available
 *  - If backend returned no plans, fall back to TIERS via getAllPlans() (first entry)
 *  - Call paymentsApi.createSubscription(plan_slug) for the chosen plan
 *  - Return plan_slug on success, null on failure
 */
export async function ensureUserHasPlan(user?: UserProfile | null) {
  try {
    const currentPlan = user?.current_plan;
    if (currentPlan) return currentPlan;

    const plansRes = await plansApi.getPlans();
    let plans: Array<any> | null = null;
    if (
      plansRes.success &&
      plansRes.data &&
      Array.isArray(plansRes.data.plans)
    ) {
      plans = plansRes.data.plans;
    }

    if (!plans || plans.length === 0) {
      // Fallback to local plans
      const local = getAllPlans();
      if (!local || local.length === 0) return null;
      const chosen = local[0];
      // Only auto-subscribe if chosen plan is free
      const isFree =
        typeof chosen.price === "string"
          ? /free/i.test(chosen.price)
          : Number(chosen.price) === 0;
      if (!isFree) return null;
      const subscribeRes = await paymentsApi.createSubscription({
        plan_slug: chosen.slug,
      });
      if (subscribeRes.success) return chosen.slug;
      return null;
    }

    // Prefer a free plan if available
    let chosen = plans.find((p) => {
      if (typeof p.price === "string") return /free/i.test(p.price);
      return Number(p.price) === 0;
    });

    // Otherwise do not auto-subscribe to paid plans
    if (!chosen) return null;

    // Create subscription using server-slug (plan_slug)
    const subscribeRes = await paymentsApi.createSubscription({
      plan_slug: chosen.slug || chosen.id,
    });
    if (subscribeRes.success) return chosen.slug || chosen.id;
    return null;
  } catch (e) {
    return null;
  }
}
