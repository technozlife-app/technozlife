export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.technozlife.com";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  code: number;
  timestamp: string;
}

export interface UserProfile {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar?: string;
  current_plan?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  // Backwards-compatible fields some callers may still use
  name?: string;
  plan?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// SHA-256 hash function for password
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "An error occurred",
        code: response.status,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data,
      code: data.code,
      timestamp: data.timestamp,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      code: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// Auth API
export const authApi = {
  /**
   * Basic register (backwards compatible): accepts (email, password, name)
   * Sends `password_hash` and uses `first_name` for `name` to match API expectations.
   */
  async register(
    email: string,
    password: string,
    name?: string,
    recaptchaToken?: string
  ) {
    const hashedPassword = await hashPassword(password);
    const body: any = {
      email,
      password_hash: hashedPassword,
    };

    if (name) body.first_name = name;
    if (recaptchaToken) body.recaptcha_token = recaptchaToken;

    return apiRequest<{ user: UserProfile; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * Full-featured register per API.md
   * payload: { username?, first_name?, last_name?, email, password, passwordConfirmation?, recaptchaToken? }
   */
  async registerFull(data: {
    username?: string;
    first_name?: string;
    last_name?: string;
    email: string;
    password: string;
    passwordConfirmation?: string;
    recaptchaToken?: string;
  }) {
    const hashedPassword = await hashPassword(data.password);
    const body: any = {
      email: data.email,
      password_hash: hashedPassword,
    };
    if (data.username) body.username = data.username;
    if (data.first_name) body.first_name = data.first_name;
    if (data.last_name) body.last_name = data.last_name;
    if (data.passwordConfirmation)
      body.password_hash_confirmation = await hashPassword(
        data.passwordConfirmation
      );
    if (data.recaptchaToken) body.recaptcha_token = data.recaptchaToken;

    return apiRequest<{ user: UserProfile; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * Login using email + password. Sends `password_hash` as required by API.md
   */
  async login(email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    return apiRequest<{ user: UserProfile; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password_hash: hashedPassword }),
    });
  },

  /**
   * Forgot password (request reset email)
   * POST /auth/password/forgot { email }
   */
  async forgotPassword(email: string) {
    return apiRequest("/auth/password/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password using token from email
   * POST /auth/password/reset { email, token, password_hash, password_hash_confirmation }
   */
  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
    newPasswordConfirmation?: string
  ) {
    const hashed = await hashPassword(newPassword);
    const body: any = {
      email,
      token,
      password_hash: hashed,
    };
    if (newPasswordConfirmation)
      body.password_hash_confirmation = await hashPassword(
        newPasswordConfirmation
      );

    return apiRequest<{ user: UserProfile; token: string }>(
      "/auth/password/reset",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  },

  /**
   * Change password (authenticated)
   * POST /auth/password/change { old_password_hash?, password_hash, password_hash_confirmation? }
   */
  async changePassword(
    oldPassword: string | undefined,
    newPassword: string,
    newPasswordConfirmation?: string
  ) {
    const body: any = {
      password_hash: await hashPassword(newPassword),
    };
    if (oldPassword) body.old_password_hash = await hashPassword(oldPassword);
    if (newPasswordConfirmation)
      body.password_hash_confirmation = await hashPassword(
        newPasswordConfirmation
      );

    return apiRequest("/auth/password/change", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * Exchange Google credential/code for tokens (API flow)
   * POST /auth/google/token
   * Accepts either an ID token (JWT) or an authorization code. When a string is
   * passed we heuristically detect JWTs (3 dot-separated parts) and set the
   * appropriate field so the backend receives `{ token }` or `{ code }`.
   */
  async googleAuth(payload: { token?: string; code?: string } | string) {
    let body: { token?: string; code?: string };
    if (typeof payload === "string") {
      // Heuristic: JWT tokens from Google contain two dots
      if (payload.split(".").length === 3) {
        body = { token: payload };
      } else {
        body = { code: payload };
      }
    } else {
      body = payload;
    }

    return apiRequest<{ user: UserProfile; token: string }>(
      "/auth/google/token",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  },

  /**
   * Exchange GitHub code/access_token for tokens (API flow)
   * POST /auth/github/token
   */
  async githubAuth(payload: { access_token?: string; code?: string } | string) {
    const body = typeof payload === "string" ? { code: payload } : payload;
    return apiRequest<{ user: UserProfile; token: string }>(
      "/auth/github/token",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
  },

  /**
   * Get redirect URL for OAuth browser flows (returns Location header when available)
   */
  async getRedirectUrl(endpoint: string) {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "GET",
        headers,
        redirect: "manual",
      });

      const location =
        response.headers.get("location") || response.headers.get("Location");

      if (location) {
        return { success: true, data: { url: location } } as ApiResponse<{
          url: string;
        }>;
      }

      // Fall back to JSON if server returned JSON instead of redirect
      try {
        const data = await response.json();
        if (!response.ok) {
          return {
            success: false,
            message: data.message || "An error occurred",
          };
        }
        return { success: true, data } as ApiResponse<any>;
      } catch (err) {
        return { success: false, message: "Redirect location not available" };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error",
      };
    }
  },

  async getGoogleRedirect() {
    return this.getRedirectUrl("/auth/google/redirect");
  },

  async getGithubRedirect() {
    return this.getRedirectUrl("/auth/github/redirect");
  },

  /**
   * Link provider redirect/callback helpers (authenticated)
   */
  async getLinkProviderRedirect(provider: string) {
    return this.getRedirectUrl(`/auth/link/${provider}/redirect`);
  },

  async getLinkProviderCallback(provider: string, query?: string) {
    // query should include any query string from provider (e.g., ?code=...)
    const url = `/auth/link/${provider}/callback${query || ""}`;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(`${API_BASE}${url}`, {
        method: "GET",
        headers,
        redirect: "follow",
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || "An error occurred" };
      }
      return { success: true, data } as ApiResponse<any>;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error",
      };
    }
  },

  /**
   * Unlink a provider (authenticated)
   * POST /auth/unlink { provider }
   */
  async unlink(provider: string) {
    return apiRequest(`/auth/unlink`, {
      method: "POST",
      body: JSON.stringify({ provider }),
    });
  },

  async logout() {
    return apiRequest("/auth/logout", { method: "POST" });
  },

  // NOTE: `/auth/refresh` is NOT documented in API.md. To avoid calling
  // non-listed endpoints that can cause 404s, expose a stub that returns
  // an explicit failure message. Token refresh should be handled by the
  // server only if an endpoint is documented in API.md.
  async refreshToken(_refreshToken: string) {
    return {
      success: false,
      message: "Token refresh not supported by API",
    } as ApiResponse<any>;
  },

  async getProfile() {
    // API exposes the authenticated user at /user
    return apiRequest<{ user: UserProfile }>("/user");
  },

  async verifyEmail(token: string) {
    return apiRequest(`/auth/verify/${token}`);
  },

  async resendVerification(email?: string) {
    return apiRequest("/auth/verify/send", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async updateProfile(data: Partial<UserProfile>) {
    // Update authenticated user - endpoint is /user
    return apiRequest<UserProfile>("/user", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// Contact API
export const contactApi = {
  async sendMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    recaptchaToken?: string;
  }) {
    const body: any = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };
    if (data.recaptchaToken) body.recaptcha_token = data.recaptchaToken;
    return apiRequest("/mail/contact", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};

// Subscription API
export const subscriptionApi = {
  async getPlans() {
    // Use documented endpoint `/subscription-plans` (API.md)
    try {
      const res = await apiRequest<{
        plans: Array<{ id: string; name: string; price: number }>;
      }>("/subscription-plans");
      // If backend returns plans, use them
      if (
        res.success &&
        res.data &&
        Array.isArray((res.data as any).plans) &&
        (res.data as any).plans.length > 0
      )
        return res;
    } catch (e) {
      // ignore and fallback
    }

    // Fallback to local static plans when backend has no plans or endpoint disabled
    try {
      const { getAllPlans } = await import("./plans");
      return {
        success: true,
        data: { plans: getAllPlans() },
      } as ApiResponse<any>;
    } catch (e) {
      return { success: false, message: "Unable to load plans" };
    }
  },

  // Create a subscription - backend expected payload: { plan_slug, payment_method }
  async createSubscription(plan_slug: string, payment_method?: any) {
    return apiRequest<{
      subscriptionId?: string;
      status?: string;
      url?: string;
    }>("/subscriptions", {
      method: "POST",
      body: JSON.stringify({ plan_slug, payment_method }),
    });
  },

  // Backwards-compatible wrapper for older callers
  async subscribe(planId: string, paymentMethod: string) {
    return this.createSubscription(
      planId,
      paymentMethod === "card" ? { method: "card" } : undefined
    );
  },

  async cancelSubscription() {
    // Use documented endpoint to revert/clear current plan
    return apiRequest("/payments/revert-plan", { method: "POST" });
  },

  async getPaymentHistory() {
    // Use payments endpoint per API.md
    try {
      const res = await apiRequest<{
        payments: Array<{
          id: string;
          amount: number;
          date: string;
          status: string;
        }>;
      }>("/payments");
      if (res.success && res.data) return res;
    } catch (e) {
      // ignore
    }

    // Fallback to empty list when payments not available
    return { success: true, data: { payments: [] } } as ApiResponse<any>;
  },
};

// Maps API
export const mapsApi = {
  async getLocations() {
    // `/maps/locations` is not present in the documented API. Use `/maps/pin`
    // (POST) as described in API.md, or provide a frontend-only fallback.
    return {
      success: false,
      message: "Endpoint not available. Use POST /maps/pin",
    } as ApiResponse<any>;
  },
};

// Dashboard API (simulated functions)
export const dashboardApi = {
  async getStats() {
    // `/dashboard/stats` is not documented in API.md. Return a safe frontend
    // fallback so the dashboard can render without causing 404s.
    return {
      success: true,
      data: {
        totalGenerations: 0,
        tokensUsed: 0,
        savedTemplates: 0,
        activeProjects: 0,
      },
    } as ApiResponse<any>;
  },

  async getActivity() {
    // `/dashboard/activity` is not documented; return an empty activity list.
    return { success: true, data: { activities: [] } } as ApiResponse<any>;
  },

  async generateContent(prompt: string, type: string) {
    return apiRequest<{
      content?: string;
      tokensUsed?: number;
      jobId?: string;
    }>("/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, type }),
    });
  },

  async getJobs() {
    // There is no documented endpoint to list AI jobs. Use a client-side
    // fallback (localStorage history) to avoid calling undisclosed endpoints
    // that would return 404s.
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("ai_jobs_history")
          : null;
      const jobs = raw ? JSON.parse(raw) : [];
      return { success: true, data: { jobs } } as ApiResponse<any>;
    } catch (e) {
      return { success: true, data: { jobs: [] } } as ApiResponse<any>;
    }
  },

  async getJobStatus(jobId: string) {
    return apiRequest<{ status: string; result?: string; tokensUsed?: number }>(
      `/ai/jobs/${jobId}/status`
    );
  },
};
