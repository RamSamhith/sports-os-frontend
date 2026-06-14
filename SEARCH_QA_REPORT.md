# Search QA Report — SportsOS

**Generated:** 2026-06-14  
**Scope:** Academy search, coach search, filters, sort, mobile search, command palette  
**TypeScript:** ✅ Compiles cleanly

---

## Executive Summary

| Area | Status | Score |
|---|---|---|
| Academy search | ⚠️ Functional with issues | 7/10 |
| Coach search | ⚠️ Functional with issues | 6/10 |
| Filter system | ✅ Good (academies only) | 8/10 |
| Sort options | ❌ No sort UI exists | 2/10 |
| Mobile search | ✅ Good | 8/10 |
| Command palette | ⚠️ Functional with issues | 7/10 |
| **Overall** | **⚠️ Needs work** | **6/10** |

---

## Issues Found

### 🔴 High Severity

#### H1. No sort UI exists
- **Location:** `types/domain/common.ts` — `SortOption` type defined but unused
- **Impact:** Users cannot sort academies or coaches by rating, distance, name, or any criteria
- **Fix required:** Build a SortSelect component and wire it into listing pages

#### H2. Backend search service not connected to frontend
- **Location:** `sports-os-backend/services/searchService.js`
- **Impact:** The backend has `searchAcademies`, `searchCoaches`, `searchSports`, and `searchAll` functions with MongoDB text indexes, but the frontend never calls them. Frontend listing pages fetch via generic `/academies` and `/coaches` endpoints and filter client-side.
- **Fix required:** Wire `lib/api/academies.ts` and `lib/api/coaches.ts` to use search endpoints, or add search params to existing endpoints

#### H3. `searchSubmitEvent` analytics event never fired
- **Location:** `lib/analytics/events.ts:7`
- **Impact:** Search analytics are dead — no tracking of what users search for, how many results they get, or which filters they apply
- **Fix required:** Call `searchSubmitEvent` in `AcademyListing`, `CoachesListing`, `SportsListing`, and command palette on search submit

### 🟡 Medium Severity

#### M1. Search page has duplicated query state
- **Location:** `app/(public)/search/page.tsx:21` vs `useSearchQuery` hook
- **Impact:** The search page manages `query` via local `useState` AND `AcademyListing`/`CoachesListing`/`SportsListing` each independently read `?q` from URL via `useSearchQuery()`. This creates two independent state systems reading the same URL param.
- **Risk:** Low — currently works because both read from `?q`, but could cause inconsistencies if one writes and the other doesn't sync

#### M2. Command palette searches only static data
- **Location:** `components/command/command-palette.tsx:8-10`
- **Impact:** The command palette imports `academies`, `coaches`, and `sports` from static `data/` files. If the database has newer records, they won't appear in command palette results.
- **Fix required:** Either fetch from API on open, or accept static data as a demo limitation

#### M3. Sports listing uses static data instead of API
- **Location:** `components/sports/sports-listing.tsx:11`
- **Impact:** Unlike academies and coaches which fetch from API, sports listing imports directly from `data/sports.ts`. Inconsistent with the data fetching pattern used by other listings.

#### M4. Coach listing has no filter system
- **Location:** `components/coaches/coaches-listing.tsx`
- **Impact:** Academy listing has sport, facility, level, and status filters with URL sync. Coach listing only has text search — no sport filter, no city filter, no experience filter.

#### M5. API `search` param defined but unused
- **Location:** `lib/api/academies.ts`, `lib/api/coaches.ts`
- **Impact:** `AcademyFilterParams` and `CoachFilterParams` define a `search` param, but no frontend component passes it. All search is done client-side after fetching full datasets.

#### M6. `sportCategories` filter constant defined but unused
- **Location:** `lib/constants/filters.ts`
- **Impact:** `sportCategories` is exported but never imported by any filter UI. Only `academyFilterFacilities`, `academyFilterLevels`, and `verificationStatuses` are used.

#### M7. Filter state only URL-synced for academies
- **Location:** `components/academies/academy-listing.tsx:134-146`
- **Impact:** Academy filters (`?sport`, `?facility`, `?level`, `?status`) are synced to URL. Coach and sport filters are not — they exist only in component state and are lost on page refresh.

### 🟢 Low Severity

#### L1. Two different SearchBar components with different APIs
- **Location:** `components/search/search-bar.tsx` vs `components/ui/search-bar.tsx`
- **Impact:** `components/search/search-bar.tsx` uses `defaultValue`/uncontrolled pattern. `components/ui/search-bar.tsx` uses `value`/`onValueChange` controlled pattern. Both export `SearchBar`. Only the UI version is used in production (design page). The search version is unused.
- **Fix:** Remove `components/search/search-bar.tsx` or rename it

#### L2. `components/search/search-bar.tsx` is unused
- **Location:** `components/search/search-bar.tsx`
- **Impact:** Dead code — no component imports this. The design page uses `components/ui/search-bar.tsx` instead.

#### L3. Duplicate `QUICK_NAV` and `navItems` in command palette
- **Location:** `components/command/command-palette.tsx:91-99` and `105-113`
- **Impact:** Both arrays define the same 7 navigation items with slightly different data shapes. `QUICK_NAV` is used when query is empty, `navItems` is used during search. They could share a single source.
- **Status:** Partially fixed — consolidated type annotation but data still duplicated

#### L4. `websiteJsonLd` SearchAction targets `/search` (was `/academies`)
- **Location:** `lib/seo/jsonld.ts:24`
- **Impact:** Google sitelinks search box now correctly targets the unified search page
- **Status:** ✅ Fixed

#### L5. Command palette had redundant `onInput` handler
- **Location:** `components/command/command-palette.tsx:249`
- **Impact:** Both `onChange` and `onInput` fired on every keystroke, causing potential double state updates
- **Status:** ✅ Fixed — removed redundant `onInput`

#### L6. `sports-listing.tsx` useMemo dependency array was incomplete
- **Location:** `components/sports/sports-listing.tsx:25`
- **Impact:** `useMemo` depended only on `[query]` but used `sports` (module-level constant). If `sports` were ever dynamic, the filter would be stale.
- **Status:** ✅ Fixed — added `sports` to dependency array

#### L7. "Enable AI search" admin toggle is dead UI
- **Location:** `app/(admin)/admin/settings/page.tsx`
- **Impact:** Switch component has no state or handler — purely cosmetic

#### L8. Filter drawer "Apply filters" button is misleading
- **Location:** `components/filters/filter-drawer.tsx:69-71`
- **Impact:** Filters take effect immediately when checkboxes are toggled. The "Apply filters" button just closes the drawer — it doesn't apply anything.

---

## Fixes Applied

### 1. Fixed `websiteJsonLd` SearchAction target
**File:** `lib/seo/jsonld.ts:24`  
**Before:** `target: ${siteConfig.url}/academies?q={search_term_string}`  
**After:** `target: ${siteConfig.url}/search?q={search_term_string}`  
**Risk:** None — SEO improvement, Google will now show unified search in sitelinks

### 2. Removed redundant `onInput` handler from command palette
**File:** `components/command/command-palette.tsx:249`  
**Before:** Both `onChange` and `onInput` on the search input  
**After:** Only `onChange`  
**Risk:** None — `onChange` fires for all value changes; `onInput` was redundant

### 3. Fixed `sports-listing.tsx` useMemo dependency array
**File:** `components/sports/sports-listing.tsx:25`  
**Before:** `}, [query]);`  
**After:** `}, [query, sports]);`  
**Risk:** None — `sports` is a module-level constant, so this is a correctness fix with no behavior change

---

## Remaining Issues (Require Manual Attention)

### Priority 1 — Build sort UI
Create a `SortSelect` component with options like:
- "Relevance" (default for search)
- "Rating (high to low)"
- "Name (A–Z)"
- "Reviews (most)"

Wire into `AcademyListing` and `CoachesListing`.

### Priority 2 — Wire search analytics
Call `searchSubmitEvent` in listing components when results update:
```typescript
searchSubmitEvent({
  query: debouncedQuery,
  resultsCount: filtered.length,
  filters: { sport: sports, facility: facilities },
});
```

### Priority 3 — Add coach/sport filters
Port the filter pattern from `AcademyListing` to `CoachesListing`:
- Sport filter (reuse `sportTaxonomy`)
- City filter (derive from data)
- Experience range filter

### Priority 4 — Connect backend search service
Either:
- Add `search` param support to `/academies` and `/coaches` API endpoints
- Or create dedicated `/search/academies`, `/search/coaches` routes that call `searchService.js`

### Priority 5 — Remove dead code
- Delete `components/search/search-bar.tsx` (unused)
- Remove `QUICK_NAV` array from command palette (use `navItems` directly)
- Remove or wire the "Enable AI search" admin toggle

### Priority 6 — Consolidate search state on search page
Refactor `app/(public)/search/page.tsx` to use `useSearchQuery` instead of local `useState` for query management, eliminating the dual-state issue.

---

## File Inventory

| File | Purpose | Issues |
|---|---|---|
| `components/search/search-bar.tsx` | Unused search bar component | Dead code (L2) |
| `components/search/recent-searches.tsx` | Recent search pills | No keyboard nav |
| `components/ui/search-input.tsx` | iOS-safe search input | ✅ Well implemented |
| `components/ui/search-bar.tsx` | Controlled search bar | Duplicate name (L1) |
| `components/command/command-palette.tsx` | Command palette search | Static data (M2), redundant handler (fixed) |
| `components/command/command-palette-provider.tsx` | Cmd+K provider | ✅ Good |
| `components/command/recent-searches-store.ts` | localStorage store | ✅ Good |
| `components/academies/academy-listing.tsx` | Academy search + filters | No sort (H1), analytics not wired (H3) |
| `components/coaches/coaches-listing.tsx` | Coach search | No filters (M4), no sort (H1) |
| `components/sports/sports-listing.tsx` | Sports search | Static data (M3), dep array (fixed) |
| `components/filters/filter-drawer.tsx` | Filter drawer | Misleading "Apply" button (L8) |
| `components/filters/filter-group.tsx` | Checkbox filter group | ✅ Good |
| `components/filters/filter-chips.tsx` | Active filter chips | ✅ Good |
| `components/layout/navbar.tsx` | Mobile search entry | ✅ Good |
| `lib/hooks/use-search-query.ts` | URL-driven query state | ✅ Good |
| `lib/hooks/use-debounce.ts` | Debounce hook | ✅ Good |
| `lib/api/academies.ts` | Academy API client | Unused search param (M5) |
| `lib/api/coaches.ts` | Coach API client | Unused search param (M5) |
| `lib/analytics/events.ts` | Analytics events | searchSubmitEvent unused (H3) |
| `lib/seo/jsonld.ts` | JSON-LD structured data | SearchAction target (fixed) |
| `lib/constants/filters.ts` | Filter definitions | sportCategories unused (M6) |
| `app/(public)/search/page.tsx` | Search page | Dual query state (M1) |
| `sports-os-backend/services/searchService.js` | Backend search | Not connected (H2) |

---

## Score Breakdown

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Academy search (text + filters) | 25% | 7/10 | 1.75 |
| Coach search (text search) | 20% | 6/10 | 1.20 |
| Filter system (academies) | 15% | 8/10 | 1.20 |
| Sort options | 15% | 2/10 | 0.30 |
| Mobile search | 10% | 8/10 | 0.80 |
| Command palette | 15% | 7/10 | 1.05 |
| **Total** | **100%** | | **6.3/10** |

### Score Interpretation
- **6.3/10** = Functional but incomplete
- Core search works — users can find academies and coaches by text
- Major gaps: no sort, no coach filters, analytics dead, backend search unused
- Mobile experience is solid
- Command palette is well-built but limited to static data
