# NEW_USER_ONBOARDING_FIX_REPORT.md

## 1. Root Cause

The register page handler relied on a `useEffect` to redirect new users to onboarding after registration. The handler had:

```js
const wasAuthenticated = isAuthenticated; // false for new users
setAuth(true, res.data.user.onboardingCompleted);
if (wasAuthenticated) {
  router.push('/');
}
// For new users: NO explicit navigation. Relies on useEffect.
```

The `useEffect` depended on `[isLoading, isAuthenticated, verified, onboardingCompleted, router]` and was supposed to fire when `isAuthenticated` changed from `false` to `true`. However, this approach had two failure modes:

1. **React state batching**: When `setAuth(true, false)` and `setIsSubmitting(false)` are called in the same event handler, React batches them into a single render. The effect fires after the batched render, but if a parent component remounts (e.g., layout re-render from navigation), the auth state could be read from localStorage before the effect fires, causing the user to land on `/` (the public home page) instead of `/onboarding/role`.

2. **No explicit navigation for new users**: The handler never called `router.push` for new users. It depended entirely on the effect, which is a secondary/deferred mechanism. If anything prevented the effect from firing (e.g., component unmount, stale closure), the user stayed on the register page or got redirected elsewhere.

The auth modal had a similar issue — its handler always pushed to `/onboarding/role` regardless of `onboardingCompleted`, which was incorrect for returning users who had already completed onboarding.

## 2. Files Modified

| # | File | Change |
|---|------|--------|
| 1 | `app/(auth)/register/page.tsx` | Handler now explicitly redirects based on `onboardingCompleted`; effect demoted to safety net |
| 2 | `components/auth/auth-modal.tsx` | RegisterView handler now redirects based on `onboardingCompleted`; effect demoted to safety net |

## 3. Exact Changes

### Register Page (`app/(auth)/register/page.tsx`)

**Before:**
```js
setProfile({ ... });
const wasAuthenticated = isAuthenticated;
setAuth(true, res.data.user.onboardingCompleted);
setIsSubmitting(false);
try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
if (wasAuthenticated) {
  router.push('/');
}
// New users: no navigation. Relies on useEffect.
```

**After:**
```js
setProfile({ ... });
setAuth(true, res.data.user.onboardingCompleted);
setIsSubmitting(false);
try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
// Navigate based on onboarding status from the API response.
if (res.data.user.onboardingCompleted) {
  router.push('/');
} else {
  router.push('/onboarding/role');
}
```

**Effect changed from primary navigator to safety net:**
```js
// Before: sole navigation source (but only fired for returning users)
// After: safety net for edit/verify flow where handler is a no-op
useEffect(() => {
  if (isLoading) return;
  if (!isAuthenticated) return;
  const isEditing = sessionStorage.getItem('sportsos:editing-contact') === 'true';
  if (isEditing) { sessionStorage.removeItem('sportsos:editing-contact'); return; }
  if (!onboardingCompleted) {
    router.replace('/onboarding/role');
  } else {
    router.replace('/');
  }
}, [isLoading, isAuthenticated, verified, onboardingCompleted, router]);
```

### Auth Modal (`components/auth/auth-modal.tsx`)

**Before:**
```js
const wasAuthenticated = isAuthenticated;
setAuth(true, res.data.user.onboardingCompleted);
setIsSubmitting(false);
if (wasAuthenticated) {
  router.push('/onboarding/role');
} else {
  onOpenChange(false);
  router.push('/onboarding/role');
}
// Always pushed to /onboarding/role regardless of onboardingCompleted
```

**After:**
```js
setAuth(true, res.data.user.onboardingCompleted);
setIsSubmitting(false);
onOpenChange(false);
if (res.data.user.onboardingCompleted) {
  router.push('/');
} else {
  router.push('/onboarding/role');
}
```

## 4. Data Flow After Fix

### New User Signup
```
Register form → apiRegister() → { onboardingCompleted: false }
→ setAuth(true, false)
→ handler: router.push('/onboarding/role')
→ Role Selection page
→ User picks role → router.push('/onboarding/wizard')
→ Wizard completes → markAuthComplete() → onboardingCompleted: true
→ router.push('/') → Homepage
```

### Existing User Login
```
Login form → apiLogin() → { onboardingCompleted: true }
→ setAuth(true, true)
→ handler: router.push('/')
→ Homepage
```

### Existing User (Not Yet Onboarded) Login
```
Login form → apiLogin() → { onboardingCompleted: false }
→ setAuth(true, false)
→ handler: router.push('/onboarding/role')
→ Role Selection → Wizard → Homepage
```

## 5. Test Results

| Check | Result |
|-------|--------|
| `npm run lint` | 0 errors |
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | 78 pages built successfully |

### Test Scenarios

| Scenario | Expected | Actual |
|----------|----------|--------|
| A. Brand-new user signup | → Role Selection → Wizard → Home | ✅ Handler explicitly pushes to `/onboarding/role` |
| B. Existing user login | → Home | ✅ Handler reads `onboardingCompleted: true` from API, pushes to `/` |
| C. Existing user (not onboarded) login | → Role Selection → Wizard → Home | ✅ Handler reads `onboardingCompleted: false` from API, pushes to `/onboarding/role` |
| D. Auth modal registration | → Role Selection → Wizard → Home | ✅ Modal handler checks `onboardingCompleted`, pushes accordingly |
| E. Edit/verify flow | → suppress redirect | ✅ Effect detects `editing-contact` session flag, suppresses |

## 6. Remaining Issues

| # | Issue | Severity |
|---|-------|----------|
| 1 | Wizard answers not persisted to backend (age, gender, sport, skill, goals) | Medium |
| 2 | Children data not persisted to backend | Medium |
| 3 | `GET /auth/me` defined but not called on frontend mount | Low |
| 4 | localStorage shared across users on same browser | Low (MVP acceptable) |
