# MVP Data Source Audit

> **Date:** 2026-06-13
> **Scope:** Full frontend data source analysis — real API vs. static/mock data
> **Status:** Audit only — no code changes made

---

## 1. Static Data Files (Mock/Seed Data)

The `data/` directory contains **hardcoded TypeScript arrays** of seed data used across the frontend:

| File | Records | Type | Used By |
|------|---------|------|---------|
| `data/academies.ts` | 12 academies | Static `Academy[]` | compare, shortlist, command palette, stats, personalized home, profile, images |
| `data/coaches.ts` | 8 coaches | Static `Coach[]` | compare, shortlist, command palette, stats, personalized home, profile, images |
| `data/sports.ts` | 20 sports | Static `Sport[]` | sports listing, sports detail, featured sports, command palette, compare, images |
| `data/competitions.ts` | ~60 competitions | Static `Competition[]` | sports detail page |
| `data/index.ts` | Barrel export | — | — |

**Key detail:** These are NOT mock files in the traditional sense — they are **seed data with realistic structure** that matches the MongoDB models exactly. The backend (`sportsOS-nodejs/seeds/`) contains matching seed scripts.

---

## 2. API Client Layer (`lib/api/`)

The frontend has a fully built API client layer:

| File | Endpoints | Method |
|------|-----------|--------|
| `lib/api/client.ts` | Base HTTP client (`get/post/patch/del`) | `fetch()` with Bearer token from localStorage |
| `lib/api/academies.ts` | `GET /academies`, `GET /academies/by-slug/:slug` | Real API |
| `lib/api/coaches.ts` | `GET /coaches`, `GET /coaches/by-slug/:slug` | Real API |
| `lib/api/auth.ts` | `POST /auth/register`, `POST /auth/login`, `POST /auth/send-otp`, `POST /auth/verify-otp`, `POST /auth/logout`, `GET /auth/me` | Real API |
| `lib/api/enquiries.ts` | `POST /enquiries`, `GET /enquiries/me` | Real API |
| `lib/api/shortlist.ts` | `GET /shortlist/me`, `GET /shortlist/me/populated`, `POST /shortlist`, `DELETE /shortlist/:id` | Real API |
| `lib/api/favorites.ts` | `GET /favorites`, `POST /favorites`, `DELETE /favorites/:type/:id` | Real API |
| `lib/api/users.ts` | `GET /users/me`, `PATCH /users/me` | Real API |
| `lib/api/sports.ts` | `GET /sports`, `GET /sports/:slug` | Real API |
| `lib/api/children.ts` | `GET /children`, `POST /children`, `PATCH /children/:id`, `DELETE /children/:id` | Real API |
| `lib/api/recommendations.ts` | `GET /recommendations/academies`, `GET /recommendations/coaches` | Real API |

**API Base URL:** `NEXT_PUBLIC_API_URL=https://sportsos-nodejs.onrender.com` (from `.env.local`)

---

## 3. Page-by-Page Data Source Audit

### 3.1 Home Page
**File:** `app/(public)/page.tsx`

| Section | Component | Data Source | Uses API? | Uses Static? | API Endpoint |
|---------|-----------|-------------|-----------|--------------|--------------|
| Hero | `Hero` | None (pure UI) | NO | NO | — |
| Search | `SearchSection` | None (pure UI) | NO | NO | — |
| Stats | `StatsSection` | **`data/academies`, `data/coaches`, `data/sports`** | NO | **YES** | — |
| Personalized | `PersonalizedHome` | **`data/academies`, `data/coaches`** (matching algorithm) | NO | **YES** | — |
| Your Academy | `YourAcademy` | **`data/academies`** (by selectedAcademyId) | NO | **YES** | — |
| Featured Sports | `FeaturedSports` | **`data/sports`** | NO | **YES** | — |
| Featured Academies | `FeaturedAcademies` | `lib/api/academies` → `getAcademies()` | **YES** | NO | `GET /academies` |
| Featured Coaches | `FeaturedCoaches` | `lib/api/coaches` → `getCoaches()` | **YES** | NO | `GET /coaches` |

**Verdict: PARTIALLY INTEGRATED**
- Featured Academies/Coaches sections fetch from real API
- Stats, Personalized Home, Your Academy, and Featured Sports all use static `data/` imports
- The matching algorithm (`lib/utils/matching`) operates entirely on static `data/` arrays

---

### 3.2 Academies Page (List)
**File:** `app/(public)/academies/page.tsx` → `components/academies/academy-listing.tsx`

| Component | Data Source | Uses API? | Uses Static? | API Endpoint |
|-----------|-------------|-----------|--------------|--------------|
| `AcademyListing` | `lib/api/academies` → `getAcademies()` | **YES** | NO | `GET /academies` |

**Verdict: FULLY API-INTEGRATED**
- Fetches from real backend API with `pageSize: 100`
- Client-side filtering on top of API response
- Loading states, error handling, and retry all implemented

---

### 3.3 Academy Details Page
**File:** `app/(public)/academies/[slug]/page.tsx`

| Component | Data Source | Uses API? | Uses Static? | API Endpoint |
|-----------|-------------|-----------|--------------|--------------|
| Page data | `lib/api/academies` → `getAcademy(slug)` | **YES** | NO | `GET /academies/by-slug/:slug` |
| Image fallback | `lib/images` → `fixtureImages` | NO | **YES** | — |

**Verdict: FULLY API-INTEGRATED**
- Academy data fetched from real API by slug
- `fixtureImages` used only as image fallback (guaranteed local asset)
- Proper loading, error, and not-found states

---

### 3.4 Coaches Page (List)
**File:** `app/(public)/coaches/page.tsx` → `components/coaches/coaches-listing.tsx`

| Component | Data Source | Uses API? | Uses Static? | API Endpoint |
|-----------|-------------|-----------|--------------|--------------|
| `CoachesListing` | `lib/api/coaches` → `getCoaches()` | **YES** | NO | `GET /coaches` |

**Verdict: FULLY API-INTEGRATED**
- Same pattern as academies listing — fetches from real API

---

### 3.5 Coach Details Page
**File:** `app/(public)/coaches/[slug]/page.tsx`

| Component | Data Source | Uses API? | Uses Static? | API Endpoint |
|-----------|-------------|-----------|--------------|--------------|
| Page data | `lib/api/coaches` → `getCoach(slug)` | **YES** | NO | `GET /coaches/by-slug/:slug` |
| Image fallback | `lib/images` → `fixtureImages` | NO | **YES** | — |

**Verdict: FULLY API-INTEGRATED**
- Same pattern as academy details

---

### 3.6 Search Page
**File:** `app/(public)/search/page.tsx`

| Component | Data Source | Uses API? | Uses Static? | API Endpoint |
|-----------|-------------|-----------|--------------|--------------|
| `AcademyListing` | `lib/api/academies` → `getAcademies()` | **YES** | NO | `GET /academies` |
| `CoachesListing` | `lib/api/coaches` → `getCoaches()` | **YES** | NO | `GET /coaches` |
| `SportsListing` | **`data/sports`** | NO | **YES** | — |

**Verdict: PARTIALLY INTEGRATED**
- Academies and Coaches search results use real API
- Sports search results use static `data/sports` — no `GET /sports` API call here
- Note: `lib/api/sports.ts` has `listSports()` and `getSport()` endpoints but `SportsListing` does not use them

---

### 3.7 Shortlist Page
**File:** `app/(public)/shortlist/page.tsx` → `components/shortlist/shortlist-view.tsx`

| Component | Data Source | Uses API? | Uses Static? | API Endpoint |
|-----------|-------------|-----------|--------------|--------------|
| `ShortlistProvider` | localStorage (guest) + `lib/api/shortlist` (authenticated) | **YES** (auth) | **YES** (guest) | `GET /shortlist/me/populated` |
| `ShortlistView` | `data/academies`, `data/coaches` (fallback for display) | NO | **YES** | — |
| Add/Remove | `lib/api/shortlist` → `addToShortlist()`, `removeFromShortlist()` | **YES** | NO | `POST /shortlist`, `DELETE /shortlist/:id` |

**Verdict: PARTIALLY INTEGRATED**
- CRUD operations (add/remove) are fully API-integrated when authenticated
- Guest mode uses localStorage with static data fallback
- Display resolution falls back to `data/academies`/`data/coaches` when populated data unavailable
- When authenticated, API returns populated data which takes precedence

---

### 3.8 Enquiries Page
**File:** `app/(public)/enquiry/[type]/[id]/page.tsx` (enquiry form) + `app/(private)/profile/enquiries/page.tsx` (enquiry list)

| Component | Data Source | Uses API? | Uses Static? | API Endpoint |
|-----------|-------------|-----------|--------------|--------------|
| Enquiry form target | `lib/api/academies` / `lib/api/coaches` → `getAcademy(slug)` / `getCoach(slug)` | **YES** | NO | `GET /academies/by-slug/:slug` |
| Enquiry submission | `lib/api/enquiries` → `createEnquiry()` | **YES** | NO | `POST /enquiries` |
| Enquiry list | `lib/api/enquiries` → `getMyEnquiries()` | **YES** | NO | `GET /enquiries/me` |

**Verdict: FULLY API-INTEGRATED**
- Target resolution, submission, and listing all use real API

---

### 3.9 Admin Dashboard
**File:** `app/(admin)/admin/page.tsx` + sub-pages

| Page | Data Source | Uses API? | Uses Static? | API Endpoint |
|------|-------------|-----------|--------------|--------------|
| Dashboard (KPIs) | Hardcoded placeholder (`—`) | NO | **YES** (hardcoded) | — |
| Academies | Hardcoded `Row[]` array | NO | **YES** (hardcoded) | — |
| Coaches | Hardcoded `Row[]` array | NO | **YES** (hardcoded) | — |
| Enquiries | Hardcoded `Row[]` array | NO | **YES** (hardcoded) | — |
| Verification | Hardcoded `Row[]` array | NO | **YES** (hardcoded) | — |
| Sports | Hardcoded `Row[]` array | NO | **YES** (hardcoded) | — |
| Users | Placeholder text | NO | **YES** (placeholder) | — |
| Analytics | Placeholder text | NO | **YES** (placeholder) | — |
| Leads | `LeadBoard` component | Unknown (not audited) | — | — |
| Settings | Static toggle UI | NO | **YES** (static UI) | — |

**Verdict: FULLY STATIC / PLACEHOLDER**
- All admin pages are hardcoded mock data — no API integration at all

---

### 3.10 Auth Pages

| Page | Data Source | Uses API? | API Endpoint |
|------|-------------|-----------|--------------|
| Login | `lib/api/auth` → `login()` | **YES** | `POST /auth/login` |
| Register | `lib/api/auth` → `register()` | **YES** | `POST /auth/register` |
| Forgot Password | `lib/api/auth` → `sendOtp()` | **YES** | `POST /auth/send-otp` |
| Verify | `lib/api/auth` → `verifyOtp()` | **YES** | `POST /auth/verify-otp` |

**Verdict: FULLY API-INTEGRATED**

---

## 4. Components Using Static `data/` Imports

These components import directly from `data/academies`, `data/coaches`, or `data/sports`:

| Component | File | Static Imports |
|-----------|------|----------------|
| `StatsSection` | `components/home/stats-section.tsx` | `data/academies`, `data/coaches`, `data/sports` |
| `FeaturedSports` | `components/home/featured-sports.tsx` | `data/sports` |
| `PersonalizedHome` | `components/home/personalized-home.tsx` | `data/academies`, `data/coaches` |
| `YourAcademy` | `components/home/your-academy.tsx` | `data/academies` |
| `SportsListing` | `components/sports/sports-listing.tsx` | `data/sports` |
| `ShortlistView` | `components/shortlist/shortlist-view.tsx` | `data/academies`, `data/coaches` |
| `CommandPalette` | `components/command/command-palette.tsx` | `data/academies`, `data/coaches`, `data/sports` |
| `CompareProvider` | `components/providers/compare-provider.tsx` | `data/academies`, `data/coaches`, `data/sports` |
| `CompareView` | `components/compare/compare-view.tsx` | `data/academies`, `data/coaches`, `data/sports` |
| `CompareTray` | `components/compare/compare-tray.tsx` | `data/academies`, `data/coaches`, `data/sports` |
| `ProfilePage` | `app/(private)/profile/page.tsx` | `data/academies`, `data/coaches` |
| `SportsDetailPage` | `app/(public)/sports/[slug]/page.tsx` | `data/sports`, `data/competitions` |
| `fixtureImages` | `lib/images.ts` | `data/academies`, `data/coaches`, `data/sports` |

---

## 5. Final Summary

### Q1: Which pages already use backend APIs?

| Page | API Used |
|------|----------|
| Academies list | `GET /academies` |
| Academy details | `GET /academies/by-slug/:slug` |
| Coaches list | `GET /coaches` |
| Coach details | `GET /coaches/by-slug/:slug` |
| Home — Featured Academies | `GET /academies` |
| Home — Featured Coaches | `GET /coaches` |
| Search — Academies tab | `GET /academies` |
| Search — Coaches tab | `GET /coaches` |
| Enquiry form + submission | `GET /academies/by-slug/:slug`, `GET /coaches/by-slug/:slug`, `POST /enquiries` |
| Profile enquiries list | `GET /enquiries/me` |
| Shortlist (authenticated) | `GET /shortlist/me/populated`, `POST /shortlist`, `DELETE /shortlist/:id` |
| Login | `POST /auth/login` |
| Register | `POST /auth/register` |
| Forgot Password / Verify | `POST /auth/send-otp`, `POST /auth/verify-otp` |

### Q2: Which pages still use mock/static data?

| Page | Static Source | What's Static |
|------|---------------|---------------|
| Home — Stats section | `data/academies`, `data/coaches`, `data/sports` | All stat counts |
| Home — Personalized Home | `data/academies`, `data/coaches` | Matching algorithm input |
| Home — Your Academy | `data/academies` | Academy lookup by ID |
| Home — Featured Sports | `data/sports` | All sports list |
| Search — Sports tab | `data/sports` | All sports search |
| Sports detail page | `data/sports`, `data/competitions` | All sport + competition data |
| Compare feature | `data/academies`, `data/coaches`, `data/sports` | Entity resolution for comparison |
| Command palette | `data/academies`, `data/coaches`, `data/sports` | Global search across all entities |
| Shortlist view (guest) | `data/academies`, `data/coaches` | Entity resolution fallback |
| Profile page | `data/academies`, `data/coaches` | Academy/coach lookup |
| All admin pages | Hardcoded arrays | Every admin table |

### Q3: Which pages are partially integrated?

| Page | API Part | Static Part |
|------|----------|-------------|
| **Home page** | Featured Academies/Coaches (API) | Stats, Personalized, Featured Sports (static) |
| **Search page** | Academies/Coaches results (API) | Sports results (static) |
| **Shortlist page** | CRUD operations when authenticated (API) | Guest fallback + entity resolution (static) |

### Q4: Which pages are fully production-ready?

| Page | Status |
|------|--------|
| Academies list | **PRODUCTION-READY** |
| Academy details | **PRODUCTION-READY** |
| Coaches list | **PRODUCTION-READY** |
| Coach details | **PRODUCTION-READY** |
| Enquiry form + submission | **PRODUCTION-READY** |
| Enquiry list (profile) | **PRODUCTION-READY** |
| Login / Register | **PRODUCTION-READY** |
| Auth flow (OTP, verify) | **PRODUCTION-READY** |
| Shortlist (authenticated) | **PRODUCTION-READY** |

### Q5: Exact files that must be changed to remove remaining mock data

| # | File | Change Required |
|---|------|-----------------|
| 1 | `components/home/stats-section.tsx` | Replace `data/academies`, `data/coaches`, `data/sports` with API calls or server-side data |
| 2 | `components/home/personalized-home.tsx` | Replace `data/academies`, `data/coaches` with API-based recommendations (`lib/api/recommendations.ts` already exists) |
| 3 | `components/home/your-academy.tsx` | Replace `data/academies` with API call to fetch academy by ID |
| 4 | `components/home/featured-sports.tsx` | Replace `data/sports` with `lib/api/sports.ts` → `listSports()` |
| 5 | `components/sports/sports-listing.tsx` | Replace `data/sports` with `lib/api/sports.ts` → `listSports()` |
| 6 | `app/(public)/sports/[slug]/page.tsx` | Replace `data/sports`, `data/competitions` with API calls |
| 7 | `components/command/command-palette.tsx` | Replace `data/academies`, `data/coaches`, `data/sports` with API search or server-side index |
| 8 | `components/compare/compare-view.tsx` | Replace `data/academies`, `data/coaches`, `data/sports` with API-based entity resolution |
| 9 | `components/compare/compare-tray.tsx` | Replace `data/academies`, `data/coaches`, `data/sports` with API-based entity resolution |
| 10 | `components/providers/compare-provider.tsx` | Replace `data/academies`, `data/coaches`, `data/sports` with API-based entity resolution |
| 11 | `components/shortlist/shortlist-view.tsx` | Replace `data/academies`, `data/coaches` fallback with populated API data only |
| 12 | `app/(private)/profile/page.tsx` | Replace `data/academies`, `data/coaches` with API calls |
| 13 | `lib/images.ts` | Replace `data/academies`, `data/coaches`, `data/sports` with API-sourced image URLs |
| 14 | `app/(admin)/admin/page.tsx` | Replace hardcoded KPIs with real admin API |
| 15 | `app/(admin)/admin/academies/page.tsx` | Replace hardcoded rows with admin API |
| 16 | `app/(admin)/admin/coaches/page.tsx` | Replace hardcoded rows with admin API |
| 17 | `app/(admin)/admin/enquiries/page.tsx` | Replace hardcoded rows with admin API |
| 18 | `app/(admin)/admin/verification/page.tsx` | Replace hardcoded rows with admin API |
| 19 | `app/(admin)/admin/sports/page.tsx` | Replace hardcoded rows with admin API |
| 20 | `app/(admin)/admin/users/page.tsx` | Wire to admin users API |
| 21 | `app/(admin)/admin/analytics/page.tsx` | Wire to analytics API |
| 22 | `app/(admin)/admin/settings/page.tsx` | Wire to settings/feature-flags API |
| 23 | `data/academies.ts` | **Deprecate** — remove once all consumers migrated |
| 24 | `data/coaches.ts` | **Deprecate** — remove once all consumers migrated |
| 25 | `data/sports.ts` | **Deprecate** — remove once all consumers migrated |
| 26 | `data/competitions.ts` | **Deprecate** — remove once all consumers migrated |

---

## 6. Architecture Note

The project has **three backend implementations** in the repo:
1. `sportsOS-nodejs/` — Primary Node.js/Express backend (currently deployed to Render)
2. `sports-os-Database/` — Alternative Mongoose scaffold
3. `sports-os-backend/` — Legacy/parallel iteration

The frontend API client (`lib/api/client.ts`) points to `sportsOS-nodejs` via `NEXT_PUBLIC_API_URL`. All API-integrated pages use this single backend.

The `data/` directory serves as a **client-side seed dataset** — the same data seeded into MongoDB via `sportsOS-nodejs/seeds/seedAcademies.js` and `seedCoaches.js`. This means the API-integrated pages are pulling the same data from the database that exists in the static files, but through the proper API layer.

---

## 7. Integration Readiness Matrix

```
COMPONENT              API READY?    STATIC FREE?    PRODUCTION READY?
─────────────────────────────────────────────────────────────────────
Academy listing        ✅ YES        ✅ YES          ✅ YES
Academy details        ✅ YES        ✅ YES          ✅ YES
Coach listing          ✅ YES        ✅ YES          ✅ YES
Coach details          ✅ YES        ✅ YES          ✅ YES
Auth (login/register)  ✅ YES        ✅ YES          ✅ YES
Enquiry form           ✅ YES        ✅ YES          ✅ YES
Enquiry list           ✅ YES        ✅ YES          ✅ YES
Shortlist (auth)       ✅ YES        ⚠️ PARTIAL      ⚠️ YES
Home — Featured A/C    ✅ YES        ✅ YES          ✅ YES
Home — Stats           ❌ NO         ❌ STATIC       ❌ NO
Home — Personalized    ❌ NO         ❌ STATIC       ❌ NO
Home — Your Academy    ❌ NO         ❌ STATIC       ❌ NO
Home — Featured Sports ❌ NO         ❌ STATIC       ❌ NO
Search — Sports        ❌ NO         ❌ STATIC       ❌ NO
Sports detail          ❌ NO         ❌ STATIC       ❌ NO
Compare                ❌ NO         ❌ STATIC       ❌ NO
Command palette        ❌ NO         ❌ STATIC       ❌ NO
Profile                ❌ NO         ❌ STATIC       ❌ NO
Admin dashboard        ❌ NO         ❌ HARDCODED    ❌ NO
Admin tables (x5)      ❌ NO         ❌ HARDCODED    ❌ NO
```

**Overall: ~40% of the frontend is API-integrated, ~60% still uses static/hardcoded data.**
