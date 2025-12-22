# GitHub Copilot / AI Agent Instructions — technozlife

Purpose: Short, actionable guidance so an AI coding agent is immediately productive in this repository.

Quick start

- Install deps: prefer pnpm (repo contains `pnpm-lock.yaml`), but `npm install` works too. Run `pnpm install` or `npm install`.
- Dev: `pnpm dev` or `npm run dev` (runs `next dev`).
- Build: `pnpm build` or `npm run build` (runs `next build`).
- Lint: `npm run lint` (runs `eslint .`).

Project overview (big picture)

- Frontend: Next.js app (App Router, `app/` directory, Next 16). Uses React Server Components by default; client components must include `"use client"`.
- UI: built with shadcn patterns (`components.json` exists), Tailwind CSS (`app/globals.css`), Radix UI and Lucide icons.
- Backend: Not part of this repo. There is a detailed `backend.md` describing a Laravel backend (Sanctum, Socialite, Gorq AI, payments). The front-end communicates with the API at `lib/api.ts` (see `API_BASE`).

Key files / places to look (examples you should consult)

- `lib/api.ts` — canonical API client (fetch wrapper `apiRequest`, expected API shape: { success, message, data }, and client-side SHA-256 password hashing).
- `lib/auth-context.tsx` — token storage & auth flow (localStorage keys: `accessToken`, `refreshToken`, `tokenExpiry`). Use this when modifying auth behavior.
- `app/auth/callback/*` — OAuth callback pages; they expect provider `code` in query params and call `authApi.googleAuth` / `authApi.githubAuth`.
- `components.json` — shadcn component generator config and path aliases.
- `components/` and `components/ui/` — shared UI primitives and patterns (Toast provider, hooks, shadcn components).
- `tsconfig.json` — path alias `@/*` points to repo root.
- `next.config.mjs` — note `typescript.ignoreBuildErrors: true` (the build will ignore TypeScript errors by design).

Important repository-specific conventions

- Server vs Client components: Default files in `app/` are server components. Add `"use client"` at the top of a file to make it a client component when using hooks, local state, or browser-only APIs.
- Password hashing: The backend expects a SHA-256 hex password hash — the frontend MUST hash user passwords client-side before sending them. See `hashPassword()` in `lib/api.ts` for the canonical implementation.
- API response contract: `apiRequest` expects JSON with `success`, `message`, and `data`. Call sites check `result.success && result.data` — follow that pattern when writing new API calls.
- Token handling: Auth tokens live in `localStorage` and are attached as `Authorization: Bearer <token>` by `apiRequest`. Use `localStorage` keys above for compatibility.
- Environment / API host: `lib/api.ts` uses a hardcoded `API_BASE` (`https://api.technozlife.com`). When developing against a local backend, update this constant so calls point to your dev API.
- UI & design tokens: Tailwind + shadcn config controls component CSS; prefer adding small utility classes and using `components/ui` primitives rather than rebuilding existing UI.

Developer workflows & gotchas

- Preferred package manager: pnpm (repo contains `pnpm-lock.yaml`). If using npm, `package-lock.json` exists.
- TypeScript: Next config intentionally ignores build-time type errors (`ignoreBuildErrors: true`). Be cautious — runtime issues can still exist even when builds succeed.
- Images: `next.config.mjs` sets `images.unoptimized = true`.
- Auth flows: OAuth browser flow redirects to `/auth/callback` pages which exchange `code` for tokens using API endpoints.

When adding features or changing behavior

- Follow the existing `lib/api.{auth,contact,...}` pattern: small functions that call `apiRequest` and return typed responses.
- Reuse `ToastProvider` / `useToast` for user-facing messages; it’s an application-wide pattern for feedback.
- Add client-only interactivity behind `"use client"` and encapsulate state in providers under `app/layout.tsx` (AuthProvider, ToastProvider are already wired there).

Files you should NOT modify without caution

- `next.config.mjs` — changing `typescript.ignoreBuildErrors` changes the CI/build behavior.
- Read the bacnkend API docs always to connect with the endpoints and update api.ts.
- Backend doc is name 'Backend.md' in the root directory.

Where to find more information

If you need more context

- Read `Backend.md` for backend behavior (auth, endpoints, password-hash requirement, OAuth flows, payments, Gorq AI details).
- Consult `components.json` and the `components/ui` folder for shadcn component conventions.

Refer to the backend.md and existing code for detailed behavior of auth flows, API calls and examples of backend api usage.

If anything here is unclear or you want additional details (e.g., preferred local environment variables, CI steps, or deploy targets), tell me which areas you want expanded and I’ll refine the instructions. Feedback requested: Are the sections and examples helpful and is there any missing detail I should add?
