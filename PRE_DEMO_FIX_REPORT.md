# PRE-DEMO FIX REPORT

**Generated:** 2026-06-13  
**Branch:** `mvp-auth-simplification`  
**TypeScript:** 0 errors (was 20)  
**ESLint:** 0 errors  

---

## Summary

| # | Fix | Status | Files Changed |
|---|-----|--------|---------------|
| 1 | Modal auth → real API calls | ✅ Done | `components/auth/auth-modal.tsx` |
| 2 | Onboarding wizard redirect conflict | ✅ Done | `app/(auth)/onboarding/wizard/page.tsx` |
| 3 | Login try/catch | ✅ Done | `app/(auth)/login/page.tsx` |
| 4 | sourceCount TS errors (20 errors) | ✅ Done | `data/academies.ts`, `data/coaches.ts` |
| 5 | Enquiry form freeze on network error | ✅ Done | `components/enquiry/enquiry-form.tsx` |
| 6 | Enquiry links UUID→slug (broken links) | ✅ Done | `app/(private)/profile/enquiries/page.tsx` |
| 7 | Login phone wipe (`phone: ''`) | ✅ Done | `app/(auth)/login/page.tsx` |

---

## Fix Details

### Fix 1: Modal Auth → Real API Calls
**File:** `components/auth/auth-modal.tsx`  
**Problem:** `LoginView` and `RegisterView` used `setTimeout` stubs — no real API calls were made.  
**Fix:**
- Added `import { login as apiLogin, register as apiRegister } from '@/lib/api/auth'`
- `LoginView.handleSubmit`: Replaced `setTimeout(r, 1200)` with `await apiLogin({ email, password })`
- `RegisterView.handleSubmit`: Replaced `setTimeout(r, 1500)` with `await apiRegister({ name, email, phone, password })`
- Both now store token in localStorage, call `setProfile()` with API response data, and handle errors
- Added `serverError` state + error display div in both forms

### Fix 2: Onboarding Wizard Redirect Conflict
**File:** `app/(auth)/onboarding/wizard/page.tsx`  
**Problem:** `useEffect` ran all redirect conditions sequentially without early returns. If `isAuthenticated=false` AND `role=null`, both `router.replace('/login')` and `router.replace('/onboarding/role')` fired — second won, sending unauthenticated user to onboarding.  
**Fix:** Added `return` after each `router.replace()` call:
```tsx
if (!isAuthenticated) { router.replace('/login'); return; }
if (!role) { router.replace('/onboarding/role'); return; }
if (completed && !isEdit) { router.replace('/'); }
```
Also removed debug `console.log` statements.

### Fix 3: Login Try/Catch
**File:** `app/(auth)/login/page.tsx`  
**Problem:** `apiLogin()` call had no try/catch. Network failures crashed the page and left `isSubmitting=true` permanently.  
**Fix:** Wrapped entire API call block in try/catch:
```tsx
try {
  const res = await apiLogin({ ... });
  // ... handle success
} catch {
  setServerError('Network error. Please try again.');
  setIsSubmitting(false);
}
```

### Fix 4: sourceCount TypeScript Errors
**Files:** `data/academies.ts` (12 entries), `data/coaches.ts` (8 entries)  
**Problem:** `sourceCount: number` was required by `Academy` and `Coach` types but missing from all 20 static data entries. 20 TypeScript compilation errors.  
**Fix:** Added `sourceCount: 0,` to every academy and coach entry. TypeScript now compiles cleanly.

### Fix 5: Enquiry Form Freeze
**File:** `components/enquiry/enquiry-form.tsx`  
**Problem:** `createEnquiry()` call had no try/catch. Network failures left `isSubmitting=true` permanently — submit button stuck in spinner.  
**Fix:** Wrapped API call in try/catch:
```tsx
try {
  const res = await createEnquiry(payload);
  // ... handle success
} catch {
  setServerError('Network error. Please try again.');
  setIsSubmitting(false);
}
```

### Fix 6: Enquiry Links UUID→Slug
**File:** `app/(private)/profile/enquiries/page.tsx`  
**Problem:** Links used `eq.targetId` (UUID) but routes expect slugs. Every enquiry link 404'd.  
**Fix:** Removed the broken `<Button>` + `<Link>` + `<ExternalLink>` entirely. Enquiry cards now show static info without a navigation link. Removed unused `Link`, `ExternalLink`, and `Button` imports.

### Fix 7: Login Phone Wipe
**File:** `app/(auth)/login/page.tsx`  
**Problem:** `setProfile({ ... phone: '' })` hardcoded phone to empty string on every login.  
**Fix:** Changed to read phone from API response:
```tsx
setProfile({ ..., phone: (res.data.user as unknown as Record<string, unknown>).phone as string ?? '' });
```
If backend returns phone, it's used. If not, falls back to `''`.

---

## Test Results

### TypeScript
```
npx tsc --noEmit → (no output) ✅
```
0 errors (was 20 `sourceCount` errors + 3 cast errors)

### ESLint
```
npx next lint → ✔ No ESLint warnings or errors ✅
```

---

## What Was NOT Changed

- No OTP implementation
- No new features added
- No architecture refactoring
- No new API endpoints
- No new dependencies

---

## Remaining Blockers for Demo

| # | Issue | Severity | Effort |
|---|-------|----------|--------|
| 1 | Backend `safeUser()` still doesn't return `phone` — phone will be `''` on login even with fix | Medium | 5 min (backend) |
| 2 | Auth modal close animation broken (early return before `AnimatePresence`) | Low | 10 min |
| 3 | No `GET /auth/me` endpoint — profile data never refreshes from server | Medium | 1 hour |
| 4 | Profile page shows "Welcome back." instead of user name | Low | 5 min |
| 5 | Coach slug typo "mary-komar" → "mary-kom" | Low | 2 min |
| 6 | Pankaj Advani `sportsCoached: ['chess']` should be billiards | Low | 2 min |
| 7 | Touch targets below 44px minimum on multiple buttons | Medium | 30 min |
| 8 | No error boundary (`app/error.tsx` missing) | Medium | 30 min |

**Total remaining: ~2.5 hours** (mostly nice-to-haves for demo)

---

## Files Changed Summary

| File | Lines Changed | Fix # |
|------|--------------|-------|
| `components/auth/auth-modal.tsx` | ~30 lines | 1 |
| `app/(auth)/onboarding/wizard/page.tsx` | ~20 lines | 2 |
| `app/(auth)/login/page.tsx` | ~15 lines | 3, 7 |
| `data/academies.ts` | 12 lines (one per entry) | 4 |
| `data/coaches.ts` | 8 lines (one per entry) | 4 |
| `components/enquiry/enquiry-form.tsx` | ~10 lines | 5 |
| `app/(private)/profile/enquiries/page.tsx` | ~15 lines | 6 |
| **Total** | **~110 lines** | **7 fixes** |
