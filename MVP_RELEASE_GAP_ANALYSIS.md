# MVP Release Gap Analysis

> **Date:** 2026-06-13
> **Source:** `MVP_DATA_SOURCE_AUDIT.md`
> **Purpose:** Prioritized migration plan from static data to API data
> **Status:** Audit only — no code changes made

---

## Priority Definitions

| Priority | Label | Meaning |
|----------|-------|---------|
| **P0** | Must fix | Blocks MVP release. Broken user experience or data integrity issue. |
| **P1** | Should fix | Important for credibility. Visible to demo audience. Fix within 1 week. |
| **P2** | Nice to have | Improves quality but acceptable for MVP demo. Fix in weeks 2-4. |
| **P3** | Can wait | Internal tooling or features that won't be shown in demo. Post-internship. |

---

## 1. P0 — Must Fix Before MVP Release

### P0-1: Personalized Home Recommendations
- **File:** `components/home/personalized-home.tsx`
- **Why it matters:** This is the core value proposition of SportsOS — "discover, compare, and connect with the right sports ecosystem." The personalized home runs a matching algorithm against **static `data/academies` and `data/coaches`** arrays (12 academies, 8 coaches). If the backend database has different or updated records, users see stale/wrong recommendations.
- **User impact:** HIGH. Every returning user sees personalized recommendations that may be wrong. The matching algorithm (`lib/utils/matching.ts`) is sophisticated (574 lines, sport match + location distance + skill level + age scoring) but operates on the wrong data.
- **Backend dependency:** `lib/api/recommendations.ts` already has `getAcademyRecommendations()` and `getCoachRecommendations()` wired to `GET /recommendations/academies` and `GET /recommendations/coaches`. **However, the backend (`sportsOS-nodejs`) has NO `/recommendations` route registered.** Backend must implement this endpoint first.
- **Estimated effort:** LARGE (2-3 days). Backend: implement recommendation service using existing `lib/utils/matching.ts` logic server-side. Frontend: replace `data/` imports with API calls, handle loading states.

### P0-2: Your Academy Section
- **File:** `components/home/your-academy.tsx`
- **Why it matters:** Shows the user's selected academy. Uses `data/academies.find(a => a.id === selectedAcademyId)`. If the academy doesn't exist in the static array (e.g., it was added via admin or has a different ID in the database), the section silently returns null — the user sees nothing.
- **User impact:** HIGH. Users who selected an academy during onboarding see a blank section.
- **Backend dependency:** `lib/api/academies.ts` has `getAcademy(slug)` but NOT `getAcademyById(id)`. Need either a new endpoint `GET /academies/:id` or pass slug instead of ID.
- **Estimated effort:** SMALL (0.5 day). Backend: add `GET /academies/:id` route. Frontend: replace `data/` import with API call.

### P0-3: Profile Page Academy/Coach Lookup
- **File:** `app/(private)/profile/page.tsx`
- **Why it matters:** Profile page shows "My Coaches" by filtering `data/coaches` by `academyId`. Same issue as P0-2 — wrong data source means wrong coaches shown.
- **User impact:** MEDIUM-HIGH. Users see incorrect coach list for their academy.
- **Backend dependency:** Needs `GET /coaches?academyId=:id` or the academy's coaches populated via the academy endpoint.
- **Estimated effort:** SMALL (0.5 day). Backend: add `academyId` filter to `GET /coaches`. Frontend: replace static import with API call.

---

## 2. P1 — Should Fix Soon (Demo-Critical)

### P1-1: Stats Section
- **File:** `components/home/stats-section.tsx`
- **Why it matters:** Displays "12 Academies, 8 Coaches, 20 Sports, X Cities" — all hardcoded from `data/`. If the real database has 50 academies and 30 coaches, the numbers are misleading.
- **User impact:** MEDIUM. Demo viewers will notice the discrepancy. Stakeholders may question data freshness.
- **Backend dependency:** Backend needs a `GET /stats` or `GET /stats/summary` endpoint returning counts. Alternatively, count from existing `GET /academies` and `GET /coaches` responses.
- **Estimated effort:** SMALL (0.5 day). Backend: add stats endpoint or expose `total` in paginated responses. Frontend: fetch and display.

### P1-2: Featured Sports
- **File:** `components/home/featured-sports.tsx`
- **Why it matters:** Shows 8 sports from `data/sports`. Sports are relatively stable (20 sports unlikely to change often), but this is the only homepage section not using any API.
- **User impact:** LOW-MEDIUM. Sports list is unlikely to drift, but inconsistency with other sections is visible.
- **Backend dependency:** **Backend has NO `/sports` route.** `lib/api/sports.ts` has `listSports()` but the backend doesn't implement it.
- **Estimated effort:** MEDIUM (1 day). Backend: add `GET /sports` route with controller/service/model. Frontend: replace import with API call.

### P1-3: Sports Listing (Search + Browse)
- **File:** `components/sports/sports-listing.tsx`
- **Why it matters:** Used in Search page (Sports tab) and Sports browse page. Same static `data/sports` issue as P1-2.
- **User impact:** MEDIUM. Sports search returns static results — if a new sport is added via admin, it won't appear.
- **Backend dependency:** Same as P1-2 — needs `GET /sports`.
- **Estimated effort:** SMALL (0.5 day) once P1-2 backend is done. Just swap import.

### P1-4: Sports Detail Page
- **File:** `app/(public)/sports/[slug]/page.tsx`
- **Why it matters:** Uses `data/sports` for sport details AND `data/competitions` for pathway data. Two static sources. The sport detail page has `generateStaticParams()` which pre-renders from static data — this needs to become dynamic.
- **User impact:** MEDIUM. Stale sport descriptions or missing competitions.
- **Backend dependency:** Needs `GET /sports/:slug` (already in `lib/api/sports.ts`) and a competitions endpoint. **Backend has NO `/competitions` route.**
- **Estimated effort:** MEDIUM (1-1.5 days). Backend: add competitions model/controller/route. Frontend: replace static imports, remove `generateStaticParams()`.

### P1-5: Search — Sports Tab
- **File:** `app/(public)/search/page.tsx` (SportsListing component)
- **Why it matters:** When users search across all tabs, the Sports tab is the only one not hitting the API. Inconsistent data freshness.
- **User impact:** LOW-MEDIUM. Same issue as P1-3.
- **Backend dependency:** Same as P1-2 — needs `GET /sports`.
- **Estimated effort:** Included in P1-3.

---

## 3. P2 — Nice to Have (Quality Improvements)

### P2-1: Command Palette (Cmd+K)
- **File:** `components/command/command-palette.tsx`
- **Why it matters:** Global search command palette searches across `data/academies`, `data/coaches`, `data/sports`. If a new academy/coach is added via API, it won't appear in Cmd+K results.
- **User impact:** LOW-MEDIUM. Power users rely on Cmd+K; most users don't.
- **Backend dependency:** Needs a search endpoint like `GET /search?q=:query` that searches across all entity types, or individual entity endpoints with search params (which exist for academies/coaches but not sports).
- **Estimated effort:** MEDIUM (1 day). Backend: add unified search or sports search. Frontend: replace static imports with API search, debounce, cache.

### P2-2: Compare Feature
- **Files:** `components/providers/compare-provider.tsx`, `components/compare/compare-view.tsx`, `components/compare/compare-tray.tsx`
- **Why it matters:** Compare resolves entity metadata (name, location, rating) from `data/` arrays using `academiesById()`, `coachesById()`, `sportsById()`. If the user compares items that exist in the database but not in static data, the compare tray shows nothing.
- **User impact:** LOW. Compare is a secondary feature. Most users won't notice unless they compare items added after the static data was last updated.
- **Backend dependency:** Needs batch entity lookup: `GET /academies?ids=a,b,c` or `GET /academies/batch?ids=a,b,c`. Same for coaches and sports.
- **Estimated effort:** MEDIUM (1 day). Backend: add batch lookup endpoints. Frontend: replace `data/` resolution with API calls.

### P2-3: Shortlist View (Guest Fallback)
- **File:** `components/shortlist/shortlist-view.tsx`
- **Why it matters:** When a guest user shortlists an item, the view resolves display data from `data/academies`/`data/coaches`. For authenticated users, the API returns populated data (already works). The gap is guest-only.
- **User impact:** LOW. Guest shortlist is a convenience feature; most shortlisting happens when authenticated.
- **Backend dependency:** None — this is purely a frontend fallback pattern. Could be improved by storing metadata at shortlist-add time (which the code already does via `extras`).
- **Estimated effort:** SMALL (0.5 day). Frontend-only: improve localStorage metadata persistence so static fallback is rarely needed.

### P2-4: Fixture Images
- **File:** `lib/images.ts`
- **Why it matters:** `fixtureImages` builds a lookup map from `data/` arrays to guarantee every entity has a local image path. Used as fallback in academy details, coach details, and compare views. If an entity's `coverImage` is null and it's not in the static array, the image breaks.
- **User impact:** LOW. Most entities in the database have `coverImage` set. Static array covers all 12 seeded academies and 8 seeded coaches.
- **Backend dependency:** None — images are served from `/public/images/`. The fix is to ensure all entities have `coverImage` set in the database.
- **Estimated effort:** TINY (0.25 day). Frontend: add a more robust fallback (initials/gradient). Backend: ensure seed data includes coverImage.

---

## 4. P3 — Can Wait (Post-Internship/Demo)

### P3-1: Admin Dashboard (KPIs)
- **File:** `app/(admin)/admin/page.tsx`
- **Why it matters:** Shows "New leads, Enquiry volume, Verified academies, Pending verifications" with `—` placeholder values.
- **User impact:** NONE for end users. Only visible to admins.
- **Backend dependency:** Needs admin analytics endpoints. No admin API exists.
- **Estimated effort:** LARGE (2-3 days). Full admin API layer needed.

### P3-2: Admin Academies Table
- **File:** `app/(admin)/admin/academies/page.tsx`
- **Why it matters:** Shows hardcoded 3-row table of academies.
- **User impact:** NONE for end users.
- **Backend dependency:** Needs `GET /admin/academies` with admin auth.
- **Estimated effort:** MEDIUM (1 day).

### P3-3: Admin Coaches Table
- **File:** `app/(admin)/admin/coaches/page.tsx`
- **Why it matters:** Shows hardcoded 2-row table of coaches.
- **User impact:** NONE for end users.
- **Backend dependency:** Needs `GET /admin/coaches` with admin auth.
- **Estimated effort:** MEDIUM (1 day).

### P3-4: Admin Enquiries Table
- **File:** `app/(admin)/admin/enquiries/page.tsx`
- **Why it matters:** Shows hardcoded 2-row enquiry table.
- **User impact:** NONE for end users.
- **Backend dependency:** Needs `GET /admin/enquiries` with admin auth.
- **Estimated effort:** MEDIUM (1 day).

### P3-5: Admin Verification Queue
- **File:** `app/(admin)/admin/verification/page.tsx`
- **Why it matters:** Shows hardcoded 2-row verification queue.
- **User impact:** NONE for end users.
- **Backend dependency:** Needs `GET /admin/verification` with admin auth.
- **Estimated effort:** MEDIUM (1 day).

### P3-6: Admin Sports Table
- **File:** `app/(admin)/admin/sports/page.tsx`
- **Why it matters:** Shows hardcoded 2-row sports table.
- **User impact:** NONE for end users.
- **Backend dependency:** Needs `GET /admin/sports` with admin auth.
- **Estimated effort:** SMALL (0.5 day).

### P3-7: Admin Users Page
- **File:** `app/(admin)/admin/users/page.tsx`
- **Why it matters:** Shows "User table will be wired in a later phase" text.
- **User impact:** NONE for end users.
- **Backend dependency:** Needs `GET /admin/users` with admin auth.
- **Estimated effort:** MEDIUM (1 day).

### P3-8: Admin Analytics Page
- **File:** `app/(admin)/admin/analytics/page.tsx`
- **Why it matters:** Shows "Charts will be wired in a later phase" placeholder cards.
- **User impact:** NONE for end users.
- **Backend dependency:** Needs analytics data pipeline.
- **Estimated effort:** LARGE (2-3 days).

### P3-9: Admin Leads Board
- **File:** `components/admin/lead-board.tsx`
- **Why it matters:** Shows 6-column lead board with "Empty state placeholder" cards.
- **User impact:** NONE for end users.
- **Backend dependency:** Needs leads API.
- **Estimated effort:** MEDIUM (1 day).

### P3-10: Admin Settings
- **File:** `app/(admin)/admin/settings/page.tsx`
- **Why it matters:** Shows 3 static toggle switches (AI search, notifications, maintenance mode) with no persistence.
- **User impact:** NONE for end users.
- **Backend dependency:** Needs feature flags API.
- **Estimated effort:** MEDIUM (1 day).

---

## 5. Harmless Static Data Usages

These static data usages are **safe to keep as-is** for MVP:

| Usage | File | Why It's Harmless |
|-------|------|-------------------|
| `fixtureImages` fallback | `lib/images.ts` | Only used when entity's own `coverImage` is null. All seeded entities have images. Acts as guaranteed fallback — no data mismatch risk. |
| `generateStaticParams()` for sports | `app/(public)/sports/[slug]/page.tsx` | Pre-renders sport pages at build time from static data. Acceptable for 20 sports that rarely change. SEO benefit outweighs staleness risk. |
| `sportTaxonomy` constants | `lib/constants/sport-taxonomy.ts` | Used for filter labels and display names. Purely cosmetic — doesn't affect data. |
| Compare metadata resolution | `components/providers/compare-provider.tsx` | Uses `data/` only to resolve display labels (name, city) when API-populated data is unavailable. Fallback behavior — not primary source. |

---

## 6. Static Data Usages That Create Incorrect User Data

| Usage | File | Problem |
|-------|------|---------|
| Personalized Home matching | `components/home/personalized-home.tsx` | **CRITICAL.** Matching algorithm runs on 12 static academies and 8 coaches. If DB has 50 academies, 85% of matches are invisible. Users get wrong recommendations. |
| Your Academy lookup | `components/home/your-academy.tsx` | Users who selected an academy not in the static 12 see a blank section. Silent failure — no error, just nothing. |
| Profile "My Coaches" | `app/(private)/profile/page.tsx` | Coaches filtered by `academyId` against static array. Wrong coaches shown or none at all. |
| Stats section counts | `components/home/stats-section.tsx` | Shows "12 Academies" when DB may have 50. Misleading platform size. |
| Command palette search | `components/command/command-palette.tsx` | New academies/coaches added via admin don't appear in Cmd+K. Users can't find them. |
| Shortlist guest fallback | `components/shortlist/shortlist-view.tsx` | Guest shortlist items not in static array show as invisible. User saved something but sees nothing. |

---

## 7. Admin Pages Safe to Leave as Placeholders

All admin pages are safe to leave as placeholders for MVP:

| Page | Why It's Safe |
|------|---------------|
| Admin Dashboard (KPIs) | Internal tooling only. Not visible to end users. Demo can show "coming soon" narrative. |
| Admin Academies | Admin can use direct DB access or API docs for CRUD during demo. |
| Admin Coaches | Same as above. |
| Admin Enquiries | Same as above. |
| Admin Verification | Same as above. |
| Admin Sports | Same as above. |
| Admin Users | Explicitly marked "will be wired in a later phase." |
| Admin Analytics | Explicitly marked "will be wired in a later phase." |
| Admin Leads | Placeholder UI. Acceptable for MVP. |
| Admin Settings | Static toggles. Acceptable — feature flags can be managed via env vars. |

**Recommendation:** Keep admin as a static UI shell. During demo, narrate "admin dashboard is being built out" rather than showing broken data.

---

## 8. Minimum Work Required for MVP Release Readiness

### Backend New Endpoints Required

| # | Endpoint | Controller | effort | Blocks |
|---|----------|------------|--------|--------|
| 1 | `GET /recommendations/academies` | New `recommendationController` | LARGE | P0-1 (Personalized Home) |
| 2 | `GET /recommendations/coaches` | New `recommendationController` | — | P0-1 (Personalized Home) |
| 3 | `GET /academies/:id` | Extend `academyController` | SMALL | P0-2, P0-3 |
| 4 | `GET /sports` | New `sportController` | MEDIUM | P1-2, P1-3, P1-4 |
| 5 | `GET /sports/:slug` | New `sportController` | — | P1-4 |
| 6 | `GET /competitions?sportSlug=:slug` | New `competitionController` | MEDIUM | P1-4 |
| 7 | `GET /coaches?academyId=:id` | Extend `coachController` | SMALL | P0-3 |

### Frontend Migration Required

| # | File | Change | Blocks |
|---|------|--------|--------|
| 1 | `components/home/personalized-home.tsx` | Replace `data/` with `getAcademyRecommendations()` + `getCoachRecommendations()` | P0-1 |
| 2 | `components/home/your-academy.tsx` | Replace `data/academies` with API call | P0-2 |
| 3 | `app/(private)/profile/page.tsx` | Replace `data/academies`, `data/coaches` with API calls | P0-3 |
| 4 | `components/home/stats-section.tsx` | Replace `data/` with stats API or count from paginated responses | P1-1 |
| 5 | `components/home/featured-sports.tsx` | Replace `data/sports` with `listSports()` | P1-2 |
| 6 | `components/sports/sports-listing.tsx` | Replace `data/sports` with `listSports()` | P1-3 |
| 7 | `app/(public)/sports/[slug]/page.tsx` | Replace `data/sports`, `data/competitions` with API calls | P1-4 |

### Summary: MVP Minimum Scope

| Category | Items | Effort |
|----------|-------|--------|
| **P0 (Must fix)** | 3 frontend files + 3 backend endpoints | ~3-4 days |
| **P1 (Should fix)** | 4 frontend files + 2 backend endpoints | ~2-3 days |
| **P2 (Nice to have)** | 4 component sets | ~3 days |
| **P3 (Can wait)** | 10 admin pages | ~10-12 days |
| **Total** | | ~18-22 days |

**MVP minimum (P0 only):** 3-4 days of work to fix the 3 critical data integrity issues. This ensures personalized recommendations, academy selection, and profile display all work correctly with real data.

**MVP + credibility (P0 + P1):** 5-7 days. This ensures the homepage stats, sports browsing, and sports search all show real data — important for demo credibility.

---

## 9. Migration Dependency Graph

```
BACKEND DEPENDENCIES:
═════════════════════

GET /sports ──────────────► P1-2 (Featured Sports)
    │                       P1-3 (Sports Listing)
    │                       P1-4 (Sports Detail)
    │
GET /competitions ────────► P1-4 (Sports Detail)
    │
GET /recommendations/* ───► P0-1 (Personalized Home)
    │
GET /academies/:id ───────► P0-2 (Your Academy)
    │                       P0-3 (Profile coaches)
    │
GET /coaches?academyId= ──► P0-3 (Profile coaches)


FRONTEND DEPENDENCIES:
══════════════════════

P0-1 (Personalized Home) ──── requires GET /recommendations/*
P0-2 (Your Academy) ───────── requires GET /academies/:id
P0-3 (Profile) ────────────── requires GET /academies/:id + GET /coaches?academyId=
P1-1 (Stats) ──────────────── requires GET /stats OR count in paginated responses
P1-2 (Featured Sports) ────── requires GET /sports
P1-3 (Sports Listing) ─────── requires GET /sports (same as P1-2)
P1-4 (Sports Detail) ──────── requires GET /sports/:slug + GET /competitions
```

---

## 10. Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Backend recommendation endpoint is complex (574-line algorithm) | HIGH | Port `lib/utils/matching.ts` to backend as a service. Algorithm already exists — just needs server-side execution. |
| Backend has no sports/competition models | MEDIUM | Models exist in `data/` as TypeScript types. Create Mongoose models matching `types/domain/sport.ts` and `types/domain/competition.ts`. |
| Static data matches DB seed data exactly | LOW | Currently harmless — API pages and static pages show the same data. But this mask will break as soon as admin adds new records. |
| Three backend implementations in repo | LOW | Ignore `sports-os-Database/` and `sports-os-backend/`. Focus only on `sportsOS-nodejs/`. |
| Render deployment may have cold start delays | MEDIUM | API calls from homepage (Featured Academies/Coaches) already work. New API calls will have same latency. Add loading skeletons. |
