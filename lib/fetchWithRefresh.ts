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

  // 401 received: API does not document a `/auth/refresh` endpoint, so avoid
  // calling an undocumented refresh route. Clear tokens and return the 401
  // response so the app can prompt for re-authentication.
  clearTokens();
  console.warn(
    "Received 401 and no documented refresh endpoint is available. Cleared tokens."
  );
  return res;
}
