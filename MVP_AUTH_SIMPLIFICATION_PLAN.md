# MVP AUTH SIMPLIFICATION PLAN

**Goal:** Remove OTP/verification requirement for MVP while preserving future ability to add it back.  
**Approach:** Auto-set `verified: true` on login/register — all existing guard logic works, verification is simply bypassed.  
**Generated:** 2026-06-13

---

## Strategy

Instead of ripping out `verified` from every file (risky, many files), we take the **minimal surgical approach**:

**Auto-set `verified: true` whenever `isAuthenticated` becomes `true`.**

This means:
- All existing guards (`PrivateGuard`, page effects) still work
- The `verified` field remains in the auth context for future use
- No OTP screens are ever reached
- Registration → Onboarding → Home flow works end-to-end

---

## Files to Change (7 files, ~30 minutes total)

### Change 1: Auth Provider — Auto-set verified on login/register

**File:** `components/providers/auth-provider.tsx`  
**Line:** 136-141 (`setAuth` callback)

**Current:**
```ts
const setAuth = useCallback((authenticated: boolean) => {
  setState((prev) => {
    if (prev.isAuthenticated === authenticated) return prev;
    return { ...prev, isAuthenticated: authenticated };
  });
}, []);
```

**Change to:**
```ts
const setAuth = useCallback((authenticated: boolean) => {
  setState((prev) => {
    if (prev.isAuthenticated === authenticated) return prev;
    return { ...prev, isAuthenticated: authenticated, verified: authenticated ? true : prev.verified };
  });
}, []);
```

**Effect:** When `setAuth(true)` is called (after login or register), `verified` is automatically set to `true`. All downstream guards see `verified: true` and skip the verification redirect.

**Effort:** 2 minutes

---

### Change 2: Register page — Skip verification redirect, go to onboarding

**File:** `app/(auth)/register/page.tsx`  
**Lines:** 89-92 (inside the `useEffect`)

**Current:**
```ts
if (!verified) {
  console.log('[AUTH DEBUG] RegisterPage effect: not verified, navigating to /verify/method');
  router.replace('/verify/method');
  return;
}
```

**Change to:**
```ts
// MVP: verification skipped — verified is auto-set by setAuth(true)
```

**Effect:** After registration, the flow goes directly to `/onboarding/role` instead of `/verify/method`.

**Effort:** 2 minutes

---

### Change 3: Login page — Redirect fully onboarded users on login

**File:** `app/(auth)/login/page.tsx`  
**Lines:** 50-59 (the `useEffect`)

**Current:**
```ts
useEffect(() => {
  if (isLoading) return;
  if (isAuthenticated) {
    if (verified && onboardingCompleted) {
      router.replace('/');
    }
  }
}, [isLoading, isAuthenticated, verified, onboardingCompleted, router]);
```

**Change to:**
```ts
useEffect(() => {
  if (isLoading) return;
  if (isAuthenticated) {
    if (onboardingCompleted) {
      router.replace('/');
    }
    // If not onboarded, stay on login — the handleSubmit will navigate
  }
}, [isLoading, isAuthenticated, onboardingCompleted, router]);
```

**Effect:** Login redirect no longer requires `verified`. Users who have completed onboarding go to `/`. Users who haven't are handled by `handleSubmit`.

**Effort:** 2 minutes

---

### Change 4: Auth Modal RegisterView — Skip verification redirect

**File:** `components/auth/auth-modal.tsx`  
**Lines:** 410-412 (inside the `useEffect` in `RegisterView`)

**Current:**
```ts
if (!verified) {
  router.push('/verify/method');
  return;
}
```

**Change to:**
```ts
// MVP: verification skipped — verified is auto-set by setAuth(true)
```

**Effect:** Modal registration flow skips `/verify/method` and goes to `/onboarding/role`.

**Effort:** 1 minute

---

### Change 5: Auth Modal RegisterView handleSubmit — Redirect to onboarding

**File:** `components/auth/auth-modal.tsx`  
**Lines:** 514-516 (inside `handleSubmit`)

**Current:**
```ts
if (wasAuthenticated) {
  router.push('/verify/method');
}
```

**Change to:**
```ts
if (wasAuthenticated) {
  router.push('/onboarding/role');
}
```

**Effect:** Edit flow (returning user) goes to onboarding instead of verification.

**Effort:** 1 minute

---

### Change 6: Onboarding Role page — Remove verified check

**File:** `app/(auth)/onboarding/role/page.tsx`  
**Lines:** 108-111 (inside the `useEffect`)

**Current:**
```ts
} else if (!verified) {
  console.log('[AUTH DEBUG] RoleSelectionPage: not verified, redirect to /verify/method');
  router.replace('/verify/method');
}
```

**Change to:**
```ts
}
// MVP: verification check removed
```

**Effect:** Role selection page no longer redirects to verification.

**Effort:** 1 minute

---

### Change 7: Onboarding Wizard page — Remove verified check

**File:** `app/(auth)/onboarding/wizard/page.tsx`  
**Lines:** 86-88 (inside the `useEffect`)

**Current:**
```ts
} else if (!verified) {
  console.log('[AUTH DEBUG] OnboardingWizardPage: not verified, redirect to /verify/method');
  router.replace('/verify/method');
}
```

**Change to:**
```ts
}
// MVP: verification check removed
```

**Effect:** Wizard page no longer redirects to verification.

**Effort:** 1 minute

---

## Files NOT Changed (intentionally preserved)

| File | Reason |
|------|--------|
| `app/(auth)/verify/method/page.tsx` | Still exists for future OTP — just unreachable |
| `app/(auth)/verify/signup/page.tsx` | Still exists for future OTP — just unreachable |
| `app/(auth)/verify/email/page.tsx` | Still exists for future OTP — just unreachable |
| `app/(auth)/verify/phone/page.tsx` | Still exists for future OTP — just unreachable |
| `lib/hooks/use-auth.ts` | `verified` field and `setVerified` kept for future use |
| `components/auth/private-guard.tsx` | Guard logic works correctly with auto-set `verified: true` |
| `components/providers/auth-provider.tsx` | Only `setAuth` callback modified — `setVerified` kept for future |

---

## Flow After Changes

### Registration Flow
```
Register → setAuth(true) → verified=true auto-set
  → Register page effect: !onboardingCompleted → /onboarding/role
  → Role selection → /onboarding/wizard
  → Wizard complete → /
```

### Login Flow
```
Login → setAuth(true) → verified=true auto-set
  → Login page effect: onboardingCompleted → /
  → OR: handleSubmit → /
```

### Existing User (already onboarded)
```
Login → setAuth(true) → verified=true auto-set
  → Login page effect: onboardingCompleted → /
```

### Existing User (not onboarded)
```
Login → setAuth(true) → verified=true auto-set
  → Login page effect: !onboardingCompleted → stays on login
  → handleSubmit navigates to /
  → PrivateGuard: !onboardingCompleted → /onboarding/role
```

---

## Future OTP Re-enablement

When ready to add OTP:

1. **Remove auto-set** from `setAuth` in `auth-provider.tsx`
2. **Add back `!verified` redirects** in the 5 files listed above
3. **Implement backend OTP routes** (`/auth/send-otp`, `/auth/verify-otp`)
4. **Install email/SMS service** (nodemailer or resend)
5. **Wire up OTP pages** to call real API instead of hardcoded `123456`

The `verified` field, `setVerified`, and all OTP pages remain in the codebase — they're just unreachable.

---

## Summary

| File | Change | Lines | Effort |
|------|--------|-------|--------|
| `components/providers/auth-provider.tsx` | Auto-set `verified: true` in `setAuth` | 1 line | 2 min |
| `app/(auth)/register/page.tsx` | Remove `!verified` redirect | 3 lines | 2 min |
| `app/(auth)/login/page.tsx` | Remove `verified` from redirect condition | 2 lines | 2 min |
| `components/auth/auth-modal.tsx` | Remove 2 `!verified` redirects | 6 lines | 2 min |
| `app/(auth)/onboarding/role/page.tsx` | Remove `!verified` redirect | 3 lines | 1 min |
| `app/(auth)/onboarding/wizard/page.tsx` | Remove `!verified` redirect | 3 lines | 1 min |
| **TOTAL** | | **~18 lines** | **~10 min** |

---

## Risk Assessment

| Risk | Mitigation |
|------|-----------|
| Users bypass verification permanently | `verified` field preserved in auth context — re-enable anytime |
| Backend `isVerified` field out of sync | Backend doesn't check it anyway (authController has no check) |
| OTP pages become dead code | Intentional — kept for future, just unreachable |
| PrivateGuard breaks | Won't — `verified: true` satisfies the guard |
| Onboarding flow breaks | Won't — `verified` check is removed, only `isAuthenticated` and `onboardingCompleted` remain |
