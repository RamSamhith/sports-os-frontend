# AUTH, VERIFICATION & OTP AUDIT

**Status:** MULTIPLE ROOT CAUSES FOUND  
**Generated:** 2026-06-13

---

## Executive Summary

There are **5 distinct root causes** across backend and frontend:

1. **Backend User model is missing critical fields** (`isVerified`, `onboardingCompleted`, `preferences`, `consent`, `themePreference`)
2. **Backend login returns incomplete user data** (missing `verified`, `onboardingCompleted`, `phone`)
3. **Frontend OTP verification is entirely mocked** (hardcoded `123456`, no API call)
4. **No email/SMS service is installed or configured** (TODO comments only)
5. **Frontend never syncs `verified` state with backend**

---

## TASK 1: Verification Flow Audit

### 1.1 Two Competing Backend Codebases

| Codebase | Location | Status |
|----------|----------|--------|
| `sportsOS-nodejs` | `sportsOS-nodejs/` | **ACTIVE** — mounted in production |
| `sports-os-backend` | `sports-os-backend/` | **UNUSED** — reference/legacy |

The active backend (`sportsOS-nodejs`) has a **simplified** auth system that dropped most of the features from the reference backend.

### 1.2 Backend User Model Comparison

| Field | `sports-os-backend` (reference) | `sportsOS-nodejs` (active) |
|-------|--------------------------------|---------------------------|
| `isVerified` | ✅ `{ type: Boolean, default: false }` | **MISSING** |
| `phoneVerified` | ✅ `{ type: Boolean, default: false }` | **MISSING** |
| `onboardingCompleted` | ✅ `{ type: Boolean, default: false }` | **MISSING** |
| `preferences` | ✅ Full object | **MISSING** |
| `consent` | ✅ `{ analytics, marketing, whatsapp }` | **MISSING** |
| `themePreference` | ✅ String | **MISSING** |
| `phone` | ✅ String | ✅ String |
| `role` | ✅ Enum | ✅ Enum |

**Impact:** The active backend cannot track whether a user is verified, has completed onboarding, or has any preferences.

### 1.3 Backend Auth Controller vs Auth Service

| Component | File | Mounted? | Features |
|-----------|------|----------|----------|
| `authController.js` | `sportsOS-nodejs/controllers/authController.js` | **YES** at `/auth` | Register, Login only |
| `authService.js` | `sportsOS-nodejs/services/authService.js` | **NO** — unused | Register, Login, OTP, Verify, Onboarding, Refresh, Preferences, Consent, Theme |

The `authService.js` exists with full OTP logic but is **never imported or used** by the active backend. The mounted `authController.js` has only 2 routes:

- `POST /auth/register` — creates user, returns token
- `POST /auth/login` — validates credentials, returns token

**Missing routes (exist in `authService.js` but NOT in `authController.js`):**
- `POST /auth/send-otp`
- `POST /auth/verify-otp`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`
- `POST /auth/verify-phone`
- `POST /auth/complete-onboarding`
- `POST /auth/refresh-token`
- `POST /auth/logout`
- `GET /auth/me`
- `PUT /auth/preferences`
- `PUT /auth/consent`
- `PUT /auth/theme`

### 1.4 Backend Login Flow Analysis

`authController.js:68-93` — Login endpoint:

```js
// No isVerified check
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(401)...;

const token = generateToken(user);
res.json(ok({ token, user: safeUser(user) }));
```

**Problems:**
1. **No `isVerified` check** — unverified users can log in
2. **`safeUser()` returns only** `{ id, name, email, role }` — missing `phone`, `verified`, `onboardingCompleted`, `preferences`, `consent`, `themePreference`

### 1.5 Backend Register Flow Analysis

`authController.js:30-65` — Register endpoint:

```js
const user = await User.create({
    name, email, password: hashedPassword, phone, role: 'athlete'
});
const token = generateToken(user);
res.status(201).json(ok({ token, user: safeUser(user) }));
```

**Problems:**
1. **No OTP generated** — reference backend generates OTP and stores in OTP collection
2. **No `isVerified: false` set** — field doesn't exist in schema
3. **No `onboardingCompleted: false` set** — field doesn't exist in schema
4. **Returns token immediately** — user is "logged in" without any verification

### 1.6 Frontend Auth State Management

`components/providers/auth-provider.tsx` — AuthProvider:

Auth state is **entirely localStorage-based**:

```ts
interface PersistedAuthState {
  isAuthenticated: boolean;    // set to true after login/register
  role: OnboardingRole | null; // set during onboarding
  onboardingCompleted: boolean; // set after role selection
  verified: boolean;           // set after OTP verification
}
```

**Critical issue:** The `verified` flag is a **frontend-only localStorage value**. It is:
- Set to `true` by `setVerified(true)` in OTP pages
- Never synced with backend's `isVerified` field
- Lost on cache clear / incognito / different browser
- Not present in the backend's login response

### 1.7 Frontend Login Flow

`app/(auth)/login/page.tsx:125-153`:

```ts
const res = await apiLogin({ email, password });
// Store token
localStorage.setItem('sportsos:auth-token', res.data.token);
setProfile({ name: res.data.user.name, email: res.data.user.email, phone: '' });
setAuth(true);
router.replace('/');
```

**Problems:**
1. **Phone is hardcoded to `''`** — backend doesn't return it
2. **`verified` is never set from backend response** — `setAuth(true)` only sets `isAuthenticated`
3. **No redirect to verification** — login always goes to `/`
4. **No `/auth/me` call** — profile data is whatever the login response returns

### 1.8 Frontend Register Flow

`app/(auth)/register/page.tsx:205-252`:

```ts
const res = await apiRegister({ name, email, password, phone });
localStorage.setItem('sportsos:auth-token', res.data.token);
setProfile({ name: res.data.user.name, email: res.data.user.email, phone: phone.trim() });
setAuth(true);
```

**Same problems as login** — no verification state set, no redirect to OTP.

### 1.9 Route Guards

| Guard | File | Checks | Redirects to |
|-------|------|--------|-------------|
| `PrivateGuard` | `components/auth/private-guard.tsx` | `isAuthenticated`, `verified`, `onboardingCompleted` | `/welcome`, `/verify/method`, `/onboarding/role` |
| Login page effect | `app/(auth)/login/page.tsx:50-59` | `isAuthenticated`, `verified`, `onboardingCompleted` | `/` (if fully onboarded) |
| Register page effect | `app/(auth)/register/page.tsx:78-102` | `isAuthenticated`, `verified`, `onboardingCompleted` | `/verify/method`, `/onboarding/role`, `/` |
| Role page effect | `app/(auth)/onboarding/role/page.tsx:102-112` | `isAuthenticated`, `verified` | `/login`, `/verify/method` |
| Verify method effect | `app/(auth)/verify/method/page.tsx:50-63` | `isAuthenticated`, `verified`, `onboardingCompleted` | `/register`, `/`, `/onboarding/role` |
| Verify signup effect | `app/(auth)/verify/signup/page.tsx:68-81` | `isAuthenticated`, `authVerified`, `onboardingCompleted` | `/verify/method`, `/`, `/onboarding/role` |

**The guard logic is correct** — it checks `verified` from localStorage. The problem is that `verified` is never set to `true` after a real backend login (only after mock OTP).

### 1.10 Why Verified Users Are Redirected to Verification Again

**Root cause chain:**

1. User registers → frontend sets `isAuthenticated: true`, `verified: false`
2. User goes to `/verify/method` → selects OTP method → goes to `/verify/signup`
3. User enters `123456` → frontend sets `verified: true` in localStorage
4. **User clears cache / uses incognito / different browser** → `verified: false` again
5. User logs in → backend returns token + `{ id, name, email, role }` (no `verified` field)
6. Frontend sets `isAuthenticated: true` but **never sets `verified: true`**
7. `PrivateGuard` checks `verified` → `false` → redirects to `/verify/method`

**Alternative scenario (no OTP ever completed):**
1. User registers → frontend sets `isAuthenticated: true`, `verified: false`
2. Frontend redirects to `/verify/method` (from register page effect)
3. User enters `123456` → `verified: true` in localStorage
4. Later login → `verified` is `false` (new session) → redirected to verification again

---

## TASK 2: OTP Email Audit

### 2.1 Email Service Status: **NOT IMPLEMENTED**

| Check | Result |
|-------|--------|
| Nodemailer in `package.json` | ❌ Not installed |
| Resend in `package.json` | ❌ Not installed |
| SendGrid in `package.json` | ❌ Not installed |
| Any email service in `package.json` | ❌ None |
| Email service file exists | ❌ No files found |
| SMTP env vars configured | ❌ None |
| Backend TODO comment | ✅ Line 52: `// TODO: Send OTP to user's email via email service` |
| Backend TODO comment | ✅ Line 116: `// TODO: Send OTP to user's email` |

### 2.2 Frontend OTP Email Flow

`app/(auth)/verify/email/page.tsx:39-51`:

```ts
const CODE = '123456'; // hardcoded

const handleVerify = useCallback(async (code: string) => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 1200)); // fake delay
    if (code === CODE) {
        setAuthVerified(true); // marks verified in localStorage
        setVerified(true);
    } else {
        setError('Invalid code. Try 123456 for demo.');
    }
}, [setAuthVerified]);
```

**No API call is made.** The OTP verification is entirely client-side with a hardcoded code.

### 2.3 Missing Environment Variables for Email

| Variable | Purpose | Status |
|----------|---------|--------|
| `SMTP_HOST` | SMTP server host | Not defined |
| `SMTP_PORT` | SMTP server port | Not defined |
| `SMTP_USER` | SMTP username | Not defined |
| `SMTP_PASS` | SMTP password | Not defined |
| `SMTP_FROM` | Sender email address | Not defined |
| `RESEND_API_KEY` | Resend API key | Not defined |
| `SENDGRID_API_KEY` | SendGrid API key | Not defined |

---

## TASK 3: OTP SMS Audit

### 3.1 SMS Service Status: **NOT IMPLEMENTED**

| Check | Result |
|-------|--------|
| Twilio in `package.json` | ❌ Not installed |
| MSG91 in `package.json` | ❌ Not installed |
| Any SMS service in `package.json` | ❌ None |
| SMS service file exists | ❌ No files found |
| SMS env vars configured | ❌ None |
| Backend TODO comment | ✅ Line 163: `// TODO: Send OTP via SMS / WhatsApp gateway` |

### 3.2 Frontend OTP SMS Flow

`app/(auth)/verify/phone/page.tsx:39-51`:

```ts
const CODE = '123456'; // hardcoded

const handleVerify = useCallback(async (code: string) => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 1200)); // fake delay
    if (code === CODE) {
        setAuthVerified(true);
        setVerified(true);
    } else {
        setError('Invalid code. Try 123456 for demo.');
    }
}, [setAuthVerified]);
```

**Identical to email** — no API call, hardcoded code.

### 3.3 Missing Environment Variables for SMS

| Variable | Purpose | Status |
|----------|---------|--------|
| `TWILIO_ACCOUNT_SID` | Twilio account SID | Not defined |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | Not defined |
| `TWILIO_PHONE_NUMBER` | Twilio sender number | Not defined |
| `MSG91_API_KEY` | MSG91 API key | Not defined |
| `MSG91_TEMPLATE_ID` | MSG91 template ID | Not defined |

---

## TASK 4: Profile Population Audit

### 4.1 Login Response Analysis

Backend `authController.js` `safeUser()` function:

```js
function safeUser(user) {
    return { id: user.id || user._id, name: user.name, email: user.email, role: user.role };
}
```

**Missing fields returned to frontend:**
- `phone` — not returned
- `verified` / `isVerified` — not returned
- `onboardingCompleted` — not returned
- `preferences` — not returned (doesn't exist in model)
- `consent` — not returned (doesn't exist in model)
- `themePreference` — not returned (doesn't exist in model)

### 4.2 Frontend Profile State

`components/providers/auth-provider.tsx`:

```ts
interface PersistedProfile {
    name: string;
    email: string;
    phone: string;
}
```

Profile only stores `name`, `email`, `phone`. After login:

```ts
setProfile({ name: res.data.user.name, email: res.data.user.email, phone: '' });
```

Phone is hardcoded to `''` because the backend doesn't return it.

### 4.3 Profile Page Data Sources

`app/(private)/profile/page.tsx`:

| Data | Source | Status |
|------|--------|--------|
| `role` | `useAuth()` → localStorage | Works (if onboarding completed) |
| `athleteData` / `parentData` | `useOnboarding()` → localStorage | Works (if onboarding completed) |
| `activeChild` | `useChildren()` → localStorage | Works |
| `selectedAcademyId` | `useAcademySelection()` → localStorage | Works |
| `academies` | `data/academies` (static) | Works (hardcoded) |
| `coaches` | `data/coaches` (static) | Works (hardcoded) |
| `name`, `email`, `phone` | `useAuth()` → localStorage | **Stale/empty** — only set from login response |

### 4.4 Why Profile Doesn't Auto-Populate

1. **Login returns only `{ id, name, email, role }`** — no phone, no preferences
2. **Frontend sets phone to `''`** — hardcoded empty string
3. **No `/auth/me` endpoint exists** — frontend has `getMe()` in `lib/api/auth.ts` but backend doesn't implement it
4. **No profile refresh on page load** — auth state is purely localStorage
5. **Profile page uses static `data/` for academies/coaches** — not from API

### 4.5 Frontend API Functions vs Backend Routes

| Frontend API | Backend Route | Status |
|-------------|---------------|--------|
| `register()` → `POST /auth/register` | ✅ Exists | Works (but returns incomplete data) |
| `login()` → `POST /auth/login` | ✅ Exists | Works (but returns incomplete data) |
| `sendOtp()` → `POST /auth/send-otp` | ❌ Missing | Will fail with 404 |
| `verifyOtp()` → `POST /auth/verify-otp` | ❌ Missing | Will fail with 404 |
| `logout()` → `POST /auth/logout` | ❌ Missing | Will fail with 404 |
| `getMe()` → `GET /auth/me` | ❌ Missing | Will fail with 404 |

---

## 6. All Missing Backend Routes

### Auth routes (referenced by frontend but not implemented):

| Route | Frontend Call | Backend Status |
|-------|--------------|----------------|
| `POST /auth/send-otp` | `sendOtp()` | **Missing** |
| `POST /auth/verify-otp` | `verifyOtp()` | **Missing** |
| `GET /auth/me` | `getMe()` | **Missing** |
| `POST /auth/logout` | `logout()` | **Missing** |
| `POST /auth/forgot-password` | (not called) | **Missing** |
| `POST /auth/reset-password` | (not called) | **Missing** |
| `POST /auth/refresh-token` | (not called) | **Missing** |

### Other missing routes:

| Route | Frontend Call | Backend Status |
|-------|--------------|----------------|
| `GET /sports` | `listSports()` | **Missing** |
| `GET /sports/:slug` | `getSport()` | **Missing** |
| `GET /recommendations/*` | Various | **Missing** |
| `GET /favorites/*` | Various | **Missing** |
| `GET /children/*` | Various | **Missing** |
| `GET /users/*` | Various | **Missing** |

---

## 7. Files Involved

### Backend (active — `sportsOS-nodejs`)

| File | Issue |
|------|-------|
| `models/User.js` | Missing `isVerified`, `phoneVerified`, `onboardingCompleted`, `preferences`, `consent`, `themePreference` fields |
| `controllers/authController.js` | No OTP, no `isVerified` check, incomplete `safeUser()`, missing routes |
| `services/authService.js` | Full OTP logic exists but is **never used** — not mounted |
| `middleware/authMiddleware.js` | Works correctly (JWT verification) |
| `index.js` | Only mounts `authController` — doesn't mount `authService` routes |
| `package.json` | No email/SMS dependencies |

### Backend (reference — `sports-os-backend`)

| File | Notes |
|------|-------|
| `models/index.js` | Complete User schema with all fields |
| `services/authService.js` | Full auth logic with OTP (reference only) |

### Frontend

| File | Issue |
|------|-------|
| `components/providers/auth-provider.tsx` | Auth state is localStorage-only, never synced with backend |
| `lib/hooks/use-auth.ts` | Defines `verified` as frontend-only flag |
| `lib/api/auth.ts` | Defines `sendOtp()`, `verifyOtp()`, `getMe()` — backend doesn't implement them |
| `app/(auth)/login/page.tsx` | Doesn't set `verified` from backend, hardcodes phone to `''` |
| `app/(auth)/register/page.tsx` | Same issues as login |
| `app/(auth)/verify/signup/page.tsx` | Hardcoded `CODE = '123456'`, no API call |
| `app/(auth)/verify/email/page.tsx` | Hardcoded `CODE = '123456'`, no API call |
| `app/(auth)/verify/phone/page.tsx` | Hardcoded `CODE = '123456'`, no API call |
| `app/(auth)/verify/method/page.tsx` | Works correctly (method selection) |
| `app/(auth)/onboarding/role/page.tsx` | Works correctly (role selection) |
| `components/auth/private-guard.tsx` | Works correctly (checks localStorage flags) |
| `components/auth/auth-modal.tsx` | Uses mock login (setTimeout), no API call |
| `app/(private)/profile/page.tsx` | Uses static data, not API |

---

## 8. Recommended Fixes

### Priority 0 — Backend User Model (CRITICAL)

**File:** `sportsOS-nodejs/models/User.js`

Add missing fields:
- `isVerified` (Boolean, default: false)
- `phoneVerified` (Boolean, default: false)
- `onboardingCompleted` (Boolean, default: false)
- `preferences` (Object)
- `consent` (Object)
- `themePreference` (String)

**Effort:** 30 minutes

### Priority 0 — Backend Auth Controller (CRITICAL)

**File:** `sportsOS-nodejs/controllers/authController.js`

1. Add `isVerified` check to login (reject unverified users OR return verification state)
2. Expand `safeUser()` to include `phone`, `verified`, `onboardingCompleted`
3. Add `GET /auth/me` endpoint (returns full user from JWT)
4. Add `POST /auth/send-otp` endpoint
5. Add `POST /auth/verify-otp` endpoint
6. Add `POST /auth/logout` endpoint

**Effort:** 2-3 hours

### Priority 0 — Backend OTP Model (CRITICAL)

**File:** `sportsOS-nodejs/models/OTP.js` (create new)

The `authService.js` references `require('../models/OTP')` but the file doesn't exist.

**Effort:** 15 minutes

### Priority 1 — Email Service (HIGH)

**Files to create:**
- `sportsOS-nodejs/services/emailService.js`
- Install `nodemailer` or `resend` in `sportsOS-nodejs/package.json`

**Env vars needed:**
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- OR `RESEND_API_KEY`

**Effort:** 2-3 hours

### Priority 1 — SMS Service (HIGH)

**Files to create:**
- `sportsOS-nodejs/services/smsService.js`
- Install `twilio` or `@msg91/msg91` in `sportsOS-nodejs/package.json`

**Env vars needed:**
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- OR `MSG91_API_KEY`, `MSG91_TEMPLATE_ID`

**Effort:** 2-3 hours

### Priority 1 — Frontend OTP Verification (HIGH)

**Files to modify:**
- `app/(auth)/verify/signup/page.tsx` — replace hardcoded `123456` with `sendOtp()` + `verifyOtp()` API calls
- `app/(auth)/verify/email/page.tsx` — same
- `app/(auth)/verify/phone/page.tsx` — same
- `app/(auth)/forgot-password/page.tsx` — same

**Effort:** 2-3 hours

### Priority 1 — Frontend Login Profile Fix (HIGH)

**Files to modify:**
- `app/(auth)/login/page.tsx` — after login, call `getMe()` to fetch full profile, set `verified` from response
- `app/(auth)/register/page.tsx` — same
- `components/providers/auth-provider.tsx` — add `setVerified` call when backend returns `isVerified: true`

**Effort:** 1-2 hours

### Priority 2 — Frontend Auth Modal (MEDIUM)

**File:** `components/auth/auth-modal.tsx`

The `LoginView` and `RegisterView` components use `setTimeout` instead of API calls. Need to wire up `apiLogin()` and `apiRegister()`.

**Effort:** 1-2 hours

### Priority 2 — Backend Mount Additional Auth Routes (MEDIUM)

**File:** `sportsOS-nodejs/index.js`

Either:
- Mount `authService.js` routes, OR
- Expand `authController.js` with the missing endpoints

**Effort:** 30 minutes

---

## 9. Severity Levels

| Issue | Severity | Impact |
|-------|----------|--------|
| Backend User model missing `isVerified` | **CRITICAL** | Cannot track verification state |
| Backend login doesn't return `verified` | **CRITICAL** | Frontend always sees `verified: false` |
| Backend has no OTP routes | **CRITICAL** | OTP verification impossible |
| OTP model doesn't exist | **CRITICAL** | `authService.js` will crash if used |
| Frontend OTP is hardcoded `123456` | **HIGH** | Security vulnerability — anyone can verify |
| No email service installed | **HIGH** | OTP emails cannot be sent |
| No SMS service installed | **HIGH** | OTP SMS cannot be sent |
| Frontend never syncs `verified` with backend | **HIGH** | Verified users forced to re-verify |
| Login returns incomplete user data | **HIGH** | Profile shows empty fields |
| Auth modal uses mock login | **MEDIUM** | Modal login doesn't actually authenticate |
| No `/auth/me` endpoint | **MEDIUM** | Cannot refresh profile from backend |
| `authService.js` is unused | **LOW** | Dead code — should be integrated or removed |

---

## 10. Summary

| Task | Finding |
|------|---------|
| Why verified users are re-directed to verification | `verified` is a frontend-only localStorage flag, never set from backend login response |
| Whether verification state is persisted in DB | **NO** — `isVerified` field doesn't exist in active backend's User model |
| Whether login response contains verification state | **NO** — `safeUser()` returns only `{ id, name, email, role }` |
| Whether route guards use wrong conditions | **NO** — guards correctly check `verified` from localStorage; the problem is that `verified` is never set |
| Is email OTP implemented | **NO** — hardcoded `123456`, no API call, no email service |
| Is SMS OTP implemented | **NO** — hardcoded `123456`, no API call, no SMS service |
| Why OTP emails not arriving | No email service installed, backend has TODO comment only |
| Why OTP SMS not arriving | No SMS service installed, backend has TODO comment only |
| Why profile doesn't auto-populate | Backend returns incomplete user data, frontend hardcodes phone to `''`, no `/auth/me` endpoint |
