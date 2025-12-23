import RequireAuth from "@/components/auth/RequireAuth";
import CheckoutClient from "./CheckoutClient";
import { getPlanBySlug, getAllPlans } from "@/lib/plans";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const planSlug = searchParams?.plan;
  const plan = planSlug ? getPlanBySlug(planSlug) : undefined;

  if (!plan) {
    return (
      <main className='max-w-3xl mx-auto px-6 py-20'>
        <h1 className='text-2xl font-bold text-slate-100'>Plan not found</h1>
        <p className='mt-4 text-slate-400'>
          We couldn't find the requested plan. Please go back to the pricing
          page.
        </p>
      </main>
    );
  }

  return (
    <RequireAuth>
      {/* CheckoutClient is a client component that handles the interactive flow */}
      <CheckoutClient plan={plan} />
    </RequireAuth>
  );
}
