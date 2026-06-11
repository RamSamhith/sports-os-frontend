# SportsOS — Integration Guide

## 1. Frontend Architecture Overview

**Framework:** Next.js 14 (App Router) · TypeScript strict mode · Tailwind CSS

### App Structure

```
app/
├── (public)/       # Guest routes — no login required
├── (auth)/         # Register, login, OTP, onboarding wizard
├── (private)/      # Profile, settings, children management
└── (admin)/        # Admin dashboard (feature-gated by NEXT_PUBLIC_ENABLE_ADMIN)
```

### Component Architecture

- **Page-level components** can be server components; **all interactive components** are `'use client'`
- Radix UI primitives wrapped in `components/ui/`
- Context providers in `components/providers/` wrap the app at the root layout level
- Custom hooks in `lib/hooks/` encapsulate all stateful logic

### Key Patterns

| Pattern | Location |
|---------|----------|
| Context providers | `components/providers/*-provider.tsx` |
| Custom hooks | `lib/hooks/use-*.ts` |
| API client | `lib/api/client.ts` |
| Mock data | `data/academies.ts`, `data/coaches.ts`, `data/sports.ts` |
| Type definitions | `types/domain/*.ts` |
| Constants | `lib/constants/*.ts` |

---

## 2. Current State: Fully Client-Side

The application runs entirely in the browser with:

- **Mock data** in `data/` directory — 12 academies, 8 coaches, 20 sports (all Bengaluru-based)
- **localStorage** for all persistence — no database, no server
- **Client-side matching algorithm** in `lib/utils/matching.ts` — Haversine distance, multi-factor scoring
- **Client-side filtering and search** — no full-text search backend

### What does NOT exist yet:

- No backend server
- No database
- No API integration
- No real authentication (JWT, sessions)
- No enquiry persistence (in-memory toast only)

---

## 3. API Layer

The API scaffold lives in `lib/api/` and is ready for backend connection.

### HTTP Client (`lib/api/client.ts`)

```typescript
// Base URL from env
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

// Generic request function
async function request<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>>

// Convenience wrappers
export function get<T>(path, params?)    → GET /path?key=value
export function post<T>(path, body?)     → POST /path with JSON body
export function patch<T>(path, body?)    → PATCH /path with JSON body
export function del<T>(path)             → DELETE /path
```

### Response Format

```typescript
// Success
{ ok: true, data: T }

// Error
{ ok: false, error: { code: string, message: string, details?: Record<string, unknown> } }
```

### Lazy Imports

All API modules use **dynamic imports** for the client:

```typescript
export async function getAcademies(params) {
  const { get } = await import('./client');
  return get<ListResponse<Academy>>('/academies', query);
}
```

This ensures tree-shaking works and the `NEXT_PUBLIC_API_URL` env var is only referenced in code-split chunks.

### API Modules

| Module | Endpoints |
|--------|-----------|
| `lib/api/auth.ts` | `register`, `login`, `sendOtp`, `verifyOtp`, `logout`, `getMe` |
| `lib/api/users.ts` | `getMe`, `updateMe` |
| `lib/api/children.ts` | `getChildren`, `createChild`, `updateChild`, `deleteChild` |
| `lib/api/academies.ts` | `getAcademies`, `getAcademy`, `getAcademySuggestions` |
| `lib/api/coaches.ts` | `getCoaches`, `getCoach` |
| `lib/api/favorites.ts` | `getFavorites`, `addFavorite`, `removeFavorite` |
| `lib/api/enquiries.ts` | `getEnquiries`, `createEnquiry` |
| `lib/api/recommendations.ts` | `getAcademyRecommendations`, `getCoachRecommendations` |

---

## 4. How To Connect

### Step 1: Set Environment Variable

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.sportsos.example.com/v1
```

The client reads this at runtime in `lib/api/client.ts:29`:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
```

When `NEXT_PUBLIC_API_URL` is empty or undefined, all calls go to `fetch('undefined/academies')` which will fail gracefully — the API layer catches network errors and returns `{ ok: false, error: { code: 'NETWORK_ERROR', ... } }`.

### Step 2: Implement Endpoint Handlers

Each API module (`lib/api/*.ts`) already has typed request/response interfaces. Backend must match these shapes.

### Step 3: Migrate Module By Module

Replace localStorage reads with API calls in each hook/provider. See §7 (Migration Path).

---

## 5. Auth Flow

The frontend currently **simulates** auth with localStorage. The expected real behavior:

### Current (Client-Only) Flow

```
Register → OTP Method → OTP Verify → Role → Onboarding → Home
  ↑                          ↓
  └── sessionStorage draft ──┘
```

### Expected Backend Flow

```
POST /auth/register    → { user, token }        → store token in memory/localStorage
POST /auth/login       → { user, token }        → store token in memory/localStorage
POST /auth/send-otp    → { expiresAt, cooldown } → sessionStorage for OTP flow
POST /auth/verify-otp  → { verified, token? }   → if signup, store token
POST /auth/logout      → invalidate session     → clear token
GET  /auth/me          → user object            → validate token on page load
```

### Token Management (NOT YET IMPLEMENTED)

The frontend needs the following added to the AuthProvider:

1. **Token storage**: Store JWT in memory (variable) + optionally in `sessionStorage` (not localStorage, for security)
2. **Authorization header**: Intercept all `fetch` calls to inject `Authorization: Bearer <token>`
3. **Token refresh**: Handle 401 responses by attempting refresh; redirect to `/login` on failure
4. **AuthProvider hydration**: On mount, if a token exists, call `GET /auth/me` to validate and hydrate user data

**Implementation location:** `lib/api/client.ts` — add an auth interceptor or pass token via request options. The AuthProvider should set a token that the client reads.

---

## 6. Error Handling

All API calls return `ApiResponse<T>`:

```typescript
type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; details?: Record<string, unknown> } };
```

### Standard Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `NETWORK_ERROR` | — | Fetch failed (no internet, CORS, DNS) |
| `VALIDATION_ERROR` | 400 | Request body/params failed validation |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Missing/expired/invalid token |
| `FORBIDDEN` | 403 | Authenticated but not permitted |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

### Frontend Pattern

```typescript
const result = await api.someFunction();
if (!result.ok) {
  switch (result.error.code) {
    case 'VALIDATION_ERROR':
      // Show field-level errors from result.error.details
      break;
    case 'UNAUTHORIZED':
      // Redirect to login
      break;
    default:
      // Show generic toast
      toast.error(result.error.message);
  }
}
```

---

## 7. Migration Path: Mock Data → API Calls

Migrate module by module in this order:

| Phase | Module | Current Source | Replace With |
|-------|--------|---------------|--------------|
| 1 | **Academies** | `data/academies.ts` | `GET /academies`, `GET /academies/:slug` |
| 2 | **Coaches** | `data/coaches.ts` | `GET /coaches`, `GET /coaches/:slug` |
| 3 | **Sports** | `data/sports.ts` | `GET /search/suggest` (or dedicated sports endpoint) |
| 4 | **Auth** | localStorage mock | All 6 auth endpoints |
| 5 | **Children** | `use-children.ts` (localStorage) | All 4 children endpoints |
| 6 | **Profile** | `use-auth.ts` + `sportsos:profile` | `GET/PATCH /users/me` |
| 7 | **Shortlist** | `sportsos:shortlist` | All 3 favorites endpoints |
| 8 | **Enquiries** | Toast only (no storage) | `POST /enquiries`, `GET /enquiries` |
| 9 | **Recently Viewed** | `sportsos:recently-viewed` | `POST /recently-viewed` |
| 10 | **Recommendations** | Client-side matching algorithm | `GET /recommendations/academies`, `GET /recommendations/coaches` |
| 11 | **Search** | Client-side filtering | `GET /search/suggest` |
| 12 | **Location/Radius** | `sportsos:location`, `sportsos:location-radius` | `PATCH /users/me` → preferences |
| 13 | **Settings/Consent** | localStorage | `PATCH /users/me` → consent |

### Migration Pattern

Each hook/provider should be updated to:
1. On mount: try API call; if it fails (network error), fall back to localStorage
2. On write: call API; if it succeeds, update local state; if it fails, write to localStorage as offline queue
3. Remove mock data dependency from data directory

---

## 8. Testing Strategy

### Current Test Capabilities

- `pnpm typecheck` — TypeScript strict mode checks
- `pnpm lint` — ESLint with `next/core-web-vitals`
- No unit/E2E test framework configured yet

### Recommended Approach

| Type | Tool | What To Test |
|------|------|-------------|
| Type Checking | `tsc --noEmit` | Already in place |
| Unit Tests | Vitest | API client, hooks, matching algorithm, validators |
| Component Tests | React Testing Library | UI components with mocked API responses |
| E2E | Playwright | Full user flows (register → search → enquire) |
| API Contract | Zod schemas | Validate API responses match expected types |

### Existing Validation Infrastructure

- Zod is available (`zod@3.23.8`) for runtime validation
- `lib/utils/validators.ts` — validation utilities
- `lib/utils/cn.ts` — classname utility
- The `readStorage` function in `lib/storage.ts` already validates JSON schemas on read

---

## 9. localStorage Keys (23 Keys)

| # | Key | Source Location | Data Shape |
|---|-----|----------------|------------|
| 1 | `sportsos:auth-state` | `auth-provider.tsx:6` | `{ isAuthenticated: boolean, role: 'athlete'\|'parent'\|null, onboardingCompleted: boolean, verified: boolean }` |
| 2 | `sportsos:profile` | `auth-provider.tsx:7` | `{ name: string, email: string, phone: string }` |
| 3 | `sportsos:children` | `use-children.ts:15` | `Child[]` |
| 4 | `sportsos:active-child` | `use-children.ts:16` | `string` (child ID) |
| 5 | `sportsos:compare` | `compare-provider.tsx:17` | Versioned envelope `{ version: string, items: PersistedItem[] }` |
| 6 | `sportsos:shortlist` | `shortlist-provider.tsx:12` | Versioned envelope `{ version: string, items: PersistedItem[] }` |
| 7 | `sportsos:onboarding` | `use-onboarding.ts:15` | `{ completed: boolean, data: OnboardingData }` |
| 8 | `sportsos:recently-viewed` | `use-recently-viewed.ts:13` | `RecentlyViewedItem[]` (max 10) |
| 9 | `sportsos:location` | `location-provider.tsx:8` | `LocationSummary` |
| 10 | `sportsos:location-radius` | `location-provider.tsx:9` | `string` (number: 5\|10\|15\|25) |
| 11 | `sportsos:academy-status` | `use-academy-status.ts:12` | `Record<string, { status: 'interested'\|'shortlisted'\|'selected', updatedAt: string }>` |
| 12 | `sportsos:selected-academy` | `use-academy-selection.ts:8` | `{ selectedAcademyId: string\|null, selectedAt: string\|null }` |
| 13 | `sportsos:settings` | `profile/settings/page.tsx:10` | `{ analytics: boolean, marketing: boolean, whatsapp: boolean }` |
| 14 | `sportsos:preferences` | `profile/preferences/page.tsx:23` | `{ city: string, radius: number, sports: string[], skillLevel: string, goals: string }` |
| 15 | `sportsos:notifications` | `settings/notifications/page.tsx:7` | `{ emailNotifications: boolean, marketingUpdates: boolean, whatsappNotifications: boolean }` |
| 16 | `sportsos:privacy` | `settings/privacy/page.tsx:7` | `{ profileVisibility: boolean, analyticsConsent: boolean, personalizedRecommendations: boolean }` |
| 17 | `sportsos:motion` | `settings/motion/page.tsx:7` | `{ reducedMotion: boolean }` |
| 18 | `sportsos:recent-searches` | `recent-searches-store.ts:5` | `RecentQuery[]` (max 6) |
| 19 | `sportsos:build-version` | `lib/version.ts:28` | `string` (current build hash) |
| 20 | `sportsos-consent` | `use-consent.ts:12` | `{ analytics: boolean, marketing: boolean, whatsapp: boolean }` |
| 21 | `sportsos-theme` | `config/theme.ts:72` | `string` (theme name) |
| 22 | `sportsos:auth` (legacy) | `auth-provider.tsx` | `string` (`'true'`) — migrated to auth-state on first load |
| 23 | `sportsos:onboarding-role` (legacy) | `auth-provider.tsx` | `string` (`'athlete'`\|`'parent'`) — migrated to auth-state on first load |

### Legacy Key Cleanup

Abandoned keys are cleaned up on every page load in `lib/version.ts`:

```typescript
const ABANDONED_KEYS = ['sportsos:auth', 'sportsos:onboarding-role'];
```

The AuthProvider also migrates these on first hydration:
```typescript
localStorage.removeItem('sportsos:auth');
localStorage.removeItem('sportsos:onboarding-role');
```

---

## 10. sessionStorage Keys (6 Keys)

| # | Key | Storage | Source | Purpose |
|---|-----|---------|--------|---------|
| 1 | `sportsos:signup-draft` | session | `app/(auth)/register/page.tsx` | Preserves registration form data for "Edit" back-navigation |
| 2 | `sportsos:otp-method` | session | `app/(auth)/verify/method/page.tsx` | Selected OTP delivery channel (`'email'`\|`'sms'`\|`'whatsapp'`) |
| 3 | `sportsos:otp-destination` | session | `app/(auth)/verify/method/page.tsx` | Email/phone number for OTP delivery |
| 4 | `sportsos:editing-contact` | session | `app/(auth)/register/page.tsx` | Flag (`'true'`) — marks "Edit phone/email" flow |
| 5 | `sportsos:auth-modal-dismissed` | session | `components/auth/homepage-auth-modal.tsx` | Flag (`'1'`) — prevents auth modal re-appearance during session |
| 6 | `sportsos:event-queue` | session | `lib/analytics/client.ts` | `QueuedEvent[]` — analytics buffer flushed every 15s to analytics endpoint |

> **Note:** Session storage keys should **NOT** be migrated to the backend — they are ephemeral UI state.

---

## 11. Environment Variables

| Variable | Required | Default | Used In |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | No (for API) | `''` | `lib/api/client.ts` — API base URL |
| `NEXT_PUBLIC_SITE_URL` | No | `http://localhost:3000` | SEO, sitemap, Open Graph |
| `NEXT_PUBLIC_SITE_NAME` | No | `SportsOS` | Metadata |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | No | `false` | Analytics feature flag |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | No | `''` | Analytics ingestion URL |
| `NEXT_PUBLIC_ENABLE_ADMIN` | No | `false` | Admin dashboard gating |
| `NEXT_PUBLIC_ENABLE_AI` | No | `false` | AI features flag |
| `NEXT_PUBLIC_APP_VERSION` | Build-time | `0.0.0` | Set by `next.config.mjs` |
| `NEXT_PUBLIC_BUILD_HASH` | Build-time | `local` | Set by `next.config.mjs` |

---

## 12. Cross-Tab Synchronization

The app uses `BroadcastChannel`-style sync via `window.addEventListener('storage', ...)` for keys that need cross-tab consistency:

| Key | Sync Mechanism | Hook |
|-----|---------------|------|
| `sportsos:children` | `storage` event | `useStorageSync(CHILDREN_KEY, handler)` |
| `sportsos:onboarding` | `storage` event | `useStorageSync(STORAGE_KEY, handler)` |
| `sportsos:compare` | `storage` event | `useStorageSync(STORAGE_KEY, applyFromRaw)` |
| `sportsos:shortlist` | `storage` event | `useStorageSync(STORAGE_KEY, applyFromRaw)` |

---

## 13. Build Versioning

The app includes a **version staleness check** in `lib/version.ts`:

- On every page load, the current `APP_VERSION-BUILD_HASH` is compared against `sportsos:build-version`
- If the stored version differs from the current deployment, the page forces a **hard reload** to clear stale JS/CSS
- The `BUILD_HASH` is a unique SHA-256 hash generated once per `next build` via `next.config.mjs`

This means versioned localStorage envelopes (`compare`, `shortlist`) also check `BUILD_HASH` and clear themselves on deployment mismatch.
