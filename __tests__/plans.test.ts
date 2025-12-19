import { getPlanById, getPlanBySlug, TIERS } from "@/lib/plans";

declare const test: any;
declare const expect: any;

test("TIERS provides at least three plans", () => {
  expect(TIERS.length).toBeGreaterThanOrEqual(3);
});

test("getPlanById finds pro plan", () => {
  const p = getPlanById("pro");
  expect(p).toBeDefined();
  expect(p?.name).toMatch(/Cyborg/i);
});

test("getPlanBySlug finds pro slug", () => {
  const p = getPlanBySlug("pro");
  expect(p).toBeDefined();
  expect(p?.id).toBe("pro");
});
