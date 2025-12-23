"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  authApi,
  userApi,
  plansApi,
  API_BASE,
  type UserProfile,
  type AuthData,
  type SubscriptionPlan,
} from "@/lib/api";
import { getAllPlans, type Plan } from "@/lib/plans";

// Helper function to ensure user has a plan assigned
async function ensureUserHasPlan(user: UserProfile): Promise<UserProfile> {
  // If user already has a current plan, return as is
  if (user.current_plan) {
    return user;
  }

  try {
    // Check if there are any plans in the database
    const plansResponse = await plansApi.getPlans();

    let plans: SubscriptionPlan[] = [];
    if (plansResponse.success && plansResponse.data?.plans) {
      plans = plansResponse.data.plans;
    }

    // If no plans exist in database, create them from lib/plans.ts
    if (plans.length === 0) {
      const localPlans = getAllPlans();

      // Create plans in the database
      for (const localPlan of localPlans) {
        try {
          const createResponse = await plansApi.createPlan({
            name: localPlan.name,
            slug: localPlan.slug,
            description: localPlan.description,
            price: parseFloat(localPlan.price.replace("$", "")) || 0,
            currency: "USD",
            // Backend expects interval strings like "monthly" or "yearly"
            interval: (localPlan.period || "").includes("month")
              ? "monthly"
              : "yearly",
            trial_days: localPlan.id === "free" ? 0 : 7,
            features: localPlan.features,
            is_active: true,
          });

          if (createResponse.success && createResponse.data) {
            plans.push(createResponse.data);
          }
        } catch (error) {
          console.error(`Failed to create plan ${localPlan.name}:`, error);
        }
      }
    }

    // Assign the first plan (free plan) to the user
    if (plans.length > 0) {
      const freePlan = plans.find((p) => p.slug === "free") || plans[0];

      // Update user profile with the plan
      const updateResponse = await userApi.updateProfile({
        current_plan: freePlan.slug,
      });

      if (updateResponse.success && updateResponse.data) {
        return { ...user, current_plan: freePlan.slug };
      }
    }
  } catch (error) {
    console.error("Failed to ensure user has plan:", error);
  }

  // Return original user if plan assignment failed
  return user;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    recaptchaToken?: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    recaptchaToken?: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  googleLogin: (
    code?: string,
    credential?: string
  ) => Promise<{ success: boolean; message?: string }>;
  githubLogin: (
    code?: string,
    accessToken?: string
  ) => Promise<{ success: boolean; message?: string }>;
  // Refresh user profile from the API (useful after token-only redirects)
  refreshUser: () => Promise<{ success: boolean; message?: string }>;
  getGoogleRedirectUrl: () => Promise<{
    success: boolean;
    url?: string;
    message?: string;
  }>;
  getGithubRedirectUrl: () => Promise<{
    success: boolean;
    url?: string;
    message?: string;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing token and load user on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await userApi.getProfile();
          if (response.success && response.data?.user) {
            // Ensure user has a plan assigned
            const userWithPlan = await ensureUserHasPlan(response.data.user);
            setUser(userWithPlan);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("tokenExpiry");
          }
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenExpiry");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    recaptchaToken?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      // authApi.login signature is (email, password, turnstile_token?, recaptcha_token?)
      // pass `undefined` for the turnstile token so `recaptchaToken` maps to the
      // `recaptcha_token` parameter on the API.
      const response = await authApi.login(
        email,
        password,
        undefined,
        recaptchaToken
      );
      if (response.success && response.data) {
        const { user: userData, token } = response.data;

        // Store tokens
        localStorage.setItem("accessToken", token);

        // Ensure user has a plan assigned
        const userWithPlan = await ensureUserHasPlan(userData);

        setUser(userWithPlan);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const register = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    recaptchaToken?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.register({
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        recaptcha_token: recaptchaToken,
      });

      if (response.success && response.data) {
        const { user: userData, token } = response.data;

        // Store tokens
        localStorage.setItem("accessToken", token);

        // Ensure user has a plan assigned
        const userWithPlan = await ensureUserHasPlan(userData);

        setUser(userWithPlan);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error("Logout error:", error);
    } finally {
      // Clear local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiry");

      // Clear user state
      setUser(null);

      // Redirect to auth page
      router.push("/auth");
    }
  };

  const googleLogin = async (
    code?: string,
    credential?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.googleCallback(code, credential);
      if (response.success && response.data) {
        const { user: userData, token } = response.data;

        // Store token
        localStorage.setItem("accessToken", token);

        // Ensure user has a plan assigned
        const userWithPlan = await ensureUserHasPlan(userData);

        setUser(userWithPlan);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Google login failed",
      };
    }
  };

  const githubLogin = async (
    code?: string,
    accessToken?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.githubCallback(code, accessToken);
      if (response.success && response.data) {
        const { user: userData, token } = response.data;

        // Store token
        localStorage.setItem("accessToken", token);

        // Ensure user has a plan assigned
        const userWithPlan = await ensureUserHasPlan(userData);

        setUser(userWithPlan);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "GitHub login failed",
      };
    }
  };

  const getGoogleRedirectUrl = async (): Promise<{
    success: boolean;
    url?: string;
    message?: string;
  }> => {
    try {
      const response = await authApi.getGoogleRedirect();
      if (response.success && response.data?.url) {
        return { success: true, url: response.data.url };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get Google redirect URL",
      };
    }
  };

  const getGithubRedirectUrl = async (): Promise<{
    success: boolean;
    url?: string;
    message?: string;
  }> => {
    try {
      const response = await authApi.getGithubRedirect();
      if (response.success && response.data?.url) {
        return { success: true, url: response.data.url };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get GitHub redirect URL",
      };
    }
  };

  const refreshUser = async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;

      if (!token) {
        // No token available
        console.warn("refreshUser: no accessToken present in localStorage");
        return {
          success: false,
          message: `No token available (API_BASE=${API_BASE})`,
        };
      }

      // Try direct fetch to the API to verify token and get profile
      try {
        const url = `${API_BASE}/user`;
        console.debug("refreshUser: attempting direct fetch to", url);
        console.debug(
          "refreshUser: token preview",
          token.slice(0, 8),
          "…",
          token.slice(-8)
        );
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        // Debug where the request actually went (origin detection)
        if (typeof window !== "undefined") {
          try {
            const actualOrigin = new URL(res.url, window.location.href).origin;
            const siteOrigin = window.location.origin;
            if (actualOrigin === siteOrigin) {
              console.warn(
                "refreshUser: request was sent to the same origin. Confirm NEXT_PUBLIC_API_BASE configuration (current value=",
                API_BASE,
                ")"
              );
            } else {
              console.debug(
                "refreshUser: request sent to origin",
                actualOrigin
              );
            }
          } catch (e) {
            console.debug(
              "refreshUser: could not determine response URL origin",
              e
            );
          }
        }

        if (res.ok) {
          const body = await res.json().catch(() => null);

          // Support both wrapped ApiResponse and direct user object
          const maybeUser = body?.data?.user || body?.user || body;

          if (maybeUser && typeof maybeUser === "object") {
            const userWithPlan = await ensureUserHasPlan(
              maybeUser as UserProfile
            );
            setUser(userWithPlan);
            return { success: true };
          }

          console.warn("refreshUser: unexpected /user response format", body);
        } else {
          const text = await res.text().catch(() => "(no body)");
          console.warn(`refreshUser: /user responded ${res.status}`, text);

          // Try cookie-based auth if token header failed (some backends use API cookies)
          try {
            console.debug(
              "refreshUser: trying cookie-based /user fetch with credentials: 'include'"
            );
            const rc = await fetch(url, {
              credentials: "include",
              headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
              },
            });
            if (rc.ok) {
              const bodyc = await rc.json().catch(() => null);
              const maybeUserC = bodyc?.data?.user || bodyc?.user || bodyc;
              if (maybeUserC && typeof maybeUserC === "object") {
                const userWithPlan = await ensureUserHasPlan(
                  maybeUserC as UserProfile
                );
                setUser(userWithPlan);
                return { success: true };
              }
            } else {
              const textc = await rc.text().catch(() => "(no body)");
              console.warn(
                `refreshUser: cookie-based /user responded ${rc.status}`,
                textc
              );
            }
          } catch (cookieErr) {
            console.warn(
              "refreshUser: cookie-based /user fetch failed",
              cookieErr
            );
          }

          return {
            success: false,
            message: `User endpoint returned ${res.status}: ${text}`,
          };
        }
      } catch (err) {
        console.warn("refreshUser: direct /user fetch failed", err);
      }

      // Fallback to existing API helper
      try {
        const response = await userApi.getProfile();
        if (response.success && response.data?.user) {
          const userWithPlan = await ensureUserHasPlan(response.data.user);
          setUser(userWithPlan);
          return { success: true };
        }
      } catch (error) {
        console.error("refreshUser: userApi.getProfile failed", error);
      }

      return { success: false, message: "Unable to fetch profile" };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Refresh failed",
      };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    googleLogin,
    githubLogin,
    refreshUser,
    getGoogleRedirectUrl,
    getGithubRedirectUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
