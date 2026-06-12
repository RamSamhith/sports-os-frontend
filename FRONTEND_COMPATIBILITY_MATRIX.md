# Frontend Compatibility Matrix

> Generated: 2026-06-12
> Evidence from source code analysis

---

## 1. Global Data Flow

| Layer | Source | Evidence |
|-------|--------|----------|
| Static data | `data/academies.ts`, `data/coaches.ts`, `data/sports.ts`, `data/competitions.ts` | Imported by 12+ components |
| API client | `lib/api/client.ts` + `lib/api/*.ts` (9 modules, 26 functions) | **Zero imports by any page or component** |
| localStorage | 17 `sportsos:*` keys | Used by auth, shortlist, compare, children, onboarding providers |
| React contexts | AuthProvider, ShortlistProvider, CompareProvider, LocationProvider, AnalyticsProvider | Wrap entire app in `app/layout.tsx` |

---

## 2. Page-by-Page Matrix

### Public Pages

| Page | Route | Static Data | API Client | localStorage | Required Backend Endpoint | Available Backend | Compatible? |
|------|-------|-------------|-----------|-------------|--------------------------|-------------------|-------------|
| Homepage | `/` | Via children: `academies`, `coaches` | None | Via children | None directly | N/A | N/A |
| Featured Academies | Component | `academies` from `@/data/academies` | None | None | `GET /academies` | `GET /academies` | **NO** — field mismatch |
| Featured Coaches | Component | `coaches` from `@/data/coaches` | None | None | `GET /coaches` | `GET /coaches` | **NO** — field mismatch |
| Personalized Home | Component | `academies`, `coaches` | None | `sportsos:onboarding`, `sportsos:recently-viewed`, `sportsos:selected-academy` | `GET /recommendations/academies` | None | **MISSING** |
| Academy Listing | `/academies` | `academies` via `AcademyListing` | None | None | `GET /academies?sport=&city=&...` | `GET /academies` | **NO** — no query params, field mismatch |
| Academy Detail | `/academies/[slug]` | `academyBySlug`, `academies`, `coaches` | None | Via ShortlistToggle | `GET /academies/:slug` | `GET /academies/:id` | **NO** — slug vs ID, field mismatch |
| Coach Listing | `/coaches` | `coaches` via `CoachesListing` | None | None | `GET /coaches?sport=&city=&...` | `GET /coaches` | **NO** — no query params, field mismatch |
| Coach Detail | `/coaches/[slug]` | `coachBySlug`, `coaches`, `academyById` | None | Via ShortlistToggle | `GET /coaches/:slug` | `GET /coaches/:id` | **NO** — slug vs ID, field mismatch |
| Sports Listing | `/sports` | Via `SportsListing` | None | None | `GET /sports` | None | **MISSING** |
| Sport Detail | `/sports/[slug]` | `sportBySlug`, `sports`, `competitionsBySport` | None | None | `GET /sports/:slug` | None | **MISSING** |
| Search | `/search` | Via children (AcademyListing, CoachesListing, SportsListing) | None | `sportsos:recent-searches` | `GET /search?q=&type=` | None | **MISSING** |
| Compare | `/compare` | Via `CompareView`: `academies`, `coaches`, `sports` | None | `sportsos:compare` | Client-side only | N/A | OK (client-side) |
| Shortlist | `/shortlist` | Via `ShortlistView`: `academies`, `coaches`, `sports` | None | `sportsos:shortlist` | `GET /favorites` | `GET /shortlist` | **NO** — path + schema mismatch |
| Enquiry Form | `/enquiry/[type]/[id]` | `academyBySlug`, `coachBySlug` | None | None | `POST /enquiries` | None | **MISSING** |
| Enquiry Success | `/enquiry/success` | None | None | None | None | None | OK (static page) |

### Auth Pages

| Page | Route | Static Data | API Client | localStorage | Required Backend Endpoint | Available Backend | Compatible? |
|------|-------|-------------|-----------|-------------|--------------------------|-------------------|-------------|
| Login | `/login` | None | None | Via AuthProvider | `POST /auth/login` | `POST /auth/login` | **NO** — response missing `token` in expected format, no envelope |
| Register | `/register` | None | None | `sportsos:signup-draft` (sessionStorage) | `POST /auth/register` | `POST /auth/register` | **NO** — response missing `token`, no envelope |
| Forgot Password | `/forgot-password` | None | None | None | `POST /auth/send-otp` | None | **MISSING** |
| Verify Method | `/verify/method` | None | None | None | `POST /auth/send-otp` | None | **MISSING** |
| Verify Email | `/verify/email` | None | None | None | `POST /auth/verify-otp` | None | **MISSING** |
| Verify Phone | `/verify/phone` | None | None | None | `POST /auth/verify-otp` | None | **MISSING** |
| Onboarding Role | `/onboarding/role` | None | None | `sportsos:onboarding` | None (client-side) | N/A | OK |
| Onboarding Wizard | `/onboarding/wizard` | None | None | `sportsos:onboarding` | None (client-side) | N/A | OK |

### Private Pages

| Page | Route | Static Data | API Client | localStorage | Required Backend Endpoint | Available Backend | Compatible? |
|------|-------|-------------|-----------|-------------|--------------------------|-------------------|-------------|
| Profile | `/profile` | `academies`, `coaches` | None | `sportsos:onboarding`, `sportsos:children`, `sportsos:selected-academy` | `GET /users/me` | None | **MISSING** |
| Personal Info | `/profile/personal` | None | None | Via AuthProvider | `GET /users/me`, `PATCH /users/me` | None | **MISSING** |
| Children | `/profile/children` | None | None | `sportsos:children`, `sportsos:active-child` | `GET /children`, `POST /children` | None | **MISSING** |
| Preferences | `/profile/preferences` | None | None | Via AuthProvider | `PATCH /users/me` | None | **MISSING** |
| Saved | `/profile/saved` | None | None | Via ShortlistProvider | `GET /favorites` | `GET /shortlist` | **NO** — path + schema mismatch |
| Enquiries | `/profile/enquiries` | None | None | None | `GET /enquiries` | None | **MISSING** |
| Settings | `/settings/*` (7 pages) | None | None | Various localStorage keys | `PATCH /users/me` | None | **MISSING** |

### Admin Pages

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Dashboard | `/admin` | Placeholder KPIs | Not connected |
| All admin pages | `/admin/*` | Placeholder tables | Not connected |

---

## 3. Component Data Source Matrix

| Component | Static Data Import | API Import | localStorage Keys |
|-----------|-------------------|-----------|-------------------|
| `academy-listing.tsx` | `academies` from `@/data/academies` | None | None |
| `academy-grid.tsx` | None (receives props) | None | None |
| `academy-card-placeholder.tsx` | None (receives props) | None | None |
| `academy-info.tsx` | None (receives props) | None | None |
| `coaches-listing.tsx` | `coaches` from `@/data/coaches` | None | None |
| `coach-grid.tsx` | None (receives props) | None | None |
| `coach-card-placeholder.tsx` | None (receives props) | None | None |
| `sports-listing.tsx` | `sports` from `@/data/sports` | None | None |
| `sport-card.tsx` | None (receives props) | None | None |
| `shortlist-toggle.tsx` | None | None | `sportsos:shortlist` (via context) |
| `shortlist-view.tsx` | `academies`, `coaches`, `sports` | None | `sportsos:shortlist` (via context) |
| `compare-view.tsx` | `academies`, `coaches`, `sports` (+ById, +BySlug) | None | `sportsos:compare` (via context) |
| `compare-tray.tsx` | None | None | `sportsos:compare` (via context) |
| `featured-academies.tsx` | `academies` from `@/data/academies` | None | None |
| `featured-coaches.tsx` | `coaches` from `@/data/coaches` | None | None |
| `featured-sports.tsx` | `sports` from `@/data/sports` | None | None |
| `personalized-home.tsx` | `academies`, `coaches` | None | `sportsos:onboarding`, `sportsos:recently-viewed`, `sportsos:selected-academy` |
| `enquiry-form.tsx` | None | None | None |
| `auth-provider.tsx` | None | None | `sportsos:auth-state`, `sportsos:profile` |
| `shortlist-provider.tsx` | `academies`, `coaches`, `sports` | None | `sportsos:shortlist` |
| `compare-provider.tsx` | `academies`, `coaches`, `sports` (+ById, +BySlug) | None | `sportsos:compare` |

---

## 4. Summary

| Metric | Count |
|--------|-------|
| Total pages analyzed | 35+ |
| Pages using static data | 12 (import from `@/data/*`) |
| Pages using API client | **0** |
| Pages using localStorage | 8 (via providers/hooks) |
| Pages with no data dependency | 15+ (static content, auth forms, settings) |
| Required backend endpoints | 15 |
| Available backend endpoints | 5 (all with field mismatches) |
| Missing backend endpoints | 10 |
| Compatible endpoints | **0** |
