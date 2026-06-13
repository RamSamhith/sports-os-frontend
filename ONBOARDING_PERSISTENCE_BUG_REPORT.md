# ONBOARDING PERSISTENCE BUG REPORT

**Generated:** 2026-06-13  
**Scope:** Full data flow audit — registration → onboarding → logout → login → profile

---

## Root Cause

**All onboarding/profile data is stored exclusively in localStorage. The backend stores none of it. When `signOut()` clears localStorage, all user data is permanently lost.**

There are **three compounding problems:**

1. **Backend doesn't store onboarding data** — The User model only has `name`, `email`, `password`, `phone`, `role`. No fields for `onboardingCompleted`, `sportInterests`, `skillLevel`, `location`, `age`, `gender`, `goals`, `children`, `selectedAcademyId`.

2. **`signOut()` clears everything** — Line 193 of `auth-provider.tsx` removes `sportsos:onboarding`. Line 176 resets `onboardingCompleted: false`. On next login, user is redirected to onboarding.

3. **Login doesn't restore onboarding** — `setProfile()` only sets `name` and `email` from the API response. Phone is hardcoded to `''`. No mechanism to fetch onboarding data from backend.

---

## Complete Data Flow Trace

### Registration

```
User submits form
  → POST /auth/register
  → Backend creates: { name, email, password, phone, role: 'athlete' }
  → Backend returns: { token, user: { id, name, email, role } }
     ↑ phone NOT in response
     ↑ NO onboardingCompleted field
     ↑ NO sportInterests, skillLevel, etc.

Frontend stores:
  sportsos:auth-token  = JWT token
  sportsos:auth-state  = { isAuthenticated: true, role: null, onboardingCompleted: false, verified: true }
  sportsos:profile     = { name, email, phone: formInput }
```

### Onboarding

```
User selects role on /onboarding/role
  → setRole('athlete') → sportsos:auth-state.role = 'athlete'

User completes wizard
  → completeOnboarding(data) → sportsos:onboarding = { completed: true, data: { athlete: {...} } }
  → markAuthComplete() → sportsos:auth-state.onboardingCompleted = true
  → addChild() [parents only] → sportsos:children = [{ id, name, age, sport, skillLevel }]

Redirect to /
```

### Profile Page Data Sources

```
Profile page reads from:
  useAuth()         → sportsos:auth-state  (role, onboardingCompleted)
  useAuth().profile → sportsos:profile     (name, email, phone)
  useOnboarding()   → sportsos:onboarding  (athleteData / parentData)
  useChildren()     → sportsos:children    (activeChild)
  useAcademySelection() → sportsos:selected-academy (selectedAcademyId)
  data/academies    → static import        (academy details)
  data/coaches      → static import        (coach details)
```

### Logout (signOut)

```javascript
// auth-provider.tsx:175-198
signOut = () => {
  setState({ isAuthenticated: false, role: null, onboardingCompleted: false, verified: false });
  setProfileState({ name: '', email: '', phone: '' });
  localStorage.removeItem('sportsos:auth-token');
  localStorage.removeItem('sportsos:onboarding');        // ← ALL WIZARD DATA GONE
  localStorage.removeItem('sportsos:children');           // ← ALL CHILD DATA GONE
  localStorage.removeItem('sportsos:selected-academy');   // ← ACADEMY SELECTION GONE
  localStorage.removeItem('sportsos:shortlist');
  localStorage.removeItem('sportsos:compare');
  // ... 12 more keys removed
}
```

### Login

```
User submits form
  → POST /auth/login
  → Backend returns: { token, user: { id, name, email, role } }
     ↑ phone NOT in response (safeUser doesn't return it)
     ↑ NO onboarding data

Frontend stores:
  sportsos:auth-token = JWT token
  sportsos:profile    = { name, email, phone: '' }  ← phone wiped
  sportsos:auth-state = { isAuthenticated: true, onboardingCompleted: false }  ← reset

Checks onboardingCompleted:
  → false → redirect to /onboarding/role  ← USER MUST RE-DO ONBOARDING
```

---

## What Data Exists vs What's Lost

### Backend Stores

| Field | Stored | Returned on Login |
|-------|--------|-------------------|
| `name` | ✅ | ✅ |
| `email` | ✅ | ✅ |
| `password` | ✅ | ❌ (hashed) |
| `phone` | ✅ | ❌ (safeUser omits it) |
| `role` | ✅ (default: 'athlete') | ✅ |
| `onboardingCompleted` | ❌ | ❌ |
| `sportInterests` | ❌ | ❌ |
| `skillLevel` | ❌ | ❌ |
| `location` | ❌ | ❌ |
| `age` | ❌ | ❌ |
| `gender` | ❌ | ❌ |
| `goals` | ❌ | ❌ |

### localStorage Stores (all lost on signOut)

| Key | Contents | Persisted After Logout |
|-----|----------|----------------------|
| `sportsos:auth-state` | isAuthenticated, role, onboardingCompleted, verified | ❌ Cleared |
| `sportsos:profile` | name, email, phone | ❌ Cleared |
| `sportsos:onboarding` | completed, athleteData/parentData | ❌ Cleared |
| `sportsos:children` | children array | ❌ Cleared |
| `sportsos:active-child` | active child ID | ❌ Cleared |
| `sportsos:selected-academy` | academy ID | ❌ Cleared |
| `sportsos:shortlist` | shortlisted items | ❌ Cleared |
| `sportsos:compare` | compared items | ❌ Cleared |

---

## Why Users Are Asked for Details Again

**Three reasons:**

1. **`signOut()` clears `onboardingCompleted`** (`auth-provider.tsx:176`) — resets to `false`. On next login, the redirect check at `login/page.tsx:153-157` sees `onboardingCompleted: false` and sends user to `/onboarding/role`.

2. **`signOut()` removes `sportsos:onboarding`** (`auth-provider.tsx:193`) — all wizard answers (age, gender, location, sports, skill, goals) are permanently deleted.

3. **Login doesn't restore from backend** — The backend has no onboarding data to return. Even if it did, the `safeUser()` function doesn't include it.

---

## Why Profile Is Not Auto-Populated

**After login, profile shows:**

| Field | Source | Status |
|-------|--------|--------|
| `name` | API response → `setProfile()` | ✅ Correct |
| `email` | API response → `setProfile()` | ✅ Correct |
| `phone` | Hardcoded `''` in login handler | ❌ Always empty |
| `role` | `sportsos:auth-state` (cleared on logout) | ❌ Lost |
| `age` | `sportsos:onboarding` (cleared on logout) | ❌ Lost |
| `gender` | `sportsos:onboarding` (cleared on logout) | ❌ Lost |
| `location` | `sportsos:onboarding` (cleared on logout) | ❌ Lost |
| `sportInterests` | `sportsos:onboarding` (cleared on logout) | ❌ Lost |
| `skillLevel` | `sportsos:onboarding` (cleared on logout) | ❌ Lost |
| `goals` | `sportsos:onboarding` (cleared on logout) | ❌ Lost |
| `children` | `sportsos:children` (cleared on logout) | ❌ Lost |
| `selectedAcademyId` | `sportsos:selected-academy` (cleared on logout) | ❌ Lost |

---

## Files Involved

| File | Role | Lines |
|------|------|-------|
| `components/providers/auth-provider.tsx` | signOut clears all keys; setProfile only sets name/email/phone | 165-198 |
| `lib/hooks/use-onboarding.ts` | Onboarding state read/write to localStorage | 17-67 |
| `lib/hooks/use-children.ts` | Children state read/write to localStorage | 22-48 |
| `app/(auth)/login/page.tsx` | Login handler — phone hardcoded to '' | 150 |
| `app/(auth)/register/page.tsx` | Register handler — sets profile from form | 231 |
| `app/(private)/profile/page.tsx` | Profile page — reads from all hooks | 48-52 |
| `lib/api/auth.ts` | API functions — no onboarding endpoints | 47-75 |
| `sportsOS-nodejs/models/User.js` | Backend model — missing onboarding fields | 1-21 |
| `sportsOS-nodejs/controllers/authController.js` | Backend auth — safeUser omits phone | 25-27 |

---

## Recommended Fix

### Option A: Persist to Backend (Proper Fix)

**Backend changes:**
1. Add fields to User model: `onboardingCompleted`, `onboardingData`, `phone`
2. Add `PUT /auth/onboarding` endpoint to save wizard data
3. Update `safeUser()` to return all fields
4. Add `GET /auth/me` endpoint to fetch full profile

**Frontend changes:**
1. Call `PUT /auth/onboarding` after wizard completion
2. Call `GET /auth/me` on login to restore state
3. Remove `sportsos:onboarding` from signOut clear list
4. Keep `onboardingCompleted` in localStorage as cache, restore from API on login

**Effort:** 4-6 hours  
**Risk:** Low — additive changes, no existing behavior modified

### Option B: Don't Clear Onboarding on SignOut (Quick Fix)

**Frontend only:**
1. Remove `sportsos:onboarding` from signOut's `localStorage.removeItem` list
2. Remove `sportsos:children` from signOut's clear list
3. Remove `sportsos:selected-academy` from signOut's clear list
4. Don't reset `onboardingCompleted` to `false` in signOut
5. Keep `role` in signOut reset (so guard still works)

**Problem:** Data persists across logins but is tied to the browser, not the user account. Different browsers/devices show different profiles. Shared computers leak data.

**Effort:** 15 minutes  
**Risk:** Medium — data inconsistency across devices

### Option C: Hybrid (Recommended for MVP)

**Backend changes:**
1. Add `onboardingCompleted` boolean to User model
2. Update `safeUser()` to return `phone` and `onboardingCompleted`
3. Add `PUT /auth/profile` endpoint to save onboarding completion

**Frontend changes:**
1. On wizard complete: call `PUT /auth/profile` with `onboardingCompleted: true`
2. On login: read `onboardingCompleted` from API response, not localStorage
3. Keep onboarding data in localStorage as cache (fast UI)
4. Don't clear onboarding data on signOut
5. On first login after signOut: restore profile from API

**Effort:** 2-3 hours  
**Risk:** Low — backend stores minimal data, localStorage still primary cache

---

## Estimated Effort

| Option | Effort | Risk | Data Integrity |
|--------|--------|------|----------------|
| A: Full backend persistence | 4-6 hours | Low | ✅ Perfect |
| B: Don't clear localStorage | 15 min | Medium | ⚠️ Browser-only |
| C: Hybrid (recommended) | 2-3 hours | Low | ✅ Good |

---

## Summary

The bug is **architectural, not a code mistake**. The system was designed as a localStorage-only SPA, but the auth flow (logout/login) clears all localStorage. The backend was added later but never received the onboarding/profile data fields.

**To fix properly, the backend User model must store at minimum:**
- `onboardingCompleted: Boolean`
- `phone: String` (already exists but not returned by `safeUser`)

**And the frontend must:**
- Save onboarding completion to backend
- Restore profile from backend on login
- Not clear onboarding data on signOut
