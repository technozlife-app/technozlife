import RequireAuth from "@/components/auth/RequireAuth";
import ClientCheckoutWrapper from "./ClientCheckoutWrapper";

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <ClientCheckoutWrapper />
    </RequireAuth>
  );
}
