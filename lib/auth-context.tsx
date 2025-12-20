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
import { authApi, type UserProfile, type AuthTokens } from "./api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    email: string,
    password: string,
    name: string,
    recaptchaToken?: string
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

function saveTokens(tokens: AuthTokens) {
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  localStorage.setItem(
    "tokenExpiry",
    String(Date.now() + tokens.expiresIn * 1000)
  );
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
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return false;
    setIsRefreshing(true);

    try {
      const result = await authApi.refreshToken(refreshToken);
      if (result.success && result.data) {
        saveTokens(result.data);
        // re-fetch profile
        const profile = await authApi.getProfile();
        if (profile.success && profile.data) setUser(profile.data);
        scheduleProactiveRefresh();
        setIsRefreshing(false);
        return true;
      }
    } catch (e) {
      // ignore
    }

    // refresh failed
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

    const result = await authApi.getProfile();
    if (result.success && result.data) {
      setUser(result.data);
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
    const result = await authApi.login(email, password);
    setIsAuthenticating(false);
    if (result.success && result.data) {
      saveTokens(result.data.tokens);
      setUser(result.data.user);
      scheduleProactiveRefresh();
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
    email: string,
    password: string,
    name: string,
    recaptchaToken?: string
  ) => {
    setIsAuthenticating(true);
    const result = await authApi.register(
      email,
      password,
      name,
      recaptchaToken
    );
    setIsAuthenticating(false);
    if (result.success && result.data) {
      saveTokens(result.data.tokens);
      setUser(result.data.user);
      scheduleProactiveRefresh();
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
    const result = await authApi.googleAuth(token);
    setIsAuthenticating(false);
    if (result.success && result.data) {
      saveTokens(result.data.tokens);
      setUser(result.data.user);
      scheduleProactiveRefresh();
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
    const result = await authApi.githubAuth(code);
    setIsAuthenticating(false);
    if (result.success && result.data) {
      saveTokens(result.data.tokens);
      setUser(result.data.user);
      scheduleProactiveRefresh();
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
      await authApi.logout();
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
