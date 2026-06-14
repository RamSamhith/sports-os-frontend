# SportsOS User Journey Audit Report

**Date:** June 14, 2026
**Scope:** Complete auth flow — Registration → OTP → Onboarding → Homepage → Profile → Logout → Login → Profile Restoration

---

## 1. User Journey Flow Diagram

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Welcome /   │────▶│    Register       │────▶│  OTP Method      │
│  Homepage    │     │  /register        │     │  /verify/method   │
│  (guest)     │     └──────────────────┘     └────────┬─────────┘
└──────┬──────┘                                        │
       │                                               ▼
       │                                     ┌──────────────────┐
       │                                     │  OTP Verify       │
       │                                     │  /verify/signup   │
       │                                     │  /verify/email    │
       │                                     │  /verify/phone    │
       │                                     └────────┬─────────┘
       │                                               │
       │                    ┌──────────────────────────┘
       │                    ▼
       │          ┌──────────────────┐     ┌──────────────────┐
       │          │  Role Selection   │────▶│  Onboarding       │
       │          │  /onboarding/role │     │  /onboarding/wizard│
       │          └──────────────────┘     └────────┬─────────┘
       │                                               │
       │                                               ▼
       │          ┌──────────────────┐     ┌──────────────────┐
       │◀─────────│    Homepage       │     │  Profile          │
       │          │  /  (authenticated)│◀───│  /profile          │
       │          └──────────────────┘     └────────┬─────────┘
       │                                               │
       │                                               ▼
       │                                     ┌──────────────────┐
       └─────────────────────────────────────│  Logout           │
                                             │  (sidebar button) │
                                             └────────┬─────────┘
                                                      │
                                                      ▼
                                             ┌──────────────────┐
                                             │  Login            │
                                             │  /login            │
                                             └────────┬─────────┘
                                                      │
                                                      ▼
                                             ┌──────────────────┐
                                             │  Profile Restore  │
                                             │  (auto via API)   │
                                             └──────────────────┘
```

### Alternate Paths

```
Register ──────────────────────────────────────▶ Homepage (if onboarding already completed)
Register ──▶ OTP Method ──▶ OTP Verify ──▶ Edit Contact ──▶ Register (loop)
OTP Verify ──▶ "Edit phone or email" ──▶ Register (with draft restored)
Login ──▶ Forgot Password ──▶ Reset Password ──▶ Login
Welcome page ──▶ AuthModal ──▶ Login/Register
```

---

## 2. Step-by-Step Analysis

### Step 1: Registration — `app/(auth)/register/page.tsx`

**What it does:** Collects user registration data (name, email, phone, password, confirm password) and creates a new account.

**Data collected:**
- `name` — Full name (text)
- `email` — Email address
- `phone` — 10-digit phone number
- `password` — Password (min 8 chars)
- `confirmPassword` — Password confirmation

**Validations (client-side):**
| Field | Rule | Line |
|-------|------|------|
| name | Required, min 2 chars | 90-94 |
| email | Required, regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` | 96-100 |
| phone | Required, exactly 10 digits (strips non-digits) | 102-109 |
| password | Required, min 8 chars | 111-115 |
| confirmPassword | Required, must match password | 117-121 |

**On success:**
1. Stores JWT token in `localStorage` (line 215)
2. Sets profile context (line 218)
3. Hydrates onboarding context from API response (lines 220-235)
4. Sets `isAuthenticated=true` (line 236)
5. Removes signup draft from `sessionStorage` (line 238)
6. Redirects to `/onboarding/role` (new user) or `/` (returning user)

**On failure:**
- Displays `res.error.message` as server error banner (line 208)

**Issues found:**
1. **No password strength validation** — only checks length, not complexity (uppercase, special chars, etc.). The reset-password page has stricter rules.
2. **Draft restoration from sessionStorage** (lines 51-66) — could leak form data if another user accesses the browser.
3. **Safety-net redirect useEffect** (lines 71-85) — complex conditional logic with multiple sessionStorage flags could cause redirect loops.
4. **No rate limiting** on client side for repeated submissions.
5. **Password sent in plaintext** over HTTPS (acceptable, but no client-side hashing).

---

### Step 2: OTP Method Selection — `app/(auth)/verify/method/page.tsx`

**What it does:** Lets the user choose how to receive OTP: Email, SMS, or WhatsApp.

**Data collected:**
- Selected method stored in `sessionStorage` as `sportsos:otp-method`
- Masked destination stored as `sportsos:otp-destination`

**Validations:**
- Must select a method before continuing (line 57, 173)

**On success:**
- Navigates to `/verify/signup` (line 62)

**Issues found:**
1. **No API call to send OTP** — `sendOtp()` from `lib/api/auth.ts` is never called. The method selection is purely cosmetic.
2. **Destination masking** could be improved — `getMaskedDestination` shows first 2 chars of email which may reveal too much for short names.
3. **No guard for unauthenticated access** — relies on `useEffect` redirect which has a flash of content.

---

### Step 3: OTP Verification — `app/(auth)/verify/signup/page.tsx`

**What it does:** Accepts a 6-digit OTP code and verifies the user.

**Validations:**
- OTP must be exactly 6 digits (enforced by `OtpInput` component)

**On success:**
- Clears signup draft from sessionStorage (line 88)
- Sets `verified=true` in auth context (line 92)
- Shows success screen with "Continue to Profile Setup" button

**On failure:**
- Shows error: `"Invalid code. Try 123456 for demo."` (line 94)
- Clears OTP input for retry

**CRITICAL Issues found:**
1. **HARDCODED OTP CODE** — `const CODE = '123456'` (line 15). Verification is done entirely client-side with a hardcoded value. Any code `123456` will pass. This is a **critical security vulnerability**.
2. **Error message reveals the bypass code** — `"Try 123456 for demo."` (line 94) explicitly tells attackers the backdoor code.
3. **No server-side verification** — `verifyOtp()` API exists but is never called.
4. **No brute-force protection** — unlimited OTP attempts with no lockout.
5. **Same pattern in all OTP pages:**
   - `verify/email/page.tsx` line 16: `const CODE = '123456'`
   - `verify/phone/page.tsx` line 16: `const CODE = '123456'`
6. **Resend cooldown** is cosmetic only — no actual OTP is resent (lines 106-110).
7. **`handleResend`** only resets UI state; no API call made.

---

### Step 4: Role Selection — `app/(auth)/onboarding/role/page.tsx`

**What it does:** Asks user to choose between "Athlete" or "Parent" role.

**Data collected:**
- `role` — `'athlete'` or `'parent'`

**Validations:**
- Must select a role before continuing (line 278)

**On success:**
1. Sets role in auth context via `setRole()` (line 119)
2. Calls `saveOnboarding({ role })` — non-blocking, fire-and-forget (line 121)
3. Navigates to `/onboarding/wizard` (line 122)

**Issues found:**
1. **`saveOnboarding` is fire-and-forget** — if backend call fails, role is lost on next page load (no error handling).
2. **No verification check** — comment says "MVP: verification check removed" (line 103), so unverified users can proceed.
3. **No back navigation** to OTP verification page.

---

### Step 5: Onboarding Wizard — `app/(auth)/onboarding/wizard/page.tsx`

**What it does:** Multi-step wizard collecting profile details based on role.

**Athlete steps:** Age → Gender → Location → Sports → Skill → Goals
**Parent steps:** Child's Name → Child's Age → Location → Sports → Skill

**Validations (per step):**
| Step | Athlete | Parent |
|------|---------|--------|
| 0 | Age: 3-80 | Child name: min 1 char |
| 1 | Gender: required | Child age: 3-18 |
| 2 | Location: min 1 char | Location: min 1 char |
| 3 | Sports: min 1 selected | Sports: min 1 selected |
| 4 | Skill: required | Skill: required |
| 5 | Goals: optional (always true) | N/A |

**On success (new user):**
1. Calls `completeOnboarding(data)` — saves to `useOnboarding` hook (line 156)
2. Calls `markAuthComplete()` — sets `onboardingCompleted=true` in auth (line 157)
3. Syncs to auth context via `setOnboarding()` (line 177)
4. Calls `saveOnboarding()` — non-blocking (line 180)
5. If parent with no children, adds first child via `addChild()` (line 197)
6. Redirects to `/` (line 204)

**Issues found:**
1. **Age input allows 0-120** in `onChange` (line 276) but `canNext` validates 3-80/3-18. User can type "999" and only gets blocked on "Next."
2. **Empty useEffect** on lines 76-78 — dead code.
3. **No maximum length** on child name, goals text fields — XSS potential if rendered without escaping.
4. **`saveOnboarding` fire-and-forget** — data may not persist to backend.
5. **Gender step uses empty string** as initial value — `gender !== ''` check works but is fragile.
6. **No loading state** shown during save operations.
7. **No error handling** if `saveOnboarding` API fails — user sees no feedback.

---

### Step 6: Homepage — `app/(public)/page.tsx`

**What it does:** Landing page with Hero, Search, Stats, Featured sections, and personalized content for authenticated users.

**Components:**
- `Hero` — Main hero section
- `SearchSection` — Search bar
- `StatsSection` — Platform statistics
- `PersonalizedHome` — Shows content based on user role/onboarding
- `FeaturedSports` — Sports grid
- `FeaturedAcademies` — Academy cards
- `FeaturedCoaches` — Coach cards
- `CtaSection` — Call to action
- `HomepageAuthModal` — Auto-shows auth modal for guests

**Issues found:**
1. **HomepageAuthModal** (lines 17-30) auto-shows after 1200ms for unauthenticated users — could be annoying for repeat visitors (dismissed per session only via sessionStorage).
2. **No personalized content** for authenticated users who haven't completed onboarding — `PersonalizedHome` may show empty state.
3. **Public route** — no auth guard, which is correct, but authenticated users with incomplete onboarding can see full homepage.

---

### Step 7: Profile — `app/(private)/profile/page.tsx`

**What it does:** Displays user profile with sport info, academy, and coaches. Protected by `PrivateGuard`.

**Data displayed:**
- Profile card with edit link (if onboarding completed)
- Matching criteria badges
- Athlete data: age, location, skill, sports, goals
- Parent data: child name, age, location, skill, sports
- Selected academy and coaches
- "No academy selected" CTA if none selected

**Issues found:**
1. **No logout button on profile page** — logout is only in `ProfileSidebar` (profile sidebar is in the layout, so it's accessible, but the main profile page card doesn't have it).
2. **No loading states** — page renders with data or null; no skeleton/spinner while data loads.
3. **`selectedAcademy` and `academyCoaches`** computed but `selectedAcademy` is only used in coach section header — could show academy info card.
4. **Missing `gender` field** in profile display — athlete profile shows age/location/skill but not gender.

---

### Step 8: Auth Provider — `components/providers/auth-provider.tsx`

**What it does:** Manages all auth state, persists to localStorage, and syncs with backend via `getMe()`.

**State managed:**
- `isAuthenticated`, `role`, `onboardingCompleted`, `verified` (PersistedAuthState)
- `profile` (name, email, phone)
- `onboarding` (age, gender, sports, skill, goals, location, children)

**Persistence:**
- Auth state: `sportsos:auth-state` in localStorage
- Profile: `sportsos:profile` in localStorage
- Onboarding: `sportsos:onboarding-data` in localStorage
- Token: `sportsos:auth-token` in localStorage

**Backend sync:**
- On mount, if `isAuthenticated`, calls `getMe()` to refresh all data (lines 174-223)
- If `getMe()` returns `UNAUTHORIZED`, clears all state (lines 214-219)

**Issues found:**
1. **Token stored in localStorage** — vulnerable to XSS. Should use httpOnly cookie for production.
2. **Auth state stored in localStorage** — `isAuthenticated` flag can be tampered with by any script.
3. **`verified` state not persisted** — only `isAuthenticated`, `role`, `onboardingCompleted` are persisted (line 11-16). `verified` resets to `false` on page reload.
4. **Race condition** — `getMe()` runs async on mount; pages may flash unauthenticated state before data loads.
5. **`signOut` doesn't call `apiLogout`** synchronously — `apiLogout().catch(() => {})` (line 300) fires but state is cleared immediately, so logout appears to work even if backend call fails.
6. **`signOut` cleanup is extensive** (lines 304-323) but misses `sportsos:onboarding` (the `useOnboarding` hook's key) — only clears `sportsos:onboarding-data`.
7. **Legacy migration** (lines 124-149) sets `onboardingCompleted: true` if legacy role exists — may incorrectly mark incomplete onboarding as complete.
8. **No token expiry check** — relies entirely on backend 401 responses.

---

### Step 9: Login — `app/(auth)/login/page.tsx`

**What it does:** Authenticates existing users with email and password.

**Validations:**
- email: Required, valid format
- password: Required, min 8 chars

**On success:**
1. Stores token in localStorage
2. Sets profile and onboarding context from API response
3. Redirects to `/` or `/onboarding/role` based on `onboardingCompleted`

**Issues found:**
1. **No "show password" toggle** — unlike `reset-password` page.
2. **No rate limiting** — unlimited login attempts.
3. **Generic error messages** — doesn't distinguish between "user not found" and "wrong password" (good for security, but no account lockout indication).
4. **`handleResend` in login is missing** — no resend functionality (correct, but the page has a "Forgot password?" link that goes to `/forgot-password` which exists).

---

### Step 10: Logout — `components/profile/profile-sidebar.tsx`

**What it does:** Clears all auth state and redirects to `/welcome`.

**Issues found:**
1. **No confirmation dialog** — accidental logout possible.
2. **`apiLogout()` is fire-and-forget** — backend refresh token may not be revoked if call fails.
3. **Redirects to `/welcome`** instead of `/` — may confuse users who expected to land on homepage.

---

### Step 11: Forgot/Reset Password

**Forgot Password** (`app/(auth)/forgot-password/page.tsx`):
- Collects email, calls `forgotPassword()` API
- Shows generic success message (doesn't reveal if email exists)
- Good security practice

**Reset Password** (`app/(auth)/reset-password/page.tsx`):
- Validates token from URL params
- Enforces strong password rules: 8+ chars, uppercase, lowercase, number
- Shows password strength indicators
- Issues:
  1. **Token passed in URL query params** — should use fragment/hash or short-lived token
  2. **No token expiry check on frontend** — relies on backend

---

## 3. Issues Found

### Critical (Must Fix)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| C1 | **Hardcoded OTP code `123456`** — verification is client-side only | `verify/signup/page.tsx:15`, `verify/email/page.tsx:16`, `verify/phone/page.tsx:16` | Any attacker can bypass email/phone verification |
| C2 | **OTP error reveals bypass code** — `"Try 123456 for demo."` | `verify/signup/page.tsx:94`, `verify/email/page.tsx:47`, `verify/phone/page.tsx:47` | Tells attackers exactly how to bypass verification |
| C3 | **No server-side OTP verification** — `verifyOtp()` API exists but is never called | All OTP pages | OTP verification is purely cosmetic |
| C4 | **`sendOtp()` API never called** — no OTP is ever sent | `verify/method/page.tsx`, `verify/signup/page.tsx` | Users receive no actual verification codes |
| C5 | **Token stored in localStorage** — accessible to any XSS attack | `auth-provider.tsx:219`, `auth.ts:215`, `client.ts:29` | Full account compromise via XSS |
| C6 | **No rate limiting** on login/registration — brute force possible | `register/page.tsx`, `login/page.tsx`, `auth-modal.tsx` | Account enumeration and credential stuffing |

### Major (Should Fix)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| M1 | **`verified` state not persisted** — resets on page reload | `auth-provider.tsx:11-16` | User must re-verify after refresh (if verification were real) |
| M2 | **`saveOnboarding()` fire-and-forget** — no error handling | `onboarding/role/page.tsx:121`, `onboarding/wizard/page.tsx:180` | Data loss if backend fails |
| M3 | **Weak password policy on registration** — only min 8 chars | `register/page.tsx:113-114` | Accounts vulnerable to weak passwords |
| M4 | **Password reset uses stronger rules than registration** — inconsistency | `reset-password/page.tsx:17-22` vs `register/page.tsx:113-114` | Confusing UX; security gap |
| M5 | **`signOut` doesn't clear all localStorage keys** — misses `sportsos:onboarding` | `auth-provider.tsx:304-323` | Stale onboarding data persists after logout |
| M6 | **Legacy migration may incorrectly mark onboarding complete** | `auth-provider.tsx:136-141` | Users may skip onboarding wizard |
| M7 | **No account lockout after failed attempts** | All auth pages | Enables brute-force attacks |
| M8 | **Auth state race condition on mount** — `getMe()` is async | `auth-provider.tsx:174-223` | Pages flash unauthenticated content |
| M9 | **Age input accepts values outside valid range** in onChange | `onboarding/wizard/page.tsx:276` | UX confusion (blocks only on "Next") |
| M10 | **No confirmation dialog for logout** | `profile-sidebar.tsx:29-31` | Accidental sign-outs |

### Minor (Nice to Fix)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| m1 | **Empty useEffect** — dead code | `onboarding/wizard/page.tsx:76-78` | Code smell |
| m2 | **No max length on child name, goals** fields | `onboarding/wizard/page.tsx:251,418` | Potential abuse |
| m3 | **Missing gender in athlete profile display** | `profile/page.tsx:95-111` | Incomplete profile view |
| m4 | **No loading states on profile page** | `profile/page.tsx` | Brief flash of empty content |
| m5 | **HomepageAuthModal dismissed per session only** | `homepage-auth-modal.tsx:34` | Repeat visitors see modal every session |
| m6 | **No "show password" on login page** | `login/page.tsx` | Minor UX inconvenience |
| m7 | **OTP destination masking could be improved** | `verify/method/page.tsx:66-73` | Short emails may reveal too much |
| m8 | **Email verification success goes to Home, not onboarding** | `verify/email/page.tsx:100-104` | May confuse new users |
| m9 | **`dangerouslySetInnerHTML` for theme bootstrap** — acceptable but worth noting | `layout.tsx:115-118` | XSS risk if `themeConfig` is compromised (low risk) |
| m10 | **Redirect to `/welcome` after logout** instead of `/` | `profile-sidebar.tsx:31` | May confuse users |

---

## 4. Security Concerns

### High Severity

1. **Bypass OTP Verification (C1-C4):** The entire OTP verification system is client-side only with a hardcoded code. An attacker can:
   - Navigate directly to `/onboarding/role` after registration (bypassing OTP entirely via the redirect in `register/page.tsx:241-245`)
   - Enter `123456` on any OTP page to pass verification
   - The `verified` state is not enforced on any route except OTP pages themselves

2. **Token in localStorage (C5):** JWT tokens stored in `localStorage` are accessible to any JavaScript running on the page. If any XSS vulnerability exists (even via third-party scripts), attackers can steal tokens.

3. **No CSRF Protection:** The API client uses `credentials: 'include'` (cookie-based refresh) but sends Bearer tokens. The refresh token flow relies on httpOnly cookies, which is good, but the access token in localStorage undermines this.

4. **No Rate Limiting (C6):** Unlimited login attempts enable brute-force attacks. Registration also has no rate limiting, allowing account enumeration.

### Medium Severity

5. **Auth State Tampering:** Since `isAuthenticated` is stored in `localStorage`, a malicious script could set it to `true` to access private routes (though API calls would still fail without a valid token).

6. **Profile Data in localStorage:** User profile (name, email, phone) is stored in plaintext in `localStorage`. If an attacker gains XSS, they can exfiltrate PII.

7. **SessionStorage for OTP Method:** OTP method and destination are stored in `sessionStorage` — accessible to same-origin scripts.

### Low Severity

8. **Email Regex:** The email validation regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` is basic. It doesn't handle edge cases like quoted strings, IP literals, or new TLDs.

9. **Phone Validation:** Only validates 10 digits — doesn't check for valid Indian mobile prefixes or country codes.

---

## 5. Recommendations

### Immediate (Critical)

1. **Implement real OTP verification:**
   - Call `sendOtp()` when user selects method on `/verify/method`
   - Call `verifyOtp()` when user enters code on `/verify/signup`
   - Remove hardcoded `CODE` constant
   - Add server-side verification before allowing role selection

2. **Move token to httpOnly cookie:**
   - Backend should set `Set-Cookie: access_token=...; HttpOnly; Secure; SameSite=Strict`
   - Remove `localStorage.setItem('sportsos:auth-token', ...)` from all files
   - Update API client to not send `Authorization` header (cookie is automatic)

3. **Add rate limiting:**
   - Implement progressive delay on failed login (e.g., 1s, 2s, 4s, 8s)
   - Add CAPTCHA after 3 failed attempts
   - Server-side rate limiting on `/auth/login` and `/auth/register`

4. **Strengthen password policy:**
   - Require uppercase, lowercase, number, and special character on registration
   - Add real-time password strength meter
   - Match the stricter rules already in `reset-password/page.tsx`

### Short-term (Major)

5. **Persist `verified` state** — add it to `PersistedAuthState` interface in `auth-provider.tsx`

6. **Add error handling to `saveOnboarding`** — show toast/snackbar if backend save fails

7. **Clear all localStorage keys on logout** — add `sportsos:onboarding` to the cleanup list in `signOut()`

8. **Fix legacy migration** — don't auto-set `onboardingCompleted: true` for legacy roles; check if wizard data exists

9. **Add loading states** — show skeleton loaders on profile page and during auth hydration

10. **Add logout confirmation** — simple "Are you sure?" dialog before signing out

### Long-term (Minor)

11. **Add CSP headers** — Content-Security-Policy to prevent XSS and data exfiltration

12. **Implement PKCE for OAuth** — if adding social login in the future

13. **Add audit logging** — track auth events (login, logout, failed attempts)

14. **Consider httpOnly cookie for profile data** — or encrypt sensitive data in localStorage

15. **Add email verification resend limit** — max 3-5 resends per hour

---

## 6. Overall Score: 42/100

| Category | Score | Max | Notes |
|----------|-------|-----|-------|
| **Authentication Flow** | 5 | 20 | Registration works but OTP is entirely fake |
| **Security** | 8 | 25 | Token in localStorage, hardcoded OTP, no rate limiting |
| **Data Validation** | 14 | 15 | Good client-side validation, minor gaps |
| **Error Handling** | 6 | 10 | Basic server errors shown; no network retry, no save failure handling |
| **UX/Accessibility** | 5 | 10 | Good animations, ARIA labels; missing loading states, confirmations |
| **State Management** | 4 | 10 | Dual localStorage systems (auth + onboarding), race conditions, lost state |
| **Code Quality** | 0 | 10 | Dead code, duplicated validation logic, fire-and-forget API calls |

### Summary

SportsOS has a well-designed UI with smooth animations and good form validation. However, the **entire OTP verification system is fake** — hardcoded codes, client-side only, no API calls. Combined with tokens stored in `localStorage` and no rate limiting, the security posture is critically weak. The state management has multiple edge cases (lost `verified` flag, incomplete logout cleanup, legacy migration bugs) that will cause bugs in production.

**Priority fix:** Replace the fake OTP system with real server-side verification and move tokens to httpOnly cookies. These two changes alone would raise the score to ~65/100.

---

*Report generated by code audit — verify findings against current codebase before implementing fixes.*
