# SportsOS Frontend Data Source Report

> Generated: 2026-06-12
> Frontend: Next.js 14.2.18 (App Router)

---

## 1. Executive Summary

**The frontend runs entirely on static/mock data.** The API client layer is fully built but **not connected to any page components.** Auth is placeholder (setTimeout). All persistent state lives in localStorage. No backend calls are made in production.

---

## 2. Data Source Classification

### 2.1 Static Data (ACTIVE — Used by Pages)

| Data | Source File | Used By | Records |
|------|-----------|---------|---------|
| Academies | `data/academies.ts` | Academy listing, detail pages, homepage | 12 academies |
| Coaches | `data/coaches.ts` | Coach listing, detail pages, homepage | 8 coaches |
| Sports | `data/sports.ts` | Sports listing, detail pages | 20 sports |
| Competitions | `data/competitions.ts` | Sport detail pages (pathway) | 60+ competitions |

**Evidence:**
- `app/(public)/academies/[slug]/page.tsx` imports from `@/data/academies`
- `app/(public)/coaches/[slug]/page.tsx` imports from `@/data/coaches`
- `app/(public)/sports/[slug]/page.tsx` imports from `@/data/sports`
- `generateStaticParams()` uses `data/academies.map(a => ({ slug: a.slug }))`
- Listing pages (`academy-listing.tsx`, `coaches-listing.tsx`, `sports-listing.tsx`) receive props from page components that load static data

### 2.2 localStorage (ACTIVE — Client-Side State)

| Key | Purpose | Hook |
|-----|---------|------|
| `sportsos:auth-state` | Auth state (isAuthenticated, role, verified, onboarding) | useAuth |
| `sportsos:auth-token` | JWT token | useAuth |
| `sportsos:profile` | User profile data | useAuth |
| `sportsos:onboarding` | Onboarding wizard state | useOnboarding |
| `sportsos:children` | Children array | useChildren |
| `sportsos:active-child` | Active child ID | useChildren |
| `sportsos:shortlist` | Shortlisted items array | useShortlist |
| `sportsos:compare` | Compare items array (max 2) | useCompare |
| `sportsos:recently-viewed` | Recently viewed items | useRecentlyViewed |
| `sportsos:selected-academy` | User's selected academy | useAcademySelection |
| `sportsos:academy-status` | Academy interest/shortlist/selected status | useAcademyStatus |
| `sportsos:location` | GPS coordinates + city/state | useLocation |
| `sportsos:recent-searches` | Search history | useSearchQuery |
| `sportsos-consent` | Analytics/marketing/whatsapp consent | useConsent |
| `sportsos-theme` | Theme preference | useThemeSafe |
| `sportsos:build-version` | Build version for auto-refresh | version.ts |

**Cross-tab sync:** `useStorageSync` hook listens to `storage` events for multi-tab consistency.

### 2.3 API Client (BUILT — Not Connected)

The `lib/api/` directory contains a complete, production-ready API client:

| Module | File | Endpoints Defined | Used by Pages? |
|--------|------|-------------------|---------------|
| Auth | `lib/api/auth.ts` | 6 endpoints | ❌ No |
| Users | `lib/api/users.ts` | 2 endpoints | ❌ No |
| Children | `lib/api/children.ts` | 4 endpoints | ❌ No |
| Academies | `lib/api/academies.ts` | 3 endpoints | ❌ No |
| Coaches | `lib/api/coaches.ts` | 2 endpoints | ❌ No |
| Sports | `lib/api/sports.ts` | 2 endpoints | ❌ No |
| Favorites | `lib/api/favorites.ts` | 3 endpoints | ❌ No |
| Enquiries | `lib/api/enquiries.ts` | 2 endpoints | ❌ No |
| Recommendations | `lib/api/recommendations.ts` | 2 endpoints | ❌ No |

**Total: 26 API endpoints defined, 0 used by pages.**

### 2.4 API Client Configuration

```typescript
// lib/api/client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
```

- **Default:** Empty string (same-origin calls)
- **Auth token:** Read from `localStorage.getItem('sportsos:auth-token')`
- **Header:** `Authorization: Bearer <token>`
- **Error handling:** Returns `{ok: false, error: {code, message}}` on failure
- **Network errors:** Caught and returned as `{ok: false, error: {code: 'NETWORK_ERROR'}}`

### 2.5 External API Calls

| Location | URL | Purpose |
|----------|-----|---------|
| `components/ui/location-picker.tsx` | External geocoding API | Manual location input → address lookup |
| Browser Geolocation API | `navigator.geolocation.getCurrentPosition()` | GPS coordinates |

### 2.6 Analytics (Consent-Gated, Placeholder)

```
lib/analytics/client.ts → POST /api/events → app/api/events/route.ts → { ok: true }
```

- Events are batched and flushed every 15 seconds
- Only fires when `analyticsEnabled=true` AND `consent.analytics=true`
- Endpoint is a no-op placeholder

---

## 3. Page-by-Page Data Source Analysis

### Public Pages

| Page | Route | Data Source | Backend Call? |
|------|-------|------------|--------------|
| Homepage | `/` | `data/academies.ts`, `data/coaches.ts`, `data/sports.ts` | ❌ |
| Academy Listing | `/academies` | `data/academies.ts` via `academy-listing.tsx` | ❌ |
| Academy Detail | `/academies/[slug]` | `data/academies.ts` (SSG) | ❌ |
| Coach Listing | `/coaches` | `data/coaches.ts` via `coaches-listing.tsx` | ❌ |
| Coach Detail | `/coaches/[slug]` | `data/coaches.ts` (SSG) | ❌ |
| Sports Listing | `/sports` | `data/sports.ts` via `sports-listing.tsx` | ❌ |
| Sport Detail | `/sports/[slug]` | `data/sports.ts` (SSG) | ❌ |
| Search | `/search` | Client-side filter of static data | ❌ |
| Compare | `/compare` | CompareProvider (localStorage) | ❌ |
| Shortlist | `/shortlist` | ShortlistProvider (localStorage) | ❌ |
| Enquiry Form | `/enquiry/[type]/[id]` | Props from static data | ❌ |

### Auth Pages

| Page | Route | Data Source | Backend Call? |
|------|-------|------------|--------------|
| Login | `/login` | setTimeout placeholder | ❌ |
| Register | `/register` | setTimeout placeholder | ❌ |
| Forgot Password | `/forgot-password` | Form only | ❌ |
| OTP Verify | `/verify/*` | Form only | ❌ |
| Onboarding | `/onboarding/*` | localStorage | ❌ |

**Evidence (auth placeholder):**
```typescript
// From login page - setTimeout simulates API call
await new Promise(resolve => setTimeout(resolve, 1000));
// Sets auth state directly in localStorage
```

### Private Pages

| Page | Route | Data Source | Backend Call? |
|------|-------|------------|--------------|
| Profile | `/profile` | localStorage (auth state) | ❌ |
| Personal Info | `/profile/personal` | localStorage | ❌ |
| Children | `/profile/children` | useChildren (localStorage) | ❌ |
| Preferences | `/profile/preferences` | localStorage | ❌ |
| Saved | `/profile/saved` | localStorage | ❌ |
| Enquiries | `/profile/enquiries` | Empty array (placeholder) | ❌ |

### Admin Pages

| Page | Route | Data Source | Backend Call? |
|------|-------|------------|--------------|
| Dashboard | `/admin` | Placeholder KPI cards | ❌ |
| Academies | `/admin/academies` | Placeholder table | ❌ |
| All admin pages | `/admin/*` | Placeholder/empty state | ❌ |

---

## 4. Client-Side Matching Engine

**File:** `lib/utils/matching.ts`

A sophisticated scoring engine runs entirely in the browser:

| Factor | Weight | Description |
|--------|--------|-------------|
| Sport match | High | Exact sport match vs partial |
| Location hierarchy | Medium | City > District > State > Country |
| Distance | Medium | Haversine formula (km) |
| Age suitability | Medium | Academy age range vs child age |
| Skill level | Low | Training level match |
| Rating | Low | avgRating bonus |

**Used for:** "Suggested Academies" and "Suggested Coaches" on homepage. Runs on static data only.

---

## 5. Data Flow Summary

```
┌──────────────────────────────────────────────────────────────┐
│                    CURRENT DATA FLOW                          │
│                                                               │
│  data/academies.ts ──┐                                       │
│  data/coaches.ts  ───┼──→ Page Components ──→ Static Render  │
│  data/sports.ts   ───┤                                       │
│  data/competitions.ts┘                                       │
│                                                               │
│  localStorage ──────→ Providers ──→ Hooks ──→ Components     │
│  (auth, shortlist,   (context)    (useAuth,  (UI state)      │
│   compare, children)              useShortlist)               │
│                                                               │
│  matching.ts ───────→ Score Engine ──→ Suggested Items       │
│  (static data)       (client-side)    (homepage)             │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   INTENDED DATA FLOW                          │
│                                                               │
│  Page Components ──→ lib/api/*.ts ──→ fetch() ──→ Backend    │
│  (hooks, actions)    (API client)    (with auth)   (Express)  │
│                                              │                │
│                                              ▼                │
│                                         MongoDB              │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Configuration Evidence

### .env.example (no API URL defined)
```
NEXT_PUBLIC_SITE_URL=https://sportsos.example.com
NEXT_PUBLIC_SITE_NAME=SportsOS
NEXT_PUBLIC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_ANALYTICS_ENDPOINT=
NEXT_PUBLIC_ENABLE_ADMIN=false
NEXT_PUBLIC_ENABLE_AI=false
```

**`NEXT_PUBLIC_API_URL` is NOT in .env.example** — it's only referenced in code with a default of empty string.

### docs/INTEGRATION_GUIDE.md
```
NEXT_PUBLIC_API_URL=https://api.sportsos.example.com/v1
```
This is documentation only — not configured in any actual .env file.

---

## 7. Conclusion

| Aspect | Status |
|--------|--------|
| Static data usage | ✅ Active — all pages render from data/ files |
| localStorage usage | ✅ Active — auth, shortlist, compare, children, settings |
| API client ready | ✅ Built — 26 endpoints defined in lib/api/ |
| API client connected | ❌ No — zero pages call the API client |
| Auth wired to backend | ❌ No — uses setTimeout placeholder |
| Enquiry wired to backend | ❌ No — form validation only |
| Analytics wired | ❌ No — placeholder endpoint returns {ok: true} |
| Backend running | ❌ No — deployed URL returns 503 |
