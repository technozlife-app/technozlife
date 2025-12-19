const API_BASE = "https://api.technozlife.com"

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

export interface UserProfile {
  id: string
  email: string
  name: string
  avatar?: string
  plan: "free" | "pro" | "enterprise"
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// SHA-256 hash function for password
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Generic API request handler
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "An error occurred",
      }
    }

    return {
      success: true,
      data,
      message: data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    }
  }
}

// Auth API
export const authApi = {
  async register(email: string, password: string, name: string) {
    const hashedPassword = await hashPassword(password)
    return apiRequest<{ user: UserProfile; tokens: AuthTokens }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password: hashedPassword, name }),
    })
  },

  async login(email: string, password: string) {
    const hashedPassword = await hashPassword(password)
    return apiRequest<{ user: UserProfile; tokens: AuthTokens }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: hashedPassword }),
    })
  },

  async googleAuth(token: string) {
    return apiRequest<{ user: UserProfile; tokens: AuthTokens }>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  },

  async githubAuth(code: string) {
    return apiRequest<{ user: UserProfile; tokens: AuthTokens }>("/auth/github", {
      method: "POST",
      body: JSON.stringify({ code }),
    })
  },

  async logout() {
    return apiRequest("/auth/logout", { method: "POST" })
  },

  async refreshToken(refreshToken: string) {
    return apiRequest<AuthTokens>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  },

  async getProfile() {
    return apiRequest<UserProfile>("/user/profile")
  },

  async updateProfile(data: Partial<UserProfile>) {
    return apiRequest<UserProfile>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}

// Contact API
export const contactApi = {
  async sendMessage(data: { name: string; email: string; subject: string; message: string }) {
    return apiRequest("/mail/contact", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// Subscription API
export const subscriptionApi = {
  async getPlans() {
    return apiRequest<{ plans: Array<{ id: string; name: string; price: number }> }>("/subscriptions/plans")
  },

  async subscribe(planId: string, paymentMethod: string) {
    return apiRequest<{ subscriptionId: string; status: string }>("/subscriptions/subscribe", {
      method: "POST",
      body: JSON.stringify({ planId, paymentMethod }),
    })
  },

  async cancelSubscription() {
    return apiRequest("/subscriptions/cancel", { method: "POST" })
  },

  async getPaymentHistory() {
    return apiRequest<{ payments: Array<{ id: string; amount: number; date: string; status: string }> }>(
      "/subscriptions/history",
    )
  },
}

// Maps API
export const mapsApi = {
  async getLocations() {
    return apiRequest<{ locations: Array<{ id: string; name: string; lat: number; lng: number }> }>("/maps/locations")
  },
}

// Dashboard API (simulated functions)
export const dashboardApi = {
  async getStats() {
    return apiRequest<{
      totalGenerations: number
      tokensUsed: number
      savedTemplates: number
      activeProjects: number
    }>("/dashboard/stats")
  },

  async getActivity() {
    return apiRequest<{ activities: Array<{ id: string; type: string; description: string; timestamp: string }> }>(
      "/dashboard/activity",
    )
  },

  async generateContent(prompt: string, type: string) {
    return apiRequest<{ content: string; tokensUsed: number }>("/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt, type }),
    })
  },
}
