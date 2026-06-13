# MVP USER FLOW TEST REPORT

**Generated:** 2026-06-13  
**Type:** Code-based audit (static analysis)  
**Branch:** `mvp-auth-simplification`  
**TypeScript errors:** 20 (all `sourceCount` missing in static data)  
**ESLint errors:** 0

---

## Executive Summary

| Severity | Count |
|----------|-------|
| **Critical** | 4 |
| **High** | 14 |
| **Medium** | 22 |
| **Low** | 18 |
| **Total** | **58** |

### MVP Ready? **NO** — 4 Critical issues must be resolved first.

---

## FLOW 1 — Registration

### CR-01: Auth modal uses `setTimeout` instead of real API (CRITICAL)
**File:** `components/auth/auth-modal.tsx:297-307`  
**Steps:** Open auth modal → Fill register form → Submit  
**Expected:** Registration call sent to backend, token received  
**Actual:** `await new Promise((r) => setTimeout(r, 1500))` — fake delay, no API call, no token, no user data  
**Impact:** Users registering via the modal get "authenticated" with no server-side account. Completely broken.  
**Effort:** 1 hour

### CR-02: Modal login is also a stub (CRITICAL)
**File:** `components/auth/auth-modal.tsx:297-307`  
**Steps:** Open auth modal → Fill login form → Submit  
**Expected:** Login call sent to backend  
**Actual:** `await new Promise((r) => setTimeout(r, 1200))` — fake delay, no API call  
**Impact:** Modal login creates frontend-only auth with no real session  
**Effort:** 1 hour

### CR-03: Conflicting redirects in onboarding wizard (CRITICAL)
**File:** `app/(auth)/onboarding/wizard/page.tsx:80-95`  
**Steps:** Be unauthenticated → Navigate to `/onboarding/wizard`  
**Expected:** Redirect to `/login`  
**Actual:** Both `router.replace('/login')` and `router.replace('/onboarding/role')` fire. Second wins → user lands on `/onboarding/role` while **unauthenticated**.  
**Root cause:** useEffect runs all conditions without early returns  
**Impact:** Unauthenticated user reaches onboarding wizard  
**Effort:** 5 minutes

### CR-04: `sourceCount` missing from all static data — TS compile error (CRITICAL)
**Files:** `data/academies.ts` (all 12 entries), `data/coaches.ts` (all 8 entries)  
**Steps:** `npx tsc --noEmit`  
**Expected:** Clean compilation  
**Actual:** 20 TypeScript errors — `sourceCount` is required by the `Academy`/`Coach` types but missing from all entries  
**Impact:** Type safety broken. Build may fail depending on CI config.  
**Effort:** 15 minutes (add `sourceCount: 0` to all entries)

### ME-01: No guard for already-onboarded users on role page
**File:** `app/(auth)/onboarding/role/page.tsx:102-110`  
**Steps:** Authenticated + onboarded user navigates to `/onboarding/role`  
**Expected:** Redirect to `/`  
**Actual:** Role selection page shown again  
**Effort:** 5 minutes

### ME-02: `router.push` creates back-button loop in onboarding
**File:** `app/(auth)/onboarding/role/page.tsx:127`  
**Steps:** Role page → Continue → Back → Continue → Back  
**Expected:** Back exits to previous non-onboarding page  
**Actual:** Infinite loop between role and wizard pages  
**Fix:** Change `router.push` to `router.replace`  
**Effort:** 1 minute

### ME-03: Login page has no redirect for authenticated + not-onboarded users
**File:** `app/(auth)/login/page.tsx:50-57`  
**Steps:** Login with `isAuthenticated=true, onboardingCompleted=false`  
**Expected:** Redirect to `/onboarding/role`  
**Actual:** Stuck on login page with no feedback  
**Effort:** 5 minutes

### ME-04: Phone stored with formatting characters
**File:** `app/(auth)/register/page.tsx:231`  
**Steps:** Register with phone `"+91 98765 43210"`  
**Expected:** Phone stored as digits only  
**Actual:** Stored with spaces and `+` prefix  
**Effort:** 2 minutes

### LO-01: Debug console.log statements in production code
**Files:** `app/(auth)/register/page.tsx` (6 instances), `app/(auth)/login/page.tsx` (2 instances)  
**Effort:** 2 minutes

### LO-02: Stale draft repopulates form on browser back
**File:** `app/(auth)/register/page.tsx:62,236-244`  
**Steps:** Complete registration → Browser back to `/register`  
**Expected:** Empty form  
**Actual:** Partial form repopulated (name/email/phone) without password fields  
**Effort:** 10 minutes

### LO-03: Dual auth state sources can desync
**Files:** `components/providers/auth-provider.tsx`, `lib/hooks/use-onboarding.ts`  
**Issue:** `useAuth().onboardingCompleted` and `useOnboarding().completed` are separate localStorage keys. If only one is updated (error/race), redirect logic breaks.  
**Effort:** 1 hour (unify into single source)

---

## FLOW 2 — Login

### HI-01: No try/catch around `apiLogin` call
**File:** `app/(auth)/login/page.tsx:136`  
**Steps:** Login with network failure (offline, DNS error)  
**Expected:** Error message shown, form remains usable  
**Actual:** Unhandled exception crashes the page. Submit button stays permanently disabled (`isSubmitting=true` never reset).  
**Effort:** 5 minutes

### HI-02: `setAuth(false)` doesn't reset `role` or `onboardingCompleted`
**File:** `components/providers/auth-provider.tsx:136-142`  
**Steps:** Call `setAuth(false)` (any code path)  
**Expected:** All auth state reset  
**Actual:** `role` and `onboardingCompleted` remain stale. Components checking `role` while `isAuthenticated=false` get ghost data.  
**Effort:** 5 minutes

### HI-03: No server-side token validation on hydration
**File:** `components/providers/auth-provider.tsx:113-120`  
**Steps:** Login → Wait for token to expire → Refresh page  
**Expected:** Session invalidated, redirect to login  
**Actual:** `isAuthenticated=true` loaded from localStorage. User appears authenticated with expired token until first API 401.  
**Effort:** 1 hour (call `getMe()` on mount)

### HI-04: Modal login doesn't populate profile
**File:** `components/auth/auth-modal.tsx:238`  
**Steps:** Login via modal → Navigate to profile page  
**Expected:** Name, email, phone displayed  
**Actual:** `setProfile()` is never called in modal login. Profile shows empty data.  
**Effort:** 10 minutes

### ME-05: `signOut` never calls server-side logout
**File:** `components/providers/auth-provider.tsx:175-198`  
**Steps:** Logout  
**Expected:** Server-side token invalidated  
**Actual:** Only localStorage cleared. Token remains valid on server. If token was stolen, clearing client storage doesn't help.  
**Effort:** 5 minutes

### ME-06: Phone wiped to `''` on every login
**File:** `app/(auth)/login/page.tsx:149`  
**Steps:** Login with phone number already set  
**Expected:** Phone preserved from profile  
**Actual:** `setProfile({ ... phone: '' })` — hardcoded empty string. Backend `safeUser()` doesn't return phone.  
**Effort:** 5 minutes (backend fix to `safeUser()`)

### ME-07: `getMe()` defined but never called
**File:** `lib/api/auth.ts:72-74`  
**Issue:** No mechanism to refresh user data after login. Stale profile until logout/login.  
**Effort:** 1 hour

### LO-04: localStorage token write silently fails
**File:** `app/(auth)/login/page.tsx:146`  
**Steps:** Login with localStorage disabled/full  
**Expected:** Error shown  
**Actual:** `catch { /* ignore */ }` — user appears logged in but token never persists. Refresh = logged out.  
**Effort:** 5 minutes

### LO-05: Private guard renders null during redirect
**File:** `components/auth/private-guard.tsx:36-38`  
**Steps:** Navigate to protected page while unauthenticated  
**Expected:** Smooth redirect  
**Actual:** Blank screen flash (null render) during redirect  
**Effort:** 5 minutes

### LO-06: No return-to-original-destination tracking
**File:** `components/auth/private-guard.tsx:16-22`  
**Steps:** Try to access `/shortlist` while logged out → Login → Complete onboarding  
**Expected:** Land on `/shortlist`  
**Actual:** Land on `/` — original destination lost  
**Effort:** 30 minutes

---

## FLOW 3 — Academies

### HI-05: Detail pages depend on API — static data helpers are dead code
**File:** `app/(public)/academies/[slug]/page.tsx:36`  
**Steps:** Visit academy detail when API is down or `NEXT_PUBLIC_API_URL` is missing  
**Expected:** Fallback to static data  
**Actual:** `getAcademy(slug)` hits API → shows "not found" even though data exists locally in `data/academies.ts`  
**Impact:** Academy detail pages broken if API is unreachable  
**Effort:** 2 hours (wire static fallback)

### HI-06: "View Coaches" link uses ignored query param
**File:** `components/profile/my-academy-card.tsx:117`  
**Steps:** Click "View Coaches" on academy card  
**Expected:** Coaches filtered by academy  
**Actual:** `/coaches?academy=slug` navigates but listing ignores `academy` param — shows all coaches  
**Effort:** 1 hour (add `academy` param filtering to coaches listing)

### ME-08: Facility filter uses AND while sport filter uses OR
**File:** `components/academies/academy-listing.tsx:151-153`  
**Steps:** Select multiple facilities + multiple sports  
**Expected:** Consistent filter behavior  
**Actual:** Sports match ANY (OR), facilities require ALL (AND)  
**Effort:** 10 minutes (document or align)

### ME-09: Social Links section hardcoded "Not Available"
**File:** `app/(public)/academies/[slug]/page.tsx:200-214`  
**Steps:** View academy detail  
**Expected:** Social links or hide section  
**Actual:** Instagram/Facebook/Youtube all hardcoded "Not Available"  
**Effort:** 30 minutes (hide when no data)

### ME-10: `pageSize: 100` hard cap, no pagination
**File:** `components/academies/academy-listing.tsx:69`  
**Steps:** Dataset grows beyond 100  
**Expected:** All results shown  
**Actual:** Silently truncated  
**Effort:** 2 hours (add pagination)

### ME-11: `debouncedQuery` destructured but unused for filtering
**File:** `components/coaches/coaches-listing.tsx:38-53`  
**Steps:** Type in search  
**Expected:** Debounced filtering  
**Actual:** Filters on every keystroke despite `debouncedQuery` being available  
**Effort:** 5 minutes

### ME-12: Years Operating calculation imprecise
**File:** `app/(public)/academies/[slug]/page.tsx:287`  
**Issue:** Year-only comparison — academy created Dec 30 2024 shows "2 years" on Jan 1 2026  
**Effort:** 5 minutes

### LO-07: "N of N academies" redundant when unfiltered
**File:** `components/academies/academy-listing.tsx:339-341`  
**Issue:** Shows "12 of 12 academies" when no filters active — clutter  
**Effort:** 5 minutes

### LO-08: Filter states not re-synced from URL on back navigation
**File:** `components/academies/academy-listing.tsx:59-62`  
**Steps:** Apply filters → Navigate away → Browser back  
**Expected:** Filters restored from URL  
**Actual:** Filters show stale state (useState lazy initializer runs only once)  
**Effort:** 30 minutes

---

## FLOW 4 — Coaches

### HI-07: `CompareButton` missing required props on detail page
**File:** `app/(public)/coaches/[slug]/page.tsx:131`  
**Steps:** View coach detail → Click compare  
**Expected:** Coach added to compare with label/sublabel  
**Actual:** `CompareButton` called with only `entityType` and `id` — missing `label`, `sublabel`, `href`  
**Effort:** 5 minutes

### HI-08: Pankaj Advani sport misclassified as chess
**File:** `data/coaches.ts:100-101`  
**Steps:** Filter by "chess" → See Pankaj Advani  
**Expected:** Billiards coach not in chess results  
**Actual:** `sportsCoached: ['chess']` — should be `['billiards']`  
**Effort:** 2 minutes

### ME-13: Coach slug typo "mary-komar" should be "mary-kom"
**File:** `data/coaches.ts:180`  
**Steps:** Visit Mary Kom coach detail  
**Expected:** Correct slug `mary-kom`  
**Actual:** `mary-komar-boxing-rohtak` — surname misspelled  
**Effort:** 2 minutes

### ME-14: Coach detail awards section always shows "No achievements available yet"
**File:** `app/(public)/coaches/[slug]/page.tsx:169-176`  
**Steps:** View any coach detail  
**Expected:** Awards from data or hidden  
**Actual:** Hardcoded placeholder text  
**Effort:** 30 minutes

### ME-15: Coach avatar rendered as full-width cover image
**File:** `app/(public)/coaches/[slug]/page.tsx:90-98`  
**Steps:** View coach detail  
**Expected:** Avatar shown as portrait  
**Actual:** Small portrait image stretched/cropped as wide banner  
**Effort:** 30 minutes

### LO-09: Multiple coaches missing `phone` in contact data
**Files:** `data/coaches.ts:54,110,195`  
**Impact:** "Request callback" button has no phone to display  
**Effort:** 2 minutes

---

## FLOW 5 — Shortlist

### HI-09: Guest-to-authenticated login loses shortlisted items
**File:** `components/providers/shortlist-provider.tsx:77-120`  
**Steps:** Shortlist items as guest → Login → Check shortlist  
**Expected:** Guest items preserved  
**Actual:** API response **replaces** (not merges) items at line 97: `setItems(apiItems)`  
**Effort:** 1 hour (merge guest + API items)

### ME-16: `addWithMeta` extras not set on rapid clicks
**File:** `components/providers/shortlist-provider.tsx:185-201`  
**Steps:** Rapidly click shortlist button  
**Expected:** Each item added with label/href  
**Actual:** React 18 batching causes `added` to stay `false` — item added but no label/href → broken card  
**Effort:** 30 minutes

### ME-17: No error handling on shortlist API calls
**File:** `components/providers/shortlist-provider.tsx:212,225`  
**Steps:** Add/remove while offline  
**Expected:** Error shown, item not added  
**Actual:** `.catch(() => {})` — item added locally but server diverges silently  
**Effort:** 30 minutes

### ME-18: "Clear all" fires N parallel DELETE requests
**File:** `components/shortlist/shortlist-view.tsx:109`  
**Steps:** Clear all with 20 items  
**Expected:** Single batch delete  
**Actual:** 20 concurrent DELETE requests, no rate limiting, no error handling  
**Effort:** 1 hour (add batch endpoint or sequential with retry)

### LO-10: Shortlist item with unknown ID disappears silently
**File:** `components/shortlist/shortlist-view.tsx:68-80`  
**Steps:** Shortlist item → Data removed from static file  
**Expected:** Stale entry shown with error  
**Actual:** Item excluded from view, no indication of what happened  
**Effort:** 30 minutes

---

## FLOW 6 — Enquiries

### HI-10: Network error freezes enquiry form permanently
**File:** `components/enquiry/enquiry-form.tsx:99`  
**Steps:** Submit enquiry with network failure  
**Expected:** Error shown, form usable  
**Actual:** No try/catch → `setIsSubmitting(true)` never reset → submit button stuck in spinner forever  
**Effort:** 5 minutes

### HI-11: `childAge` defaults to 0 when only name provided
**File:** `components/enquiry/enquiry-form.tsx:91`  
**Steps:** Fill child name, leave age blank  
**Expected:** Validation error or field ignored  
**Actual:** `age: 0` sent to API — semantically invalid for a child  
**Effort:** 5 minutes

### HI-12: Enquiry list links use UUID instead of slug
**File:** `app/(private)/profile/enquiries/page.tsx:72`  
**Steps:** Click enquiry link  
**Expected:** Navigate to academy/coach detail  
**Actual:** `/academies/{uuid}` — link 404s because routes expect slug, not UUID  
**Effort:** 30 minutes (pass slug from API or lookup)

### ME-19: `childAge` validation doesn't enforce min/max
**File:** `components/enquiry/enquiry-form.tsx:41`  
**Steps:** Enter age `0`, `-5`, or `200`  
**Expected:** Validation error  
**Actual:** Only checks `isNaN` — any number passes  
**Effort:** 5 minutes

### ME-20: Intent hardcoded to `'trial'`
**File:** `components/enquiry/enquiry-form.tsx:79`  
**Steps:** Submit enquiry  
**Expected:** User can choose intent (contact, callback, trial, enrollment)  
**Actual:** Always sends `'trial'` — no UI selector  
**Effort:** 30 minutes

### ME-21: Success message always says "academy" even for coach enquiries
**File:** `components/enquiry/enquiry-success.tsx:14`  
**Steps:** Submit enquiry for a coach  
**Expected:** "We've shared your interest with the coach"  
**Actual:** "We've shared your interest with the **academy**" — hardcoded  
**Effort:** 5 minutes

### ME-22: Enquiries list shows empty state on API failure
**File:** `app/(private)/profile/enquiries/page.tsx:26-29`  
**Steps:** Load enquiries page when API is down  
**Expected:** Error state with retry  
**Actual:** `if (res.ok) setEnquiries(res.data)` — empty list shown, user thinks they have no enquiries  
**Effort:** 15 minutes

### LO-11: Success page has no context about submission
**File:** `components/enquiry/enquiry-form.tsx:109`  
**Steps:** Submit enquiry  
**Expected:** "Enquiry sent to [Academy Name]"  
**Actual:** Generic "success" page — no indication of who was enquired about  
**Effort:** 30 minutes

### LO-12: `defaultSport` prop never passed to `EnquiryForm`
**File:** `app/(public)/enquiry/[type]/[id]/page.tsx:79`  
**Issue:** Form always starts with empty sport field  
**Effort:** 5 minutes

---

## FLOW 7 — Mobile Responsiveness

### HI-13: My Academy Card close button 24px — critically below touch target
**File:** `components/profile/my-academy-card.tsx:58-64`  
**Steps:** Try to close academy card on mobile  
**Expected:** Easy to tap (44px minimum)  
**Actual:** 24px button — nearly impossible to tap accurately  
**Effort:** 5 minutes

### ME-23: Multiple primary action buttons use 32px (below 44px WCAG minimum)
**Files:**
- `components/academies/academy-card-placeholder.tsx:146` — "View details" (32px)
- `components/coaches/coach-card-placeholder.tsx:167` — "View Profile" (32px)
- `components/profile/my-academy-card.tsx:106-119` — All three buttons (32px)
- `app/(private)/profile/enquiries/page.tsx:71` — ExternalLink action (32px)

**Effort:** 30 minutes (change `size="sm"` to `size="md"`)

### ME-24: Mobile nav sheet width hardcoded to 288px
**File:** `components/layout/navbar.tsx:121`  
**Steps:** Open menu on 320px screen  
**Expected:** Sheet fits viewport  
**Actual:** `w-72` (288px) overflows on screens < 320px  
**Effort:** 5 minutes

### ME-25: Coach detail specialization text has no overflow control
**File:** `app/(public)/coaches/[slug]/page.tsx:109-110`  
**Steps:** View coach with many specializations  
**Expected:** Truncated or clamped  
**Actual:** Long unwrapped line pushes content  
**Effort:** 5 minutes

### ME-26: Compare tray CSS conflict — `inset-x-3` overridden by `left-0 right-0`
**File:** `components/compare/compare-tray.tsx:69`  
**Steps:** Open compare tray on mobile  
**Expected:** 12px side padding  
**Actual:** Edge-to-edge with no padding  
**Effort:** 2 minutes

### ME-27: Coach card layout too tight on 320px screens
**File:** `components/coaches/coach-card-placeholder.tsx:99-171`  
**Steps:** View coach card at 320px width  
**Expected:** All content readable  
**Actual:** 48px avatar + 132px buttons = 180px, leaving only ~108px for info column — text truncates aggressively  
**Effort:** 1 hour (responsive layout)

### LO-13: No `line-clamp` on academy/coach names in detail pages
**Files:** `app/(public)/academies/[slug]/page.tsx:104`, `app/(public)/coaches/[slug]/page.tsx:101`  
**Effort:** 5 minutes

### LO-14: Public layout uses `min-h-[60vh]` instead of `min-h-[60dvh]`
**File:** `app/(public)/layout.tsx:14`  
**Effort:** 1 minute

---

## FLOW 8 — Error Handling

### ME-28: No route-level error boundary
**Files:** `app/error.tsx` — **MISSING**  
**Steps:** Runtime error in any route segment  
**Expected:** Custom error page with recovery UI  
**Actual:** Next.js default error page — no custom UX, no retry  
**Effort:** 30 minutes

### ME-29: No reusable React error boundary
**Files:** `components/error-boundary.tsx` — **MISSING**  
**Steps:** Error in widget/card component  
**Expected:** Component-level error isolation  
**Actual:** Entire app crashes  
**Effort:** 1 hour

### ME-30: API client returns misleading `NETWORK_ERROR` for JSON parse errors
**File:** `lib/api/client.ts:61`  
**Steps:** API returns 502 HTML instead of JSON  
**Expected:** Proper error classification  
**Actual:** `SyntaxError` caught and labeled `NETWORK_ERROR`  
**Effort:** 5 minutes

### LO-15: No global toast notification system
**Issue:** No `components/providers/error-provider.tsx` exists  
**Impact:** API errors shown inline or silently swallowed — no consistent error UX  
**Effort:** 2 hours

### LO-16: API error messages can leak server implementation details
**File:** `lib/api/client.ts:64-65,69,81`  
**Issue:** Raw `res.statusText`, `err.message` returned to callers and displayed to users  
**Effort:** 30 minutes

### LO-17: No fetch timeout or retry logic
**File:** `lib/api/client.ts:35-85`  
**Issue:** Transient network failures not retried  
**Effort:** 1 hour

### LO-18: No `not-found.tsx` for dynamic routes
**File:** `app/not-found.tsx` — generic, no custom design  
**Effort:** 30 minutes

---

## Pre-MVP Critical Fix Checklist

| # | Issue | Files | Effort |
|---|-------|-------|--------|
| 1 | Add `sourceCount` to all static data | `data/academies.ts`, `data/coaches.ts` | 15 min |
| 2 | Fix conflicting redirects in wizard | `app/(auth)/onboarding/wizard/page.tsx:80-95` | 5 min |
| 3 | Wire modal auth to real API | `components/auth/auth-modal.tsx` | 1 hour |
| 4 | Add try/catch around login API call | `app/(auth)/login/page.tsx:136` | 5 min |
| **Total** | | | **~1.5 hours** |

---

## Recommended Fixes Before Internship/Demo

| Priority | Issue | Effort |
|----------|-------|--------|
| P0 | `sourceCount` TS errors (20 errors) | 15 min |
| P0 | Wizard conflicting redirects | 5 min |
| P0 | Modal auth → real API | 1 hour |
| P0 | Login try/catch | 5 min |
| P1 | `setAuth(false)` stale state reset | 5 min |
| P1 | Login phone wipe (`phone: ''`) | 5 min |
| P1 | Enquiry form freeze on error | 5 min |
| P1 | Enquiry links use UUID not slug | 30 min |
| P1 | Touch targets (24px/32px → 44px) | 30 min |
| P1 | Coach slug typo (mary-komar) | 2 min |
| P1 | Pankaj Advani sport misclassified | 2 min |
| P2 | Modal login doesn't populate profile | 10 min |
| P2 | Role page no onboarded-user guard | 5 min |
| P2 | Login redirect for not-onboarded | 5 min |
| P2 | Social links "Not Available" | 30 min |
| P2 | Coach awards placeholder text | 30 min |
| P2 | `childAge` defaults to 0 | 5 min |
| P2 | Compare button missing props | 5 min |
| P2 | Compare tray CSS conflict | 2 min |
| P2 | Mobile nav sheet width | 5 min |
| **Total** | | **~4 hours** |

---

## Recommended Fixes After MVP

| Priority | Issue | Effort |
|----------|-------|--------|
| P3 | Server-side token validation on mount | 1 hour |
| P3 | `getMe()` endpoint + frontend hydration | 1 hour |
| P3 | `signOut` calls server-side logout | 5 min |
| P3 | Guest shortlist merge on login | 1 hour |
| P3 | Enquiry batch delete | 1 hour |
| P3 | Pagination for listings | 2 hours |
| P3 | Route error boundaries | 30 min |
| P3 | Error boundary component | 1 hour |
| P3 | Coach detail responsive layout | 1 hour |
| P3 | Unified auth state (single localStorage key) | 1 hour |
| P3 | Return-to tracking after login | 30 min |
| P3 | Toast notification system | 2 hours |
| P3 | Filter URL sync on back navigation | 30 min |
| P3 | Intent selector on enquiry form | 30 min |
| P4 | Console.log cleanup | 2 min |
| P4 | `debouncedQuery` usage in listings | 5 min |
| P4 | Facility/Sport filter consistency | 10 min |
| P4 | Coach avatar as portrait not banner | 30 min |
| P4 | Years Operating precision | 5 min |
| **Total** | | **~15 hours** |

---

## Files Most Likely Involved in Fixes

| File | Issues Found | Priority |
|------|-------------|----------|
| `components/auth/auth-modal.tsx` | CR-01, CR-02, HI-04 | P0 |
| `app/(auth)/onboarding/wizard/page.tsx` | CR-03 | P0 |
| `data/academies.ts` | CR-04 | P0 |
| `data/coaches.ts` | CR-04, HI-08, ME-13 | P0 |
| `app/(auth)/login/page.tsx` | HI-01, ME-03, ME-06 | P0 |
| `components/providers/auth-provider.tsx` | HI-02, HI-03, ME-05 | P1 |
| `components/enquiry/enquiry-form.tsx` | HI-10, HI-11, ME-19 | P1 |
| `app/(private)/profile/enquiries/page.tsx` | HI-12, ME-22 | P1 |
| `components/profile/my-academy-card.tsx` | HI-13, ME-23, HI-06 | P1 |
| `components/providers/shortlist-provider.tsx` | HI-09, ME-16, ME-17 | P2 |
| `lib/api/client.ts` | ME-30, LO-16, LO-17 | P2 |
| `components/layout/navbar.tsx` | ME-24 | P2 |
| `app/(public)/coaches/[slug]/page.tsx` | HI-07, ME-14, ME-15 | P2 |
| `components/compare/compare-tray.tsx` | ME-26 | P2 |
