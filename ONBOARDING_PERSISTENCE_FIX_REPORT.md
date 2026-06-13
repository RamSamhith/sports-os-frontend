# ONBOARDING PERSISTENCE FIX REPORT

## Goal

A user should complete onboarding only once. After logout and re-login, profile is auto-populated and onboarding is not shown again.

## Files Modified

| # | File | Change |
|---|------|--------|
| 1 | `sportsOS-nodejs/models/User.js` | Added `onboardingCompleted` field |
| 2 | `sportsOS-nodejs/controllers/authController.js` | Updated `safeUser()`, added 2 endpoints, imported `protect` |
| 3 | `lib/api/client.ts` | Added `put()` HTTP method |
| 4 | `lib/api/auth.ts` | Added `saveOnboarding()` function |
| 5 | `types/domain/user.ts` | Added `onboardingCompleted` to `User` interface |
| 6 | `lib/hooks/use-auth.ts` | Updated `setAuth` signature to accept `onboarded?` |
| 7 | `components/providers/auth-provider.tsx` | `setAuth` accepts `onboarded?`, `signOut` no longer clears onboarding |
| 8 | `app/(auth)/login/page.tsx` | Reads `onboardingCompleted` from API, passes to `setAuth` |
| 9 | `app/(auth)/register/page.tsx` | Passes `onboardingCompleted` from API to `setAuth` |
| 10 | `components/auth/auth-modal.tsx` | Login + Register views pass `onboardingCompleted` to `setAuth` |
| 11 | `app/(auth)/onboarding/wizard/page.tsx` | Calls `saveOnboarding()` on completion |

## Exact Changes

### 1. Backend: User Model (`sportsOS-nodejs/models/User.js`)

```diff
+ onboardingCompleted: { type: Boolean, default: false }
```

### 2. Backend: safeUser() (`sportsOS-nodejs/controllers/authController.js:26-28`)

```diff
- return { id: user.id || user._id, name: user.name, email: user.email, role: user.role };
+ return { id: user.id || user._id, name: user.name, email: user.email, phone: user.phone || '', role: user.role, onboardingCompleted: !!user.onboardingCompleted };
```

### 3. Backend: New Endpoints

**GET /auth/me** (line 96-107) — Returns current user from JWT token.
**PUT /auth/onboarding** (line 109-124) — Sets `onboardingCompleted: true` on user.

### 4. Frontend: setAuth Signature

```diff
- setAuth: (authenticated: boolean) => void;
+ setAuth: (authenticated: boolean, onboarded?: boolean) => void;
```

### 5. Frontend: signOut Preserves Onboarding (`components/providers/auth-provider.tsx`)

Removed `localStorage.removeItem('sportsos:onboarding')` from `signOut()`.

### 6. Frontend: Login Reads from API (`app/(auth)/login/page.tsx`)

```diff
- setProfile({ name: res.data.user.name, email: res.data.user.email, phone: ... });
- setAuth(true);
- const onboarded = localStorage.getItem('sportsos:auth-state');
- const parsed = onboarded ? JSON.parse(onboarded) : null;
- if (parsed?.onboardingCompleted) { router.replace('/'); }
+ const userPhone = res.data.user.phone ?? '';
+ setProfile({ name: res.data.user.name, email: res.data.user.email, phone: userPhone });
+ setAuth(true, res.data.user.onboardingCompleted);
+ if (res.data.user.onboardingCompleted) { router.replace('/'); }
```

### 7. Frontend: Wizard Saves to Backend (`app/(auth)/onboarding/wizard/page.tsx`)

```diff
+ import { saveOnboarding } from '@/lib/api/auth';
  // ...
  completeOnboarding(data);
  markAuthComplete();
+ saveOnboarding().catch(() => { /* non-blocking */ });
```

## Data Flow Before

```
Register → API saves user (no onboardingCompleted) → localStorage only
Login → API returns user (no onboardingCompleted) → reads localStorage (empty) → redirect to /onboarding/role
signOut → clears sportsos:onboarding → all data lost
```

## Data Flow After

```
Register → API saves user (onboardingCompleted: false) → safeUser() returns it
Login → API returns user (onboardingCompleted) → setAuth(true, onboardingCompleted) → redirect based on API
Wizard complete → saveOnboarding() → PUT /auth/onboarding → onboardingCompleted: true persisted
signOut → preserves sportsos:onboarding → next login reads API → skips onboarding
```

## Test Results

| Check | Result |
|-------|--------|
| `npm run lint` | 0 errors |
| `npx tsc --noEmit` | 0 errors |
| `npm run build` | 78 pages built successfully |

## Remaining Limitations

| # | Limitation | Impact | Effort to Fix |
|---|-----------|--------|---------------|
| 1 | Wizard answers (age, gender, location, sports, skill, goals) not persisted to backend | Profile page shows empty fields after logout/re-login if localStorage is cleared | 2-3h (add fields to User model + PUT endpoint) |
| 2 | Children data not persisted to backend | Children list lost after logout | 3-4h |
| 3 | `GET /auth/me` defined but not called on frontend mount | Frontend relies on localStorage hydration, not API refresh | 1h |
| 4 | localStorage shared across users on same browser | If user A logs out and user B logs in, user B may see user A's onboarding data | Acceptable for MVP |
| 5 | No data migration for existing users | Existing users with `onboardingCompleted: undefined` treated as `false` | Automatic (defaults to false) |
