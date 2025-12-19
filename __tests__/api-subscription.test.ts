import { subscriptionApi } from "@/lib/api";

declare const test: any;
declare const expect: any;

test("subscriptionApi has createSubscription method", () => {
  expect(typeof subscriptionApi.createSubscription).toBe("function");
});

test("subscriptionApi has subscribe wrapper", () => {
  expect(typeof subscriptionApi.subscribe).toBe("function");
});
