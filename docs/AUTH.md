# Authentication Integration Notes

This project now uses a configurable API base and improved client-side auth flows.

Key env vars:

- `NEXT_PUBLIC_API_BASE` — base URL for backend API (default: `https://api.technozlife.com`).
- `NEXT_PUBLIC_USE_COOKIE_AUTH` — feature flag to enable cookie-based refresh flow when backend supports it.

Changes implemented:

- `lib/api.ts` now exports `API_BASE` and adds `verifyEmail`/`resendVerification` helpers.
- `lib/fetchWithRefresh.ts` added (helper to attach auth header, attempt refresh on 401, and retry the request).
- `lib/auth-context.tsx` enhanced with proactive refresh, isAuthenticating/isRefreshing flags, toast feedback, and redirect on session expiry.
- `app/auth/complete/page.tsx` and `app/auth/verify/page.tsx` implemented to handle OAuth/verification flows.
- `components/auth/RequireAuth.tsx` added to protect pages.
- `components/cookie-consent.tsx` added and included in `app/layout.tsx`.

Notes:

- Tests are planned but not added in this change (Jest unit tests and Playwright e2e planned in follow-up).
- Confirm with backend if cookie-based refresh is supported (recommended). If so, enable `NEXT_PUBLIC_USE_COOKIE_AUTH` and adjust server-side cookie settings.
