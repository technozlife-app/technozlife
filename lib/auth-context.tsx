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
import { authApi, type UserProfile } from "./api";
import { executeRecaptcha } from "./recaptcha";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Response interfaces to match API.md structures
interface AuthSuccessResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
    token: string;
  };
  code: number;
  timestamp: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
  };
  code: number;
  timestamp: string;
}

interface LogoutResponse {
  success: boolean;
  message: string;
  code: number;
  timestamp: string;
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

function setTokensFromResponse(data: any) {
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

    const result: ProfileResponse = await authApi.getProfile();
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
      // Optional
      console.warn("reCAPTCHA failed:", e);
    }
    const result: AuthSuccessResponse = await authApi.login(email, password);
    setIsAuthenticating(false);
    if (result.success && result.data) {
      setTokensFromResponse(result.data);
      setUser(result.data.user);
      scheduleProactiveRefresh();
      // ensure user has a plan (best-effort) and refresh profile if plan was assigned
      try {
        const { ensureUserHasPlan } = await import("./subscription-helper");
        const assigned = await ensureUserHasPlan(result.data.user);
        if (assigned) {
          const profile: ProfileResponse = await authApi.getProfile();
          if (profile.success && profile.data) setUser(profile.data.user);
        }
      } catch (e) {
        // ignore helper errors
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
    const result: AuthSuccessResponse = await authApi.registerFull({
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      recaptchaToken,
    });
    setIsAuthenticating(false);
    if (result.success && result.data) {
      setTokensFromResponse(result.data);
      setUser(result.data.user);
      scheduleProactiveRefresh();

      // ensure user has a plan (best-effort) and refresh profile if plan was assigned
      try {
        const { ensureUserHasPlan } = await import("./subscription-helper");
        const assigned = await ensureUserHasPlan(result.data.user);
        if (assigned) {
          const profile: ProfileResponse = await authApi.getProfile();
          if (profile.success && profile.data) setUser(profile.data.user);
        }
      } catch (e) {
        // ignore helper errors
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
    const result: AuthSuccessResponse = await authApi.googleAuth(token);
    setIsAuthenticating(false);
    if (result.success && result.data) {
      setTokensFromResponse(result.data);
      setUser(result.data.user);
      scheduleProactiveRefresh();

      // ensure user has a plan (best-effort) and refresh profile if plan was assigned
      try {
        const { ensureUserHasPlan } = await import("./subscription-helper");
        const assigned = await ensureUserHasPlan(result.data.user);
        if (assigned) {
          const profile: ProfileResponse = await authApi.getProfile();
          if (profile.success && profile.data) setUser(profile.data.user);
        }
      } catch (e) {
        // ignore helper errors
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
    const result: AuthSuccessResponse = await authApi.githubAuth(code);
    setIsAuthenticating(false);
    if (result.success && result.data) {
      setTokensFromResponse(result.data);
      setUser(result.data.user);
      scheduleProactiveRefresh();

      // ensure user has a plan (best-effort) and refresh profile if plan was assigned
      try {
        const { ensureUserHasPlan } = await import("./subscription-helper");
        const assigned = await ensureUserHasPlan(result.data.user);
        if (assigned) {
          const profile: ProfileResponse = await authApi.getProfile();
          if (profile.success && profile.data) setUser(profile.data.user);
        }
      } catch (e) {
        // ignore helper errors
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
      const result: LogoutResponse = await authApi.logout();
      // No need to check result.data as per API.md
    } catch (e) {
      // ignore server errors
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
