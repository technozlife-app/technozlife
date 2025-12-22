// API Base URL
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.technozlife.com";

// Core API Response Interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  code: number;
  timestamp: string;
}

// User Profile Interface (based on backend.md examples)
export interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  email_verified_at?: string;
  current_plan?: string;
  created_at: string;
  updated_at: string;
}

// Auth Response Data (based on backend.md examples)
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
  interval: string;
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
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

// AI Job Interface
export interface AIJob {
  id: string;
  status: string;
  result?: string;
  tokens_used?: number;
  created_at: string;
  updated_at: string;
}

// SHA-256 Password Hashing
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
  // Developer-friendly diagnostic: warn when API_BASE looks relative (may cause calls to current origin)
  if (typeof window !== "undefined") {
    try {
      const isAbsolute = /^https?:\/\//i.test(API_BASE);
      if (!isAbsolute) {
        // eslint-disable-next-line no-console
        console.warn(
          `[apiRequest] NEXT_PUBLIC_API_BASE='${API_BASE}' does not look like an absolute URL. Requests will be sent to the current origin + '${API_BASE}'. If your API is hosted on a separate domain, set NEXT_PUBLIC_API_BASE to the full URL (e.g. 'https://api.example.com').`
        );
      }
    } catch (e) {
      /* ignore */
    }
  }
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Request failed",
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

// Authentication API
export const authApi = {
  // Register new user
  async register(data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_hash_confirmation?: string;
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

    if (data.password_hash_confirmation) {
      body.password_hash_confirmation = await hashPassword(
        data.password_hash_confirmation
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

  // Login with email and password
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

  // Logout
  async logout(): Promise<ApiResponse> {
    return apiRequest("/auth/logout", { method: "POST" });
  },

  // Google OAuth redirect URL
  async getGoogleRedirect(): Promise<ApiResponse<{ url: string }>> {
    // For browser-based OAuth flow the frontend should navigate the browser
    // directly to the backend redirect endpoint so the backend can start
    // the provider handshake and ultimately redirect back to the frontend.
    return {
      success: true,
      message: "Use this URL for browser redirect",
      data: { url: `${API_BASE}/auth/google/redirect` },
      code: 200,
      timestamp: new Date().toISOString(),
    };
  },

  // Google OAuth callback (API flow)
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

  // GitHub OAuth redirect URL
  async getGithubRedirect(): Promise<ApiResponse<{ url: string }>> {
    // See note in getGoogleRedirect: provide the backend redirect URL for
    // browser navigation rather than attempting a fetch-for-302 (CORS/redirect
    // issues). The frontend can use `window.location.href = url` to start flow.
    return {
      success: true,
      message: "Use this URL for browser redirect",
      data: { url: `${API_BASE}/auth/github/redirect` },
      code: 200,
      timestamp: new Date().toISOString(),
    };
  },

  // GitHub OAuth callback (API flow)
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

  // Password reset request
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

  // Reset password with token
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

  // Change password (authenticated)
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

  // Send email verification
  async sendVerification(email?: string): Promise<ApiResponse> {
    return apiRequest("/auth/verify/send", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Verify email with token
  async verifyEmail(token: string): Promise<ApiResponse> {
    return apiRequest(`/auth/verify/${token}`);
  },

  // Link OAuth provider (authenticated)
  async linkProvider(provider: "google" | "github"): Promise<ApiResponse> {
    // For linking providers while authenticated, the frontend should navigate
    // the browser to the backend link redirect endpoint. The backend will
    // perform the OAuth handshake and redirect back to the frontend.
    return {
      success: true,
      message: "Use this URL for browser redirect",
      data: { url: `${API_BASE}/auth/link/${provider}/redirect` },
      code: 200,
      timestamp: new Date().toISOString(),
    };
  },

  // Unlink OAuth provider (authenticated)
  async unlinkProvider(provider: string): Promise<ApiResponse> {
    return apiRequest("/auth/unlink", {
      method: "POST",
      body: JSON.stringify({ provider }),
    });
  },
};

// User Profile API
export const userApi = {
  // Get current user profile
  async getProfile(): Promise<ApiResponse<{ user: UserProfile }>> {
    return apiRequest<{ user: UserProfile }>("/user");
  },

  // Update user profile
  async updateProfile(
    data: Partial<UserProfile>
  ): Promise<ApiResponse<UserProfile>> {
    return apiRequest<UserProfile>("/user", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatar: string }>> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    const formData = new FormData();
    formData.append("avatar", file);

    const headers: HeadersInit = {
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
          success: false,
          message: data.message || "Upload failed",
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
  },

  // Delete user account
  async deleteAccount(): Promise<ApiResponse> {
    return apiRequest("/user", { method: "DELETE" });
  },

  // Get public profile
  async getPublicProfile(
    id: number
  ): Promise<ApiResponse<{ user: Partial<UserProfile> }>> {
    return apiRequest<{ user: Partial<UserProfile> }>(`/users/${id}/public`);
  },
};

// Mail API
export const mailApi = {
  // Send contact message
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

  // Subscribe to newsletter
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

  // Verify newsletter subscription
  async verifyNewsletter(token: string): Promise<ApiResponse> {
    return apiRequest(`/mail/newsletter/verify/${token}`);
  },

  // Unsubscribe from newsletter
  async unsubscribeNewsletter(token: string): Promise<ApiResponse> {
    return apiRequest(`/mail/newsletter/unsubscribe/${token}`);
  },

  // Send password reset email (alternative endpoint)
  async sendPasswordReset(email: string): Promise<ApiResponse> {
    return apiRequest("/mail/password-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};

// AI API
export const aiApi = {
  // Generate AI content
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

  // Get AI job status
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

// Maps API
export const mapsApi = {
  // Generate Google Maps embed URL
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

// Captcha API
export const captchaApi = {
  // Verify captcha token
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

// Payments API
export const paymentsApi = {
  // Create subscription
  async createSubscription(data: {
    plan_slug: string;
    payment_method?: any;
  }): Promise<
    ApiResponse<{
      subscription_id?: string;
      status?: string;
      url?: string;
    }>
  > {
    return apiRequest<{
      subscription_id?: string;
      status?: string;
      url?: string;
    }>("/subscriptions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Process one-time payment
  async processPayment(data: {
    amount: number;
    currency: string;
    description: string;
    payment_method: any;
  }): Promise<
    ApiResponse<{
      transaction_id: string;
      status: string;
    }>
  > {
    return apiRequest<{
      transaction_id: string;
      status: string;
    }>("/payments/process", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Get payment history
  async getHistory(): Promise<ApiResponse<{ payments: Payment[] }>> {
    return apiRequest<{ payments: Payment[] }>("/payments");
  },

  // Get last purchased plan
  async getLastPlan(): Promise<ApiResponse<{ plan: SubscriptionPlan }>> {
    return apiRequest<{ plan: SubscriptionPlan }>("/payments/last-plan");
  },

  // Get payment details
  async getPayment(transactionId: string): Promise<ApiResponse<Payment>> {
    return apiRequest<Payment>(`/payments/${transactionId}`);
  },

  // Request refund
  async requestRefund(transactionId: string): Promise<ApiResponse> {
    return apiRequest(`/payments/refund/${transactionId}`, {
      method: "POST",
    });
  },

  // Revert/clear current plan
  async revertPlan(): Promise<ApiResponse> {
    return apiRequest("/payments/revert-plan", { method: "POST" });
  },

  // Payment webhook (usually called by payment provider)
  async webhook(data: any): Promise<ApiResponse> {
    return apiRequest("/payments/webhook", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Subscription Plans API
export const plansApi = {
  // List all plans
  async getPlans(): Promise<ApiResponse<{ plans: SubscriptionPlan[] }>> {
    return apiRequest<{ plans: SubscriptionPlan[] }>("/subscription-plans");
  },

  // Get plan details
  async getPlan(slug: string): Promise<ApiResponse<SubscriptionPlan>> {
    return apiRequest<SubscriptionPlan>(`/subscription-plans/${slug}`);
  },

  // Create new plan (admin)
  async createPlan(
    data: Omit<SubscriptionPlan, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<SubscriptionPlan>> {
    return apiRequest<SubscriptionPlan>("/subscription-plans", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update plan (admin)
  async updatePlan(
    id: number,
    data: Partial<SubscriptionPlan>
  ): Promise<ApiResponse<SubscriptionPlan>> {
    return apiRequest<SubscriptionPlan>(`/subscription-plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete plan (admin)
  async deletePlan(id: number): Promise<ApiResponse> {
    return apiRequest(`/subscription-plans/${id}`, { method: "DELETE" });
  },
};

// Admin API
export const adminApi = {
  // Run database migrations
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
    if (data?.token) {
      // Include token in body for admin endpoints
      body.token = data.token;
    }

    return apiRequest<{
      migrations?: string[];
      message: string;
    }>("/admin/migrate", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};

// Backwards compatibility aliases
export const contactApi = mailApi;
export const subscriptionApi = {
  getPlans: plansApi.getPlans,
  getPlan: plansApi.getPlan,
  createSubscription: paymentsApi.createSubscription,
  getPaymentHistory: paymentsApi.getHistory,
  cancelSubscription: async () => {
    // This endpoint doesn't exist in the backend, return error
    return {
      success: false,
      message: "Cancel subscription not implemented",
      code: 501,
      timestamp: new Date().toISOString(),
    };
  },
};
