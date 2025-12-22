"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { authApi, userApi, type UserProfile, type ApiResponse } from "./api";
import { executeRecaptcha } from "./recaptcha";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Auth response type
interface AuthData {
  user: UserProfile;
  token: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  googleLogin: (
    token: string
  ) => Promise<{ success: boolean; message?: string }>;
  githubLogin: (
    code: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setTokensFromResponse(data: AuthData) {
  if (!data || typeof data.token !== "string") return;
  localStorage.setItem("accessToken", data.token);
  localStorage.removeItem("refreshToken");
  localStorage.setItem("tokenExpiry", String(Date.now() + 3600 * 1000));
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenExpiry");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleProactiveRefresh() {
    try {
      const expiry = Number(localStorage.getItem("tokenExpiry"));
      if (!expiry || isNaN(expiry)) return;
      const msUntilExpiry = expiry - Date.now();
      const refreshAt = msUntilExpiry - 60 * 1000; // 1 minute before expiry
      if (refreshAt <= 0) return;
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      refreshTimer.current = setTimeout(() => {
        tryRefresh();
      }, Math.max(refreshAt, 1000));
    } catch (e) {
      // ignore
    }
  }

  async function tryRefresh() {
    // The API does not document a `/auth/refresh` endpoint. To avoid calling
    // non-listed endpoints (which can return 404), we will NOT attempt a
    // server-side refresh. Instead, clear credentials and require the user to
    // re-authenticate.
    clearTokens();
    setUser(null);
    setIsRefreshing(false);
    toast({
      title: "Session expired",
      description: "Please sign in again.",
      action: undefined,
    });
    try {
      router.push("/auth");
    } catch (e) {
      // router may not be available in some contexts
    }
    return false;
  }

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token && refreshToken) {
      // attempt refresh
      const ok = await tryRefresh();
      setIsLoading(false);
      return;
    }

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const result: ApiResponse<{ user: UserProfile }> =
      await userApi.getProfile();
    if (result.success && result.data) {
      setUser(result.data.user);
      scheduleProactiveRefresh();
    } else {
      clearTokens();
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
        refreshTimer.current = null;
      }
    };
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    setIsAuthenticating(true);
    let recaptchaToken: string | undefined;
    try {
      recaptchaToken = await executeRecaptcha("login");
    } catch (e) {
      // Optional - continue without reCAPTCHA if it fails
      console.warn("reCAPTCHA failed:", e);
    }

    const result: ApiResponse<AuthData> = await authApi.login(
      email,
      password,
      recaptchaToken
    );
    setIsAuthenticating(false);

    if (result.success && result.data) {
      setTokensFromResponse(result.data);
      setUser(result.data.user);
      scheduleProactiveRefresh();

      // Ensure user has a plan (best-effort) and refresh profile if plan was assigned
      try {
        const { ensureUserHasPlan } = await import("./subscription-helper");
        const assigned = await ensureUserHasPlan(result.data.user);
        if (assigned) {
          const profile: ApiResponse<{ user: UserProfile }> =
            await userApi.getProfile();
          if (profile.success && profile.data) setUser(profile.data.user);
        }
      } catch (e) {
        // Ignore helper errors
      }

      toast({ title: "Signed in", description: "Welcome back!" });
      return { success: true };
    }

    toast({
      title: "Sign in failed",
      description: result.message || "Unable to sign in",
    });
    return { success: false, message: result.message };
  };

  const register = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setIsAuthenticating(true);
    let recaptchaToken: string | undefined;
    try {
      recaptchaToken = await executeRecaptcha("register");
    } catch (e) {
      // If reCAPTCHA fails, continue without it (optional)
      console.warn("reCAPTCHA failed:", e);
    }

    const result: ApiResponse<AuthData> = await authApi.register({
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      recaptcha_token: recaptchaToken,
    });

    setIsAuthenticating(false);

    if (result.success && result.data) {
      setTokensFromResponse(result.data);
      setUser(result.data.user);
      scheduleProactiveRefresh();

      // Ensure user has a plan (best-effort) and refresh profile if plan was assigned
      try {
        const { ensureUserHasPlan } = await import("./subscription-helper");
        const assigned = await ensureUserHasPlan(result.data.user);
        if (assigned) {
          const profile: ApiResponse<{ user: UserProfile }> =
            await userApi.getProfile();
          if (profile.success && profile.data) setUser(profile.data.user);
        }
      } catch (e) {
        // Ignore helper errors
      }

      toast({ title: "Account created", description: "Welcome!" });
      return { success: true };
    }

    toast({
      title: "Registration failed",
      description: result.message || "Unable to register",
    });
    return { success: false, message: result.message };
  };

  const googleLogin = async (token: string) => {
    setIsAuthenticating(true);

    // Determine if token is a JWT (credential) or authorization code
    const isJWT = token.split(".").length === 3;
    const result: ApiResponse<AuthData> = isJWT
      ? await authApi.googleCallback(undefined, token)
      : await authApi.googleCallback(token);

    setIsAuthenticating(false);

    if (result.success && result.data) {
      setTokensFromResponse(result.data);
      setUser(result.data.user);
      scheduleProactiveRefresh();

      // Ensure user has a plan (best-effort) and refresh profile if plan was assigned
      try {
        const { ensureUserHasPlan } = await import("./subscription-helper");
        const assigned = await ensureUserHasPlan(result.data.user);
        if (assigned) {
          const profile: ApiResponse<{ user: UserProfile }> =
            await userApi.getProfile();
          if (profile.success && profile.data) setUser(profile.data.user);
        }
      } catch (e) {
        // Ignore helper errors
      }

      toast({ title: "Signed in", description: "Welcome back!" });
      return { success: true };
    }

    toast({
      title: "Sign in failed",
      description: result.message || "Unable to sign in",
    });
    return { success: false, message: result.message };
  };

  const githubLogin = async (code: string) => {
    setIsAuthenticating(true);
    const result: ApiResponse<AuthData> = await authApi.githubCallback(code);
    setIsAuthenticating(false);

    if (result.success && result.data) {
      setTokensFromResponse(result.data);
      setUser(result.data.user);
      scheduleProactiveRefresh();

      // Ensure user has a plan (best-effort) and refresh profile if plan was assigned
      try {
        const { ensureUserHasPlan } = await import("./subscription-helper");
        const assigned = await ensureUserHasPlan(result.data.user);
        if (assigned) {
          const profile: ApiResponse<{ user: UserProfile }> =
            await userApi.getProfile();
          if (profile.success && profile.data) setUser(profile.data.user);
        }
      } catch (e) {
        // Ignore helper errors
      }

      toast({ title: "Signed in", description: "Welcome back!" });
      return { success: true };
    }

    toast({
      title: "Sign in failed",
      description: result.message || "Unable to sign in",
    });
    return { success: false, message: result.message };
  };

  const logout = async () => {
    try {
      const result: ApiResponse = await authApi.logout();
      // No need to check result.data as per API.md
    } catch (e) {
      // Ignore server errors
    }
    clearTokens();
    setUser(null);
    toast({ title: "Signed out", description: "You have been signed out." });
    try {
      router.push("/");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        googleLogin,
        githubLogin,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
