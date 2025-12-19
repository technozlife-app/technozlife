import { API_BASE, authApi, type AuthTokens } from "./api";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

function saveTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  localStorage.setItem(
    "tokenExpiry",
    String(Date.now() + tokens.expiresIn * 1000)
  );
}

function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenExpiry");
}

export async function fetchWithAuth(input: string, init: RequestInit = {}) {
  const url = input.startsWith("http") ? input : `${API_BASE}${input}`;

  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...init, headers });

  if (res.status !== 401) return res;

  // Try refresh
  const refreshToken = getRefreshToken();
  if (!refreshToken) return res;

  try {
    const refreshResult = await authApi.refreshToken(refreshToken);
    if (refreshResult.success && refreshResult.data) {
      saveTokens(refreshResult.data);

      // Retry original request with new token
      const newToken = refreshResult.data.accessToken;
      const retryHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...(init.headers || {}),
        Authorization: `Bearer ${newToken}`,
      };
      const retryRes = await fetch(url, { ...init, headers: retryHeaders });
      return retryRes;
    }

    // Refresh failed
    clearTokens();
    return res;
  } catch (error) {
    clearTokens();
    return res;
  }
}
