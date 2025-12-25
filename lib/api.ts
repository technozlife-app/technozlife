// API Base URL
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.technozlife.com";

// ============================================================================
// RESPONSE INTERFACES (based on Backend.md)
// ============================================================================

// Backend returns: { status: 'success'|'error', message: string, data?: any, code: number, timestamp: string }
export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data?: T;
  code: number;
  timestamp: string;
  errors?: Record<string, string[]>; // Validation errors
}

// User Profile Interface
export interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  email_verified_at?: string;
  current_plan?: string;
  provider_name?: string | null;
  provider_id?: string | null;
  created_at: string;
  updated_at: string;
}

// Auth Response Data
export interface AuthData {
  user: UserProfile;
  token: string;
}

// Subscription Plan Interface
export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  interval: string; // "monthly" | "yearly"
  trial_days: number;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Payment Interface
export interface Payment {
  id: number;
  user_id: number;
  transaction_id: string;
  gateway: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  card_last_four?: string;
  card_brand?: string;
  description: string;
  plan_name?: string;
  gateway_response?: any;
  metadata?: any;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// SHA-256 Password Hashing (required by backend)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generic API Request Handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Debug logging for auth issues
    if (
      typeof window !== "undefined" &&
      (response.status === 401 || response.status === 422)
    ) {
      console.error(`[apiRequest] ${endpoint} failed:`, response.status, data);
    }

    // Backend returns { status: 'success'|'error', message, data, code, timestamp }
    if (!response.ok) {
      return {
        status: "error",
        message: data.message || "Request failed",
        data: data.data,
        errors: data.errors,
        code: response.status,
        timestamp: data.timestamp || new Date().toISOString(),
      };
    }

    return {
      status: data.status || "success",
      message: data.message,
      data: data.data,
      code: response.status,
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Network error",
      code: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export const authApi = {
  // POST /auth/register
  async register(data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation?: string;
    turnstile_token?: string;
    recaptcha_token?: string;
  }): Promise<ApiResponse<AuthData>> {
    const hashedPassword = await hashPassword(data.password);
    const body: any = {
      username: data.username,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password_hash: hashedPassword,
    };

    if (data.password_confirmation) {
      body.password_hash_confirmation = await hashPassword(
        data.password_confirmation
      );
    }
    if (data.turnstile_token) {
      body.turnstile_token = data.turnstile_token;
    }
    if (data.recaptcha_token) {
      body.recaptcha_token = data.recaptcha_token;
    }

    return apiRequest<AuthData>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // POST /auth/login
  async login(
    email: string,
    password: string,
    turnstile_token?: string,
    recaptcha_token?: string
  ): Promise<ApiResponse<AuthData>> {
    const hashedPassword = await hashPassword(password);
    const body: any = {
      email,
      password_hash: hashedPassword,
    };

    if (turnstile_token) {
      body.turnstile_token = turnstile_token;
    }
    if (recaptcha_token) {
      body.recaptcha_token = recaptcha_token;
    }

    return apiRequest<AuthData>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // POST /auth/logout
  async logout(): Promise<ApiResponse> {
    return apiRequest("/auth/logout", { method: "POST" });
  },

  // GET /auth/google/redirect (returns redirect URL for browser navigation)
  getGoogleRedirect(): { status: "success"; data: { url: string } } {
    return {
      status: "success",
      data: { url: `${API_BASE}/auth/google/redirect` },
    };
  },

  // POST /auth/google/token (exchange code or credential for token)
  async googleCallback(
    code?: string,
    credential?: string
  ): Promise<ApiResponse<AuthData>> {
    const body: any = {};
    if (code) body.code = code;
    if (credential) body.credential = credential;

    return apiRequest<AuthData>("/auth/google/token", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // GET /auth/github/redirect (returns redirect URL for browser navigation)
  getGithubRedirect(): { status: "success"; data: { url: string } } {
    return {
      status: "success",
      data: { url: `${API_BASE}/auth/github/redirect` },
    };
  },

  // POST /auth/github/token (exchange code or access_token for token)
  async githubCallback(
    code?: string,
    access_token?: string
  ): Promise<ApiResponse<AuthData>> {
    const body: any = {};
    if (code) body.code = code;
    if (access_token) body.access_token = access_token;

    return apiRequest<AuthData>("/auth/github/token", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // POST /auth/password/forgot
  async forgotPassword(
    email: string,
    turnstile_token?: string,
    recaptcha_token?: string
  ): Promise<ApiResponse> {
    const body: any = { email };
    if (turnstile_token) body.turnstile_token = turnstile_token;
    if (recaptcha_token) body.recaptcha_token = recaptcha_token;

    return apiRequest("/auth/password/forgot", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // POST /auth/password/reset
  async resetPassword(data: {
    email: string;
    token: string;
    password: string;
    password_confirmation?: string;
  }): Promise<ApiResponse<AuthData>> {
    const hashedPassword = await hashPassword(data.password);
    const body: any = {
      email: data.email,
      token: data.token,
      password_hash: hashedPassword,
    };

    if (data.password_confirmation) {
      body.password_hash_confirmation = await hashPassword(
        data.password_confirmation
      );
    }

    return apiRequest<AuthData>("/auth/password/reset", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // POST /auth/password/change (authenticated)
  async changePassword(data: {
    old_password?: string;
    password: string;
    password_confirmation?: string;
  }): Promise<ApiResponse> {
    const body: any = {
      password_hash: await hashPassword(data.password),
    };

    if (data.old_password) {
      body.old_password_hash = await hashPassword(data.old_password);
    }
    if (data.password_confirmation) {
      body.password_hash_confirmation = await hashPassword(
        data.password_confirmation
      );
    }

    return apiRequest("/auth/password/change", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // POST /auth/verify/send
  async sendVerification(email?: string): Promise<ApiResponse> {
    return apiRequest("/auth/verify/send", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // GET /auth/verify/{token}
  async verifyEmail(token: string): Promise<ApiResponse<AuthData>> {
    return apiRequest<AuthData>(`/auth/verify/${token}`);
  },

  // Link OAuth provider (authenticated) - returns URL for browser navigation
  linkProvider(provider: "google" | "github"): {
    status: "success";
    data: { url: string };
  } {
    return {
      status: "success",
      data: { url: `${API_BASE}/auth/link/${provider}/redirect` },
    };
  },

  // POST /auth/unlink (authenticated)
  async unlinkProvider(provider: string): Promise<ApiResponse> {
    return apiRequest("/auth/unlink", {
      method: "POST",
      body: JSON.stringify({ provider }),
    });
  },
};

// ============================================================================
// USER PROFILE API
// ============================================================================

export const userApi = {
  // GET /user (backend returns user directly in data, not nested)
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiRequest<UserProfile>("/user");
  },

  // PUT /user (backend returns user directly in data, not nested)
  async updateProfile(
    data: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    return apiRequest<UserProfile>("/user", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // POST /user/avatar (returns { avatar: string })
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const formData = new FormData();
    formData.append("avatar", file);

    const headers: HeadersInit = {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${API_BASE}/user/avatar`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: "error",
          message: data.message || "Upload failed",
          code: response.status,
          timestamp: data.timestamp || new Date().toISOString(),
        };
      }

      return {
        status: data.status || "success",
        message: data.message,
        data: data.data,
        code: response.status,
        timestamp: data.timestamp || new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Network error",
        code: 0,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // DELETE /user
  async deleteAccount(): Promise<ApiResponse> {
    return apiRequest("/user", { method: "DELETE" });
  },

  // GET /users/{id}/public (returns { user: Partial<UserProfile> })
  async getPublicProfile(
    id: number
  ): Promise<ApiResponse<{ user: Partial<UserProfile> }>> {
    return apiRequest<{ user: Partial<UserProfile> }>(`/users/${id}/public`);
  },
};

// ============================================================================
// MAIL API
// ============================================================================

export const mailApi = {
  // POST /mail/contact
  async sendContact(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    turnstile_token?: string;
    recaptcha_token?: string;
  }): Promise<ApiResponse> {
    const body: any = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    };

    if (data.turnstile_token) {
      body.turnstile_token = data.turnstile_token;
    }
    if (data.recaptcha_token) {
      body.recaptcha_token = data.recaptcha_token;
    }

    return apiRequest("/mail/contact", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // POST /mail/newsletter
  async subscribeNewsletter(
    email: string,
    name?: string
  ): Promise<ApiResponse> {
    const body: any = { email };
    if (name) body.name = name;

    return apiRequest("/mail/newsletter", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // GET /mail/newsletter/verify/{token}
  async verifyNewsletter(token: string): Promise<ApiResponse> {
    return apiRequest(`/mail/newsletter/verify/${token}`);
  },

  // GET /mail/newsletter/unsubscribe/{token}
  async unsubscribeNewsletter(token: string): Promise<ApiResponse> {
    return apiRequest(`/mail/newsletter/unsubscribe/${token}`);
  },

  // POST /mail/password-reset
  async sendPasswordReset(email: string): Promise<ApiResponse> {
    return apiRequest("/mail/password-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

// ============================================================================
// AI API
// ============================================================================

export const aiApi = {
  // POST /ai/generate
  async generate(data: {
    prompt: string;
    model?: string;
    temperature?: number;
    max_tokens?: number;
    async?: boolean;
  }): Promise<
    ApiResponse<{
      content?: string;
      tokens_used?: number;
      job_id?: string;
      result?: string;
      request_id?: string;
    }>
  > {
    return apiRequest<{
      content?: string;
      tokens_used?: number;
      job_id?: string;
      result?: string;
      request_id?: string;
    }>("/ai/generate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // GET /ai/jobs/{id}/status
  async getJobStatus(jobId: string): Promise<
    ApiResponse<{
      status: string;
      result?: string;
      tokens_used?: number;
    }>
  > {
    return apiRequest<{
      status: string;
      result?: string;
      tokens_used?: number;
    }>(`/ai/jobs/${jobId}/status`);
  },
};

// ============================================================================
// MAPS API
// ============================================================================

export const mapsApi = {
  // POST /maps/pin
  async generatePin(data: {
    address: string;
    zoom?: number;
    size?: string;
  }): Promise<ApiResponse<{ embed_url: string; direct_url: string }>> {
    return apiRequest<{ embed_url: string; direct_url: string }>("/maps/pin", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// CAPTCHA API
// ============================================================================

export const captchaApi = {
  // POST /captcha/verify
  async verify(data: {
    token: string;
    action?: string;
    provider?: "turnstile" | "recaptcha";
  }): Promise<ApiResponse<{ valid: boolean }>> {
    return apiRequest<{ valid: boolean }>("/captcha/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// SUBSCRIPTION PLANS API
// ============================================================================

export const plansApi = {
  // GET /subscription-plans (returns { plans: SubscriptionPlan[] })
  async getPlans(): Promise<ApiResponse<{ plans: SubscriptionPlan[] }>> {
    return apiRequest<{ plans: SubscriptionPlan[] }>("/subscription-plans");
  },

  // GET /subscription-plans/{slug} (returns { plan: SubscriptionPlan })
  async getPlan(
    slug: string
  ): Promise<ApiResponse<{ plan: SubscriptionPlan }>> {
    return apiRequest<{ plan: SubscriptionPlan }>(
      `/subscription-plans/${slug}`
    );
  },

  // POST /subscription-plans (authenticated, admin)
  async createPlan(
    data: Omit<SubscriptionPlan, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<{ plan: SubscriptionPlan }>> {
    return apiRequest<{ plan: SubscriptionPlan }>("/subscription-plans", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT /subscription-plans/{id} (authenticated, admin)
  async updatePlan(
    id: number,
    data: Partial<SubscriptionPlan>
  ): Promise<ApiResponse<{ plan: SubscriptionPlan }>> {
    return apiRequest<{ plan: SubscriptionPlan }>(`/subscription-plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE /subscription-plans/{id} (authenticated, admin)
  async deletePlan(id: number): Promise<ApiResponse> {
    return apiRequest(`/subscription-plans/${id}`, { method: "DELETE" });
  },
};

// ============================================================================
// PAYMENTS API
// ============================================================================

export const paymentsApi = {
  // POST /subscriptions (purchase a plan)
  async createSubscription(data: {
    plan_slug: string;
    payment_method?: any;
  }): Promise<
    ApiResponse<{
      subscription?: { id: string; status: string };
      payment?: Payment;
      url?: string;
    }>
  > {
    return apiRequest<{
      subscription?: { id: string; status: string };
      payment?: Payment;
      url?: string;
    }>("/subscriptions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // POST /payments/process (one-time payment)
  async processPayment(data: {
    amount: number;
    currency: string;
    description: string;
    payment_method: any;
  }): Promise<
    ApiResponse<{
      payment: Payment;
    }>
  > {
    return apiRequest<{
      payment: Payment;
    }>("/payments/process", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // GET /payments (returns { payments: Payment[] })
  async getHistory(): Promise<ApiResponse<{ payments: Payment[] }>> {
    return apiRequest<{ payments: Payment[] }>("/payments");
  },

  // GET /payments/last-plan (returns { payment: Payment })
  async getLastPlan(): Promise<ApiResponse<{ payment: Payment }>> {
    return apiRequest<{ payment: Payment }>("/payments/last-plan");
  },

  // GET /payments/{transactionId} (returns { payment: Payment })
  async getPayment(
    transactionId: string
  ): Promise<ApiResponse<{ payment: Payment }>> {
    return apiRequest<{ payment: Payment }>(`/payments/${transactionId}`);
  },

  // POST /payments/refund/{transactionId}
  async requestRefund(transactionId: string): Promise<ApiResponse> {
    return apiRequest(`/payments/refund/${transactionId}`, {
      method: "POST",
    });
  },

  // POST /payments/revert-plan
  async revertPlan(): Promise<ApiResponse> {
    return apiRequest("/payments/revert-plan", { method: "POST" });
  },

  // POST /payments/webhook (called by payment gateway)
  async webhook(data: any): Promise<ApiResponse> {
    return apiRequest("/payments/webhook", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// ADMIN API
// ============================================================================

export const adminApi = {
  // POST /admin/migrate
  async runMigrations(data?: {
    token: string;
    seed?: boolean;
    path?: string;
  }): Promise<
    ApiResponse<{
      migrations?: string[];
      message: string;
    }>
  > {
    const body: any = {};
    if (data?.seed) body.seed = data.seed;
    if (data?.path) body.path = data.path;
    if (data?.token) body.token = data.token;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(data?.token && { "X-RUN-MIG-TOKEN": data.token }),
    };

    return apiRequest<{
      migrations?: string[];
      message: string;
    }>("/admin/migrate", {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });
  },
};

// ============================================================================
// BACKWARDS COMPATIBILITY ALIASES
// ============================================================================

export const contactApi = mailApi;

export const subscriptionApi = {
  getPlans: plansApi.getPlans,
  getPlan: plansApi.getPlan,
  createSubscription: paymentsApi.createSubscription,
  getPaymentHistory: paymentsApi.getHistory,
  cancelSubscription: async (): Promise<ApiResponse> => {
    return {
      status: "error",
      message: "Cancel subscription endpoint not implemented",
      code: 501,
      timestamp: new Date().toISOString(),
    };
  },
};
