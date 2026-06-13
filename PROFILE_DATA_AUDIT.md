# PROFILE DATA AUDIT

**Generated:** 2026-06-13  
**Scope:** Profile data flow, auth state, localStorage, backend sync

---

## 1. Current Profile Architecture

### Data Storage: 100% localStorage

```
sportsos:auth-state  → { isAuthenticated, role, onboardingCompleted, verified }
sportsos:profile     → { name, email, phone }
sportsos:onboarding  → { completed, data: { athlete|parent } }
sportsos:auth-token  → JWT token (string)
```

**No backend sync.** Profile data is set once during login/register, then managed entirely in the browser.

---

## 2. Data Flow Diagram

### Login Flow
```
User enters email/password
  → POST /auth/login
  → Backend returns: { token, user: { id, name, email, role } }
  → Frontend stores token in localStorage
  → Frontend calls setProfile({ name, email, phone: '' })
  → Frontend calls setAuth(true)
  → Redirect to /
```

### Register Flow
```
User enters name/email/phone/password
  → POST /auth/register
  → Backend returns: { token, user: { id, name, email, role } }
  → Frontend stores token in localStorage
  → Frontend calls setProfile({ name, email, phone: phone.trim() })
  → Frontend calls setAuth(true)
  → Redirect to /onboarding/role
```

### Profile Page Load
```
Profile page mounts
  → useAuth() → reads from localStorage
  → useOnboarding() → reads from localStorage
  → useChildren() → reads from localStorage
  → useAcademySelection() → reads from localStorage
  → data/academies, data/coaches → static imports
```

### Profile Edit Flow
```
User edits name/email/phone on /profile/personal
  → setProfile({ name, email, phone })
  → Updates React state → persists to localStorage
  → NO backend API call
  → Changes lost if user clears cache
```

---

## 3. Field Status Analysis

### Profile Page (`/profile`)

| Field | Source | Status | Notes |
|-------|--------|--------|-------|
| `role` | `useAuth().role` | ✅ Correct | Set during onboarding |
| `athleteData` | `useOnboarding().athleteData` | ✅ Correct | From wizard, persisted in localStorage |
| `parentData` | `useOnboarding().parentData` | ✅ Correct | From wizard, persisted in localStorage |
| `activeChild` | `useChildren().activeChild` | ✅ Correct | From children hook |
| `selectedAcademyId` | `useAcademySelection()` | ✅ Correct | From selection hook |
| `academies` | `data/academies` (static) | ⚠️ Static | 12 hardcoded academies, not from API |
| `coaches` | `data/coaches` (static) | ⚠️ Static | 8 hardcoded coaches, not from API |

### Personal Info (`/profile/personal`)

| Field | Source | Status | Notes |
|-------|--------|--------|-------|
| `name` | `useAuth().profile.name` | ⚠️ Stale after login | Set from login response, not synced with backend |
| `email` | `useAuth().profile.email` | ⚠️ Stale after login | Set from login response, not synced with backend |
| `phone` | `useAuth().profile.phone` | ❌ Empty on login | Hardcoded to `''` in login flow |

### Auth Context (`useAuth()`)

| Field | Source | Status | Notes |
|-------|--------|--------|-------|
| `isAuthenticated` | localStorage | ✅ Works | Set by `setAuth(true)` |
| `role` | localStorage | ✅ Works | Set by `setRole()` during onboarding |
| `onboardingCompleted` | localStorage | ✅ Works | Set by `completeOnboarding()` |
| `verified` | localStorage | ✅ Works (MVP bypass) | Auto-set by `setAuth(true)` |
| `profile.name` | localStorage | ⚠️ Stale | Set once at login, never refreshed |
| `profile.email` | localStorage | ⚠️ Stale | Set once at login, never refreshed |
| `profile.phone` | localStorage | ❌ Empty | Set to `''` on login |
| `profile.avatar` | — | ❌ Missing | Not in `UserProfile` type |
| `profile.preferences` | — | ❌ Missing | Not in auth context |
| `profile.consent` | — | ❌ Missing | Not in auth context |
| `profile.themePreference` | — | ❌ Missing | Not in auth context |

---

## 4. Backend vs Frontend Model Mismatch

### Backend User Model (`sportsOS-nodejs/models/User.js`)

```js
{
  name:     String (required),
  email:    String (required, unique),
  password: String (required),
  phone:    String,
  role:     String (enum),
  // timestamps: true (adds createdAt, updatedAt)
}
```

### Backend `safeUser()` Response

```js
{ id, name, email, role }
```

**Missing from response:** `phone`, `isVerified`, `onboardingCompleted`, `preferences`, `consent`, `themePreference`, `avatar`, `createdAt`, `updatedAt`

### Frontend User Type (`types/domain/user.ts`)

```ts
{
  id, role, name, email, phone?, avatar?,
  authProvider?, lastLoginAt?, preferences?,
  themePreference?, consent?, createdAt, updatedAt
}
```

### Frontend UserProfile (`lib/hooks/use-auth.ts`)

```ts
{ name, email, phone }
```

**Mismatch summary:**

| Field | Backend Model | Backend Response | Frontend Type | Frontend Auth Context |
|-------|--------------|------------------|---------------|----------------------|
| `id` | ✅ `_id` | ✅ Returned | ✅ `id` | ❌ Not exposed |
| `name` | ✅ | ✅ | ✅ | ✅ `profile.name` |
| `email` | ✅ | ✅ | ✅ | ✅ `profile.email` |
| `phone` | ✅ | ❌ Not returned | ✅ `phone?` | ⚠️ Set to `''` |
| `role` | ✅ | ✅ | ✅ | ✅ `role` |
| `avatar` | ❌ | ❌ | ✅ `avatar?` | ❌ Not in context |
| `preferences` | ❌ | ❌ | ✅ `preferences?` | ❌ Not in context |
| `consent` | ❌ | ❌ | ✅ `consent?` | ❌ Not in context |
| `themePreference` | ❌ | ❌ | ✅ `themePreference?` | ❌ Not in context |
| `isVerified` | ❌ | ❌ | ❌ | ✅ `verified` (frontend-only) |
| `onboardingCompleted` | ❌ | ❌ | ❌ | ✅ `onboardingCompleted` (frontend-only) |
| `createdAt` | ✅ (timestamps) | ❌ | ✅ | ❌ Not in context |
| `updatedAt` | ✅ (timestamps) | ❌ | ✅ | ❌ Not in context |

---

## 5. Data Persistence Analysis

### What Survives What

| Scenario | Auth State | Profile | Onboarding | Token |
|----------|-----------|---------|------------|-------|
| Page refresh | ✅ | ✅ | ✅ | ✅ |
| Browser restart | ✅ | ✅ | ✅ | ✅ |
| Logout → Login | ❌ Cleared | ❌ Cleared | ❌ Cleared | ❌ Cleared |
| Login again | ✅ Restored | ⚠️ Partial | ❌ Not restored | ✅ Restored |
| Clear cache | ❌ Lost | ❌ Lost | ❌ Lost | ❌ Lost |
| Different browser | ❌ Lost | ❌ Lost | ❌ Lost | ❌ Lost |
| Incognito window | ❌ Lost | ❌ Lost | ❌ Lost | ❌ Lost |

### Login vs Register Profile Population

| Field | Login | Register |
|-------|-------|----------|
| `name` | ✅ From API response | ✅ From API response |
| `email` | ✅ From API response | ✅ From API response |
| `phone` | ❌ Hardcoded `''` | ✅ From form input |
| `role` | ❌ Not set (from localStorage) | ❌ Not set (from localStorage) |

---

## 6. Profile Edit Flow

### `/profile/personal` Page

1. Loads `profile.name`, `profile.email`, `profile.phone` from `useAuth()`
2. User edits fields
3. On save: calls `setProfile({ name, email, phone })`
4. `setProfile` updates React state → persists to `sportsos:profile` in localStorage
5. **No backend API call is made**
6. Changes are local-only

### `/settings/profile` Page

Identical to `/profile/personal` — same flow, same localStorage persistence.

### Implications

- Profile edits survive page refresh (localStorage)
- Profile edits do NOT persist to backend database
- If user logs out and back in, profile reverts to login response data
- No other device sees the profile changes

---

## 7. Avatar / Profile Image Flow

### Current State: **NOT IMPLEMENTED**

| Check | Result |
|-------|--------|
| Avatar field in `UserProfile` type | ❌ Not defined |
| Avatar field in auth context | ❌ Not exposed |
| Avatar upload component | ❌ Does not exist |
| Avatar display in navbar | ❌ Shows generic `User2` icon |
| Avatar display in profile page | ❌ Not displayed |
| Avatar field in backend User model | ❌ Not defined |
| Avatar field in backend `safeUser()` | ❌ Not returned |

---

## 8. `/auth/me` Endpoint

### Frontend: Defined but Unused

`lib/api/auth.ts:72-74`:
```ts
export async function getMe(): Promise<ApiResponse<User>> {
  const { get } = await import('./client');
  return get<User>('/auth/me');
}
```

### Backend: Not Implemented

`authController.js` only has `/register` and `/login`. No `/auth/me` route.

### Usage: **Never called anywhere**

No component or page calls `getMe()`. The function exists but is dead code.

---

## 9. localStorage Keys Inventory

| Key | Set By | Read By | Contents |
|-----|--------|---------|----------|
| `sportsos:auth-state` | AuthProvider | AuthProvider | `{ isAuthenticated, role, onboardingCompleted, verified }` |
| `sportsos:profile` | AuthProvider | AuthProvider | `{ name, email, phone }` |
| `sportsos:auth-token` | Login/Register pages | `lib/api/client.ts` | JWT token string |
| `sportsos:onboarding` | Onboarding wizard | useOnboarding hook | `{ completed, data }` |
| `sportsos:children` | Children hook | useChildren hook | Children array |
| `sportsos:active-child` | Children hook | useChildren hook | Active child ID |
| `sportsos:shortlist` | Shortlist hook | Shortlist page | Shortlist items |
| `sportsos:compare` | Compare provider | Compare page | Compare items |
| `sportsos:settings` | Settings page | Settings page | App settings |
| `sportsos:preferences` | Preferences page | Preferences page | User preferences |
| `sportsos:selected-academy` | Academy selection | Profile page | Academy ID |

---

## 10. MVP-Safe Fixes

### Fix 1: Phone on Login (Priority: HIGH)

**File:** `app/(auth)/login/page.tsx:149`

**Current:**
```ts
setProfile({ name: res.data.user.name, email: res.data.user.email, phone: '' });
```

**Issue:** Phone is hardcoded to `''` because backend `safeUser()` doesn't return it.

**MVP Fix:** Backend `safeUser()` should include `phone`. One-line change in `authController.js:25-27`.

**Effort:** 5 minutes

### Fix 2: Backend `safeUser()` Expansion (Priority: HIGH)

**File:** `sportsOS-nodejs/controllers/authController.js:25-27`

**Current:**
```js
function safeUser(user) {
    return { id: user.id || user._id, name: user.name, email: user.email, role: user.role };
}
```

**MVP Fix:** Add `phone` to response:
```js
function safeUser(user) {
    return { id: user.id || user._id, name: user.name, email: user.email, phone: user.phone, role: user.role };
}
```

**Effort:** 5 minutes

### Fix 3: Profile Page — Display Name and Email (Priority: MEDIUM)

**File:** `app/(private)/profile/page.tsx:69-70`

**Current:**
```tsx
<CardTitle>Profile</CardTitle>
<CardDescription>Welcome back.</CardDescription>
```

**MVP Fix:** Show user name:
```tsx
<CardTitle>Profile</CardTitle>
<CardDescription>Welcome back, {profile.name || 'User'}.</CardDescription>
```

Requires importing `useAuth` and destructuring `profile`.

**Effort:** 10 minutes

---

## 11. Post-MVP Improvements

| # | Improvement | Priority | Effort |
|---|-------------|----------|--------|
| 1 | Add `GET /auth/me` endpoint to backend | HIGH | 1 hour |
| 2 | Call `getMe()` on app mount to refresh profile | HIGH | 1 hour |
| 3 | Add `avatar` field to backend User model | MEDIUM | 30 min |
| 4 | Add avatar upload component | MEDIUM | 2-3 hours |
| 5 | Add `preferences` to backend User model | MEDIUM | 30 min |
| 6 | Add `consent` to backend User model | MEDIUM | 30 min |
| 7 | Add `themePreference` to backend User model | LOW | 30 min |
| 8 | Sync profile edits to backend via API | HIGH | 1-2 hours |
| 9 | Add `onboardingCompleted` to backend User model | MEDIUM | 30 min |
| 10 | Add profile photo to navbar | LOW | 1 hour |

---

## 12. Summary

| Category | Status |
|----------|--------|
| Profile displays correct data after login | ⚠️ Name/email correct, phone empty |
| Profile survives refresh | ✅ Yes (localStorage) |
| Profile survives logout/login | ❌ No — reverts to login response |
| Profile edits persist to backend | ❌ No — localStorage only |
| Avatar support | ❌ Not implemented |
| Backend/frontend models match | ❌ Major mismatch |
| `/auth/me` endpoint | ❌ Not implemented (frontend defined, backend missing) |
| Profile page shows user name | ❌ Shows generic "Welcome back." |

**Bottom line:** Profile works for MVP — name and email display correctly, data persists across refreshes. The main gaps are phone being empty on login and no backend sync for profile edits. Both are fixable with minimal changes.
