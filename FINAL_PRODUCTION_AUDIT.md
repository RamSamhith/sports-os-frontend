# FINAL PRODUCTION READINESS AUDIT

**Date:** 2026-06-13
**Branch:** mvp-auth-simplification
**Last commit:** `b7193f0` (Phase P2-D)
**TypeScript:** 0 errors | **ESLint:** 0 warnings | **Build:** 79 pages OK

---

## Executive Summary

SportsOS has undergone four production hardening phases (P2-A through P2-D) covering data persistence, session management, email infrastructure, and observability. The application has a solid security baseline (helmet, mongo-sanitize, rate limiting, bcrypt, httpOnly refresh tokens, audit logging, Sentry integration).

However, this audit identified **70 findings** across frontend, backend, security, and configuration. Of these, **5 are P0 launch blockers** that must be resolved before any production deployment.

### Verdict: NO-GO

**5 P0 blockers prevent launch.** Estimated fix effort: 1-2 days for a focused developer.

---

## Finding Summary

| Severity | Count | Action Required |
|----------|-------|-----------------|
| **P0** | 5 | Launch blockers — must fix before any deployment |
| **P1** | 18 | Must fix before production traffic |
| **P2** | 27 | Should fix soon after launch |
| **P3** | 20 | Nice to have / backlog |
| **Total** | **70** | |

---

## P0 — LAUNCH BLOCKERS

### P0-01: Privilege Escalation via Onboarding Endpoint
- **Risk:** Any user can POST `{ "role": "admin" }` to `/auth/onboarding` and gain full admin access
- **File:** `sportsOS-nodejs/controllers/authController.js:385`
- **Fix:** Remove `role` from onboarding update fields, or restrict to admin-only endpoint
- **Effort:** 10 minutes

### P0-02: CORS Allows All Origins When ALLOWED_ORIGINS Is Empty
- **Risk:** Any website can make authenticated API calls on behalf of logged-in users
- **File:** `sportsOS-nodejs/index.js:67`
- **Fix:** Fail startup in production if `ALLOWED_ORIGINS` is not set; never fall back to `origin: true`
- **Effort:** 15 minutes

### P0-03: `fix.js` Contains Hardcoded JWT Secret and Insecure Templates
- **Risk:** Hardcoded secret `sportsossecretkey123` in VCS history; accidental execution overwrites secure controllers with vulnerable versions
- **File:** `sportsOS-nodejs/fix.js:438`
- **Fix:** Delete `fix.js` from repo; rotate JWT secret; purge from git history with BFG
- **Effort:** 30 minutes

### P0-04: Client-Side Admin Role Check (Trivially Spoofable)
- **Risk:** Admin role determined by decoding JWT client-side; user can craft token with `role: "admin"` in localStorage
- **File:** `components/auth/admin-guard.tsx:12`
- **Fix:** Remove client-side JWT decode; verify admin role via server API call (`GET /auth/me`)
- **Effort:** 30 minutes

### P0-05: Missing Content-Security-Policy Header
- **Risk:** No CSP = XSS attacks can steal localStorage tokens and hijack accounts
- **File:** `next.config.mjs:31-69`
- **Fix:** Add CSP header (start with report-only to avoid breaking changes)
- **Effort:** 1 hour

---

## P1 — MUST FIX BEFORE PRODUCTION

### P1-01: No Pagination Cap on List Endpoints
- **Risk:** Memory exhaustion via `?pageSize=999999999`
- **Files:** `sportsOS-nodejs/controllers/academyController.js:15`, `coachController.js:13`, `athleteController.js:9`
- **Fix:** Clamp pageSize to max 100

### P1-02: Missing Rate Limiting on Token Refresh
- **Risk:** Refresh token brute-force
- **File:** `sportsOS-nodejs/controllers/authController.js:233`
- **Fix:** Add rate limiter (10 req/15min/IP)

### P1-03: Missing Rate Limiting on All Public Read Endpoints
- **Risk:** Data scraping, DDoS
- **Files:** All athlete, academy, coach, shortlist controllers
- **Fix:** Add global rate limiter (100 req/15min/IP)

### P1-04: Missing Indexes on Frequently Queried Fields
- **Risk:** Query performance degradation
- **Files:** `models/Academy.js` (status, sportsOffered), `Coach.js` (status, sportsCoached, academyId), `Enquiry.js` (userId), `Athlete.js` (sport, goalType)
- **Fix:** Add compound indexes

### P1-05: No ObjectId Validation on Route Parameters
- **Risk:** Mongoose CastError noise, potential abuse
- **Files:** All controllers with `:id` params
- **Fix:** Add `mongoose.Types.ObjectId.isValid()` check

### P1-06: Password Complexity Inconsistent Between Register and Reset
- **Risk:** Weak passwords allowed on registration
- **File:** `sportsOS-nodejs/controllers/authController.js:160-163`
- **Fix:** Apply `validatePassword()` to registration endpoint

### P1-07: No Email Format Validation
- **Risk:** Invalid data stored, storage abuse
- **Files:** `authController.js:155`, `enquiryController.js:29`
- **Fix:** Add email regex validation

### P1-08: User Account Status Not Checked on Login/Refresh
- **Risk:** Banned users retain access
- **File:** `authController.js:208,265`
- **Fix:** Add `isActive` field to User model; check on login and refresh

### P1-09: Health Endpoint Exposes Internal Info Without Auth
- **Risk:** Information disclosure
- **File:** `sportsOS-nodejs/controllers/healthController.js:25-43`
- **Fix:** Add auth to `/health/detailed` or limit exposed fields

### P1-10: `dangerouslyAllowSVG: true` in Image Config
- **Risk:** SSRF/XSS via SVG through image optimizer
- **File:** `next.config.mjs:24`
- **Fix:** Set to `false`

### P1-11: Wildcard `remotePatterns` Allows Any HTTPS Hostname
- **Risk:** SSRF via image optimizer
- **File:** `next.config.mjs:27-29`
- **Fix:** Restrict to known image domains

### P1-12: Missing SEO Metadata on Auth Pages
- **Risk:** Poor social sharing, no page titles
- **Files:** All `app/(auth)/*` pages
- **Fix:** Refactor to server components with metadata exports

### P1-13: Missing SEO Metadata on Dynamic Pages
- **Risk:** Academy/coach pages invisible to search engines
- **Files:** `app/(public)/academies/[slug]/page.tsx`, `coaches/[slug]/page.tsx`
- **Fix:** Add `generateMetadata` with entity data

### P1-14: Sitemap Missing Dynamic Routes
- **Risk:** SEO — search engines can't discover academy/coach pages
- **File:** `app/sitemap.ts`
- **Fix:** Fetch slugs from API, include all public routes

### P1-15: No Request Timeout Middleware
- **Risk:** Slowloris-style DoS
- **File:** `sportsOS-nodejs/index.js`
- **Fix:** Add `express-timeout-handler` (30s timeout)

### P1-16: Enquiry Controller Uses Inline JWT Instead of Middleware
- **Risk:** Code drift, maintenance risk
- **File:** `sportsOS-nodejs/controllers/enquiryController.js:35-43`
- **Fix:** Use `protect` middleware

### P1-17: No Email Verification on Registration
- **Risk:** Account impersonation with fake emails
- **File:** `authController.js:151-196`
- **Fix:** Implement email verification flow (future phase)

### P1-18: Registration Endpoint Enumerates Existing Emails
- **Risk:** User enumeration (409 "Email already registered")
- **File:** `authController.js:166-168`
- **Fix:** Return generic message like forgot-password does

---

## P2 — SHOULD FIX SOON

| # | Finding | File | Fix |
|---|---------|------|-----|
| 1 | `console.warn/error` in emailService bypasses structured logger | `services/emailService.js:10,29,43,49` | Replace with `logger.warn/error` |
| 2 | `console.error` in auditService bypasses structured logger | `services/auditService.js:15` | Replace with `logger.error` |
| 3 | Duplicate index on RefreshToken (`unique` + `index`) | `models/RefreshToken.js:4` | Remove redundant `index: true` |
| 4 | Athlete POST doesn't validate age/goalType/distanceKm | `controllers/athleteController.js:78` | Apply consistent validation |
| 5 | Academy POST lacks comprehensive body validation | `controllers/academyController.js:69-88` | Add field validation |
| 6 | Coach POST lacks comprehensive body validation | `controllers/coachController.js:65-83` | Add field validation |
| 7 | Enquiry POST doesn't validate email/phone format | `controllers/enquiryController.js:29-31` | Add format validation |
| 8 | Shortlist POST doesn't validate `itemId` as ObjectId | `controllers/shortlistController.js:50` | Validate ObjectId |
| 9 | `GET /enquiries` returns all records without pagination | `controllers/enquiryController.js:77-83` | Add pagination |
| 10 | `helmet()` used without custom CSP | `sportsOS-nodejs/index.js:63` | Configure CSP explicitly |
| 11 | JWT payload contains email in cleartext | `authController.js:77` | Remove email from JWT |
| 12 | Logger `sanitizeMeta` only strips top-level fields | `utils/logger.js:32-45` | Implement recursive sanitization |
| 13 | `emailService` has no retry logic | `services/emailService.js:26-51` | Add exponential backoff |
| 14 | Register page missing `try/catch` around API call | `app/(auth)/register/page.tsx:200` | Add error handling |
| 15 | Onboarding save failures silently swallowed | `app/(auth)/onboarding/role/page.tsx:121` | Show toast on failure |
| 16 | `console.log` version banner in production | `lib/version.ts:47` | Guard with NODE_ENV check |
| 17 | Missing `loading.tsx` in route segments | `app/(auth)/`, `app/(public)/`, etc. | Add loading skeletons |
| 18 | Missing `error.tsx` in route segments | `app/(public)/`, `app/(private)/` | Add error boundaries |
| 19 | `NEXT_PUBLIC_API_URL` fallback to empty string | `lib/api/client.ts:24` | Throw if not set |
| 20 | No env var validation at startup (frontend) | `lib/api/client.ts`, `config/env.ts` | Add Zod validation |
| 21 | Provider nesting depth (10 levels) | `app/layout.tsx:137-162` | Merge related providers |
| 22 | Unused `verified` variable in auth pages | Multiple auth pages | Remove dead code |
| 23 | `stack` field in uncaughtException logs | `sportsOS-nodejs/index.js:103` | Redact stack in logger |
| 24 | No CSRF protection for refresh cookie | `sportsOS-nodejs/index.js` | Consider sameSite: 'strict' |
| 25 | Legacy `authService.js` with 7d token expiry | `services/authService.js:71` | Delete or consolidate |
| 26 | Backend `.gitignore` doesn't cover `.env.*` variants | `sportsOS-nodejs/.gitignore` | Add `.env*` pattern |
| 27 | Enquiry `findAll()` returns all records unbounded | `repositories/enquiryRepository.js:12-14` | Add pagination |

---

## P3 — NICE TO HAVE

| # | Finding | File |
|---|---------|------|
| 1 | `node-fetch` may be unnecessary (Node 18+ has fetch) | `sportsOS-nodejs/package.json:27` |
| 2 | No test suite | `sportsOS-nodejs/package.json:8` |
| 3 | `requestId.js` accepts unsanitized client IDs | `middleware/requestId.js:4-5` |
| 4 | Logger uses console as transport only | `utils/logger.js:23-29` |
| 5 | No HTTPS enforcement middleware | `sportsOS-nodejs/index.js` |
| 6 | `academyRepository.deleteAll` unused dangerous export | `repositories/academyRepository.js:97-99` |
| 7 | `coachRepository.deleteAll` unused dangerous export | `repositories/coachRepository.js:84-86` |
| 8 | `shortlistRepository.removeAllByUser` unused | `repositories/shortlistRepository.js:20-22` |
| 9 | No CORS preflight cache (`Access-Control-Max-Age`) | `sportsOS-nodejs/index.js:66-69` |
| 10 | DNS hardcoded to Google Public DNS | `sportsOS-nodejs/index.js:1` |
| 11 | Refresh rotation doesn't revoke sibling tokens | `authController.js:271-278` |
| 12 | No HSTS header on backend | `sportsOS-nodejs/index.js:63` |
| 13 | `suppressHydrationWarning` masks real mismatches | `app/layout.tsx:113` |
| 14 | Missing `aria-label` on password toggle buttons | `app/(auth)/reset-password/page.tsx:212-250` |
| 15 | Inter font loaded but Geist is primary | `app/layout.tsx:27-34` |
| 16 | Dead `useEffect` in wizard page | `app/(auth)/onboarding/wizard/page.tsx:76-78` |
| 17 | Inconsistent `router.replace` vs `router.push` | Multiple auth pages |
| 18 | `BUILD_HASH` uses `Date.now()` (non-deterministic) | `next.config.mjs:10-13` |
| 19 | Sitemap `lastModified` always "now" | `app/sitemap.ts:5` |
| 20 | `config/site.ts` has empty `sameAs` array | `config/site.ts:12` |

---

## Category Scores

| Category | Score | Notes |
|----------|-------|-------|
| **Authentication** | 7/10 | P0 privilege escalation; P1 password inconsistency; P1 email enumeration |
| **Session Management** | 9/10 | Refresh rotation solid; httpOnly cookies; server-side logout |
| **Email Infrastructure** | 8/10 | Resend integration working; no retry logic; no email verification |
| **Monitoring** | 8/10 | Sentry + audit logging + health endpoints; no CSP; stack traces in logs |
| **Logging** | 7/10 | Structured logger; some console.warn bypasses; sanitize incomplete |
| **Health Checks** | 7/10 | Endpoints exist; detailed endpoint leaks info without auth |
| **Frontend Security** | 5/10 | No CSP; localStorage token; spoofable admin guard; open image proxy |
| **Backend Security** | 6/10 | P0 CORS; P0 privilege escalation; missing rate limits on reads |
| **Input Validation** | 6/10 | Auth endpoints good; academy/coach/athlete/validation incomplete |
| **Data Persistence** | 8/10 | Backend source of truth; refresh tokens in DB; missing indexes |
| **API Integration** | 8/10 | Error handling good; retry queue for token refresh; no retry for emails |
| **Environment Config** | 7/10 | Most vars documented; no frontend validation; ALLOWED_ORIGINS not enforced |
| **Build System** | 9/10 | TypeScript strict; ESLint clean; Sentry source maps; optimized imports |
| **Deployment** | 7/10 | Render + Vercel configured; missing CSP; missing ALLOWED_ORIGINS enforcement |

---

## What's Working Well

1. **Refresh token rotation** with DB-backed revocation and httpOnly cookies
2. **Rate limiting** on all auth endpoints (login, register, forgot, reset)
3. **bcrypt cost factor 10** for password hashing
4. **SHA-256 hashed reset tokens** with 15-minute expiry
5. **Audit logging** for 7 auth events with 90-day TTL
6. **Structured JSON logging** with request ID correlation
7. **Sentry integration** (frontend + backend) with source maps
8. **Health endpoints** for uptime monitoring
9. **Password reset flow** with email enumeration protection
10. **Token refresh queue** preventing N parallel refresh calls
11. **`express-mongo-sanitize`** preventing NoSQL injection
12. **`helmet`** for security headers on backend
13. **Graceful shutdown** handlers for unhandled rejections/exceptions
14. **TTL index** on AuditLog for automatic cleanup
15. **TypeScript strict mode** with 0 errors

---

## Launch Checklist

### Must Complete (P0) — Estimated: 1-2 days

- [ ] Remove `role` from onboarding update (P0-01)
- [ ] Enforce `ALLOWED_ORIGINS` in production (P0-02)
- [ ] Delete `fix.js` and purge secret from git history (P0-03)
- [ ] Fix admin guard to use server-side role check (P0-04)
- [ ] Add Content-Security-Policy header (P0-05)

### Should Complete (P1) — Estimated: 3-5 days

- [ ] Add pagination caps to all list endpoints
- [ ] Add rate limiting to refresh endpoint and public reads
- [ ] Add missing MongoDB indexes
- [ ] Add ObjectId validation to route params
- [ ] Standardize password validation
- [ ] Add email format validation
- [ ] Protect `/health/detailed` endpoint
- [ ] Fix image config (disable SVG, restrict domains)
- [ ] Add SEO metadata to auth and dynamic pages
- [ ] Add request timeout middleware
- [ ] Remove email from JWT payload
- [ ] Fix email enumeration on registration

---

## Production Readiness Score

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Security | 25% | 55/100 | 13.75 |
| Authentication | 15% | 70/100 | 10.50 |
| Data Integrity | 15% | 80/100 | 12.00 |
| Observability | 10% | 80/100 | 8.00 |
| Performance | 10% | 70/100 | 7.00 |
| SEO | 10% | 50/100 | 5.00 |
| Code Quality | 10% | 85/100 | 8.50 |
| Deployment | 5% | 75/100 | 3.75 |
| **Total** | **100%** | | **68.5/100** |

---

## GO / NO-GO RECOMMENDATION

### **NO-GO**

**Reason:** 5 P0 launch blockers exist, most critically a privilege escalation vulnerability that allows any user to become admin.

**Path to GO:**
1. Fix all 5 P0 items (1-2 days)
2. Fix top 10 P1 items (2-3 days)
3. Re-audit
4. Deploy to staging
5. Verify health endpoints, Sentry, auth flows
6. Launch

**Estimated time to GO:** 3-5 days of focused development.
