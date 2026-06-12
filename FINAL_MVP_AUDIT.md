# FINAL MVP AUDIT

**Date:** June 12, 2026  
**Scope:** Full codebase review — frontend + backend  
**Rule:** Only real findings with evidence. No hypothetical issues.

---

## Executive Summary

| Severity | Frontend | Backend | Total |
|----------|----------|---------|-------|
| CRITICAL | 2 | 4 | 6 |
| HIGH | 4 | 4 | 8 |
| MEDIUM | 8 | 8 | 16 |
| LOW | 8 | 15 | 23 |
| **Total** | **22** | **31** | **53** |

---

## CRITICAL — Must Fix Before MVP

### C1. `fix.js` Contains Hardcoded JWT Secret
**File:** `sportsOS-nodejs/fix.js:438`  
**Risk:** If accidentally executed, overwrites all core files with insecure legacy versions containing hardcoded secret `sportsossecretkey123`.  
**Fix:** Delete `fix.js` before deployment.

### C2. JWT_REFRESH_SECRET Not Validated at Startup
**File:** `sportsOS-nodejs/index.js:4-10`  
**Risk:** Startup only checks `MONGO_URI` and `JWT_SECRET`. If `JWT_REFRESH_SECRET` is missing, refresh tokens are signed with `undefined`.  
**Fix:** Add `JWT_REFRESH_SECRET` to `requiredEnv` array.

### C3. 10 Missing Model Files Crash Services
**File:** `sportsOS-nodejs/services/*.js`  
**Risk:** `services/` require 12 model files that don't exist (`Review.js`, `Lead.js`, `Role.js`, `OTP.js`, etc.). If any service is imported, `require()` throws `MODULE_NOT_FOUND`. Currently safe because services are dead code, but risky if anyone imports them.  
**Impact:** No immediate crash (services are dead code).  
**Fix:** Delete `services/` directory entirely (it's unused).

### C4. ReDoS Vulnerability in Search Endpoints
**File:** `sportsOS-nodejs/repositories/academyRepository.js:39`, `coachRepository.js:24`  
**Risk:** `new RegExp(search, 'i')` with unsanitized user input. Attackers can freeze the event loop with crafted regex.  
**Fix:** Escape regex special characters before constructing `RegExp`.

### C5. Duplicate `getMe` Export Collision
**File:** `lib/api/index.ts:2-3`  
**Risk:** Both `./auth` and `./users` export `getMe`. Importers get the `users` version (last-wins), masking the auth version.  
**Fix:** Remove duplicate re-export from one module.

### C6. Debug `console.count()` in Production
**Files:** `auth-provider.tsx:103`, `private-guard.tsx:13`, `personalized-home.tsx:26`  
**Risk:** Fires on every render, causes performance overhead and noisy console.  
**Fix:** Remove before production.

---

## HIGH — Fix Before MVP

### H1. Regex Injection in Duplicate Checks
**File:** `athleteRepository.js:65`, `academyRepository.js:75-76`, `coachRepository.js:62`  
**Risk:** `new RegExp('^' + name + '$', 'i')` with unsanitized input. Regex metacharacters bypass duplicate checks.  
**Fix:** Escape input or use `findOne({ name: { $regex: value, $options: 'i' } })`.

### H2. Mass Assignment on PUT Routes
**Files:** `academyController.js:93`, `coachController.js:89`, `athleteController.js:101`  
**Risk:** `req.body` passed directly to `findByIdAndUpdate`. Attackers can inject `_id`, `slug`, `status`, `rating`, `createdAt`.  
**Fix:** Whitelist allowed fields before update.

### H3. 15 Services Are Dead Code
**File:** `sportsOS-nodejs/services/` (all 15 files)  
**Risk:** Services reference 12 missing models, contain buggy business logic, and create confusion about code patterns.  
**Fix:** Delete entire `services/` directory.

### H4. No Global Error Handler for Unhandled Rejections
**File:** `sportsOS-nodejs/index.js`  
**Risk:** No `process.on('unhandledRejection')`. Async errors crash the process silently in Node 15+.  
**Fix:** Add `process.on('unhandledRejection')` and `process.on('uncaughtException')` handlers.

### H5. `any` Type Usage Defeats TypeScript Safety
**Files:** `shortlist-provider.tsx:90,104`, `enquiry page:28`  
**Risk:** Untyped API responses can cause runtime errors.  
**Fix:** Type the response data properly.

### H6. Extensive Debug Logging in Production Auth Flow
**Files:** Multiple auth pages (100+ `console.log` statements)  
**Risk:** Exposes internal auth state (OTP codes, token values, verification status) to browser console.  
**Fix:** Remove or gate behind `NODE_ENV === 'development'`.

### H7. Missing Error Handling in Featured Components
**Files:** `featured-coaches.tsx:16-28`, `featured-academies.tsx:16-28`  
**Risk:** API failures silently show "No coaches/academies" instead of error + retry.  
**Fix:** Add error state and retry mechanism.

### H8. Missing Async Cleanup in Enquiry Page
**File:** `app/(public)/enquiry/[type]/[id]/page.tsx:22-35`  
**Risk:** No `cancelled` flag in useEffect. State updates on unmounted component.  
**Fix:** Add `cancelled` flag pattern.

---

## MEDIUM — Address During MVP Testing

### M1. `console.log` Statements Throughout Auth Flow
**Files:** `verify/signup/page.tsx`, `register/page.tsx`, `login/page.tsx`, `onboarding/wizard/page.tsx`, `onboarding/role/page.tsx`  
**Risk:** Information leak, performance overhead.

### M2. Missing `eslint-disable react-hooks/exhaustive-deps`
**Files:** `use-search-query.ts:26`, `academy-listing.tsx:145`, `analytics-provider.tsx:25`, `shortlist-provider.tsx:121`  
**Risk:** Stale closures if Next.js changes reference identity.

### M3. Dead Components (Never Imported)
**Files:** `coaches-at-academy.tsx`, `pathway-timeline.tsx`, `nearby-indicator.tsx`, `radius-control.tsx`, `theme-toggle.tsx:73`, `filter-chips.tsx`  
**Risk:** Increases bundle size awareness.

### M4. AuthModal Uses `setTimeout` Instead of Real API
**File:** `auth-modal.tsx:304,507`  
**Risk:** Login/register in modal are fake, disconnected from actual auth API.

### M5. Missing `'use client'` in Three Hooks
**Files:** `use-academy-selection.ts`, `use-academy-status.ts`, `use-recently-viewed.ts`  
**Risk:** Build error if imported from server component.

### M6. `API_BASE` vs Centralized Env Config Mismatch
**Files:** `lib/api/client.ts:24` vs `config/env.ts:17`  
**Risk:** Configuration drift.

### M7. Pagination NaN on Invalid Query Parameters
**Files:** `academyController.js:15-16`, `coachController.js:13-14`  
**Risk:** `parseInt("abc")` returns `NaN`, passed to MongoDB skip.

### M8. Shortlist Create Race Condition
**File:** `shortlistController.js:60-65`  
**Risk:** Concurrent requests can create duplicates or throw E11000.

### M9. No CORS Origin Restriction
**File:** `sportsOS-nodejs/index.js:22`  
**Risk:** `cors()` with no config allows any origin.

### M10. No JSON Body Size Limit
**File:** `sportsOS-nodejs/index.js:23`  
**Risk:** Default 100KB is reasonable but not explicit.

### M11. Auth Middleware Doesn't Validate Token Payload
**File:** `middleware/authMiddleware.js:12-13`  
**Risk:** No field validation after `jwt.verify()`.

### M12. Enquiry POST Manual JWT Decode
**File:** `enquiryController.js:35-42`  
**Risk:** Duplicates JWT verification logic, silent error swallowing.

### M13. Missing Rate Limiting on GET Routes
**Files:** `academyController.js`, `coachController.js`, `athleteController.js`  
**Risk:** Public endpoints vulnerable to scraping/DoS.

### M14. Shortlist Provider Fire-and-Forget API Call
**File:** `shortlist-provider.tsx:88`  
**Risk:** No `.catch()` on `getMyShortlistPopulated()`.

### M15. `LocationPicker` setTimeout Not Cleaned Up
**File:** `location-picker.tsx:281`  
**Risk:** State update on unmounted component.

### M16. `AuthProvider` Re-exports `createContext` (No-Op)
**File:** `auth-provider.tsx:222`  
**Risk:** Confusing, shadows React's `createContext`.

---

## LOW — Nice to Fix

| # | Finding | File | Risk |
|---|---------|------|------|
| L1 | Hardcoded test OTP `123456` | `verify/signup/page.tsx:15` | Demo code in production |
| L2 | Inconsistent `eslint-disable no-console` | `monitoring/*.ts` | Lint rules not enforced |
| L3 | `FeaturedCoaches` no error UI | `featured-coaches.tsx` | Misleading "No coaches" on error |
| L4 | `FeaturedAcademies` no error UI | `featured-academies.tsx` | Same as above |
| L5 | Duplicate `useReducedMotion` | `welcome/page.tsx:4` vs `lib/hooks/` | Two implementations |
| L6 | Unstable `isSelected` function | `use-academy-selection.ts:70` | New ref every render |
| L7 | Shortlist promise no `.catch` | `shortlist-provider.tsx:88` | Silent failure |
| L8 | Unused `academyRepository.getAllAcademies()` | `academyRepository.js:98` | Dead code |
| L9 | Unused `coachRepository.getAllCoaches()` | `coachRepository.js:85` | Dead code |
| L10 | Unused `deleteAll()` exports | `academyRepository.js:93`, `coachRepository.js:80` | Dangerous dead code |
| L11 | Unused `shortlistRepository.removeAllByUser()` | `shortlistRepository.js:20` | Dead code |
| L12 | Unused `enquiryRepository.findById()` | `enquiryRepository.js:16` | Dead code |
| L13 | Unused `Role` model import in `authService.js` | `authService.js:22` | References missing model |
| L14 | `Athlete` model lacks indexes | `Athlete.js` | Full collection scans |
| L15 | Shortlist controller bypasses repository | `shortlistController.js:5-6` | Pattern inconsistency |
| L16 | `coachService.js` populates wrong field names | `coachService.js:69` | `certificates` vs `certifications` |
| L17 | `academyService.js` populates non-existent fields | `academyService.js:75` | `images` doesn't exist |
| L18 | `compareService.js` references wrong field paths | `compareService.js:24` | `a.city` vs `a.location.city` |
| L19 | OTP uses `Math.random()` not crypto | `authService.js:49` | Predictable OTP |
| L20 | No input sanitization library | All controllers | Stored XSS risk |
| L21 | `slugService.js` N+1 query | `slugService.js:37` | Sequential DB queries |
| L22 | `Athlete` model lacks query indexes | `Athlete.js` | Performance |
| L23 | `fix.js` contains err.message leaks | `fix.js` (22 occurrences) | Insecure legacy templates |

---

## Items NOT Reportable

| Item | Status | Why Not Reported |
|------|--------|------------------|
| Frontend build | ✅ Passes | 78/78 pages build successfully |
| Backend modules | ✅ Load | `require()` succeeds for all active files |
| API contracts | ✅ Match | 12/12 endpoints match frontend types |
| Security fixes | ✅ Deployed | All 8 fixes verified on Render |
| Environment variables | ✅ Standardized | All use `MONGO_URI` |
| Deployment config | ✅ Ready | Start script, PORT, env validation, DB fail-fast |

---

## Priority Matrix

### Must Fix Before MVP Testing (CRITICAL)
1. Delete `fix.js` — **1 minute**
2. Add `JWT_REFRESH_SECRET` to startup validation — **1 minute**
3. Delete `services/` directory — **1 minute**
4. Add regex escaping to search — **10 minutes**
5. Remove `console.count()` — **5 minutes**
6. Fix duplicate `getMe` export — **2 minutes**

### Must Fix Before Production (HIGH)
1. Whitelist fields on PUT routes — **15 minutes**
2. Add global error handlers — **5 minutes**
3. Remove debug `console.log` statements — **30 minutes**
4. Add error handling to featured components — **10 minutes**
5. Type API responses properly — **15 minutes**

### Fix During MVP Testing (MEDIUM)
1. Add CORS restrictions — **5 minutes**
2. Add rate limiting to GET routes — **10 minutes**
3. Fix NaN pagination — **5 minutes**
4. Add async cleanup patterns — **10 minutes**
5. Remove dead components — **5 minutes**

---

## Testing Readiness Assessment

| Gate | Status | Notes |
|------|--------|-------|
| Frontend builds | ✅ PASS | 78/78 pages |
| Backend loads | ✅ PASS | All active modules |
| API endpoints | ✅ PASS | 12/12 match types |
| Security fixes | ✅ PASS | 8/8 deployed |
| Environment vars | ✅ PASS | Standardized |
| Seed data ready | ⚠️ PENDING | Scripts exist, not executed |
| CRITICAL bugs | ❌ 6 OPEN | Must fix before testing |
| HIGH bugs | ❌ 8 OPEN | Must fix before production |

**Verdict:** Fix 6 CRITICAL items (30 minutes), then proceed to seed execution and MVP testing.

---

## Recommended Fix Order

| Step | Action | Time | Severity |
|------|--------|------|----------|
| 1 | Delete `fix.js` | 1 min | CRITICAL |
| 2 | Delete `services/` directory | 1 min | CRITICAL |
| 3 | Add `JWT_REFRESH_SECRET` to validation | 1 min | CRITICAL |
| 4 | Remove `console.count()` | 5 min | CRITICAL |
| 5 | Fix duplicate `getMe` export | 2 min | CRITICAL |
| 6 | Add regex escaping | 10 min | CRITICAL |
| 7 | Run seeds on Render | 5 min | — |
| 8 | Execute `MVP_TEST_PLAN.md` | 2-4 hrs | — |
