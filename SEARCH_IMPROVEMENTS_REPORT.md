# Search Improvements Report — SportsOS

**Generated:** 2026-06-14  
**TypeScript:** ✅ Compiles cleanly

---

## Summary

| Priority | Change | Status |
|---|---|---|
| 1 | Connect academy search to backend | ✅ Done |
| 1 | Connect coach search to backend | ✅ Done |
| 2 | Add coach filters (sport, city, experience) | ✅ Done |
| 3 | Wire search analytics | ✅ Done |

---

## Files Changed

### Backend

| File | Change |
|---|---|
| `sportsOS-nodejs/repositories/coachRepository.js` | Added `city` and `experienceYears` filter support to `getCoachesFiltered()` |
| `sportsOS-nodejs/controllers/coachController.js` | Pass `city` and `experienceYears` query params to repository |

### Frontend

| File | Change |
|---|---|
| `lib/api/coaches.ts` | Added `city` and `experienceYears` to `CoachFilterParams` and `getCoaches()` |
| `components/academies/academy-listing.tsx` | Server-side search: passes `search`, `sport`, `facility`, `level`, `status` to API. Removed client-side filtering. Wired `searchSubmitEvent` analytics. |
| `components/coaches/coaches-listing.tsx` | Server-side search: passes `search`, `sport`, `city`, `experienceYears` to API. Added sport/city/experience filter UI with FilterDrawer. Wired `searchSubmitEvent` analytics. |

---

## What Changed

### Priority 1: Server-Side Search

**Before:** Listing components fetched all records (`pageSize: 100`) and filtered client-side via `useMemo`. The `search` param in `AcademyFilterParams` and `CoachFilterParams` was defined but never passed.

**After:** Listing components pass `search` and all filter params to the API. The backend `getAcademiesFiltered()` and `getCoachesFiltered()` handle regex-based search across name, city, state, sports, and specializations.

**Academy search now queries:**
- `name` (regex)
- `description` (regex)
- `location.city` (regex)
- `location.state` (regex)
- `sportsOffered` (regex match in array)

**Coach search now queries:**
- `name` (regex)
- `location.city` (regex)
- `location.state` (regex)
- `sportsCoached` (regex match in array)
- `specialization` (regex match in array)

**Filter counts:** Each listing fetches all records on mount (for dynamic filter counts), then re-fetches with search/filter params when they change. This preserves the existing UI behavior where filter option counts update based on the full dataset.

### Priority 2: Coach Filters

**New filter params added to `GET /coaches`:**

| Param | Type | Example | Backend behavior |
|---|---|---|---|
| `city` | string (comma-separated) | `Bengaluru,Delhi` | Regex match against `location.city` |
| `experienceYears` | string (range) | `5-10` | `$gte` / `$lte` on `experienceYears` field |

**Filter UI added to CoachesListing:**
- **Sport** — 30 sports from `sportTaxonomy`, with dynamic counts
- **City** — Derived from coach data, sorted by count descending
- **Experience** — 4 ranges: 0–3, 4–7, 8–12, 13+ years

**URL sync:** Filter state is synced to URL params (`?sport=`, `?city=`, `?experience=`) matching the pattern used by `AcademyListing`.

### Priority 3: Search Analytics

**Before:** `searchSubmitEvent` was defined in `lib/analytics/events.ts` but never called.

**After:** Both `AcademyListing` and `CoachesListing` fire `searchSubmitEvent` via the `useAnalytics` hook when a debounced search executes:

```typescript
track(searchSubmitEvent({
  query: debouncedQuery,
  resultsCount: res.data.pagination.total,
  filters: { sport, city, experience },
}));
```

Events are only fired when `debouncedQuery` is non-empty (i.e., the user actually typed a search query). Filter-only changes do not fire search events.

---

## Search Performance Improvements

| Metric | Before | After |
|---|---|---|
| Academy search execution | Client-side `Array.filter` on every keystroke (debounced) | Server-side MongoDB regex query |
| Coach search execution | Client-side `Array.filter` on every keystroke (debounced) | Server-side MongoDB regex query |
| Coach filter support | None (text search only) | Sport, city, experience filters |
| Search analytics | Dead code | Fired on every search execution |
| Network on search | 1 initial fetch, 0 subsequent | 1 initial fetch + 1 per search/filter change |

**Trade-off:** Each search/filter change now triggers a new API call. This adds network latency (~50-200ms per request) but ensures results are always from the database, not a stale client-side snapshot.

---

## Remaining Search Limitations

### 1. No sort UI
The `SortOption` type exists in `types/domain/common.ts` but no sort component or sort state management was built. Results are sorted by `createdAt: -1` (newest first) on the backend.

### 2. Command palette still uses static data
`components/command/command-palette.tsx` imports from `data/academies.ts`, `data/coaches.ts`, and `data/sports.ts` directly. It does not call the API. This was explicitly excluded from scope.

### 3. Sports listing still uses static data
`components/sports/sports-listing.tsx` imports from `data/sports.ts` directly. No `/sports` route exists in the backend.

### 4. No pagination UI
Both listing components fetch `pageSize: 100` and display all results. There is no "Load more" or pagination controls. The backend supports `page` and `pageSize` params.

### 5. Filter counts based on full dataset
Filter option counts are computed from all records (fetched on mount), not from the currently filtered result set. This means counts reflect the total across all data, not just the current search context.

### 6. Experience filter is single-select
The experience filter only accepts one range at a time (the first selected value). The UI shows checkboxes but only the first selection is sent to the backend.

### 7. No city filter for academies
Academy listing has sport, facility, level, and status filters but no city filter. Cities are shown in search results but not as a filterable option.

### 8. Backend search is regex-based
The backend uses `new RegExp(search, 'i')` for search, not MongoDB `$text` indexes. This means:
- No stemming or fuzzy matching
- Special regex characters in queries could cause errors (mitigated by `escapeRegex()`)
- No relevance scoring — all matches are equal

### 9. No search suggestions endpoint wired
The backend `searchService.js` has a `searchSuggest()` function for autocomplete, but no route is wired for it. The command palette could benefit from server-side suggestions.

### 10. Two API calls on mount
Each listing makes two API calls on mount: one for all records (filter counts) and one for filtered results (initial display). These could be consolidated into a single call if filter counts were computed differently.
