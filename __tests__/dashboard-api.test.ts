import { dashboardApi, subscriptionApi } from "@/lib/api";

test("dashboardApi has getStats/getActivity/getJobs/getJobStatus", () => {
  expect(typeof dashboardApi.getStats).toBe("function");
  expect(typeof dashboardApi.getActivity).toBe("function");
  expect(typeof dashboardApi.getJobs).toBe("function");
  expect(typeof dashboardApi.getJobStatus).toBe("function");
});

test("subscriptionApi has createSubscription and getPaymentHistory", () => {
  expect(typeof subscriptionApi.createSubscription).toBe("function");
  expect(typeof subscriptionApi.getPaymentHistory).toBe("function");
});
