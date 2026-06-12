# SECURITY AUDIT

**Date:** 2026-06-12
**Scope:** Backend API + Frontend auth flow

---

## CRITICAL Findings

### SEC-001: Coach CRUD Endpoints Unprotected
- **Risk:** CRITICAL
- **Impact:** Anyone can create, modify, or delete coaches without authentication
- **File:** `sportsOS-nodejs/controllers/coachController.js:64,86,97`
- **Evidence:** `POST /`, `PUT /:id`, `DELETE /:id` have NO `protect` middleware
- **Recommendation:** Add `protect, adminOnly` middleware to POST, PUT, DELETE routes

### SEC-002: Role Escalation via Registration
- **Risk:** CRITICAL
- **Impact:** A user can register as `admin` by sending `{"role":"admin"}` in the request body
- **File:** `sportsOS-nodejs/controllers/authController.js:23,42`
- **Evidence:** `const { ... role } = req.body;` then `role: role || 'athlete'`
- **Recommendation:** Remove `role` from destructuring or ignore it: always default to `'athlete'`

### SEC-003: No Rate Limiting
- **Risk:** CRITICAL
- **Impact:** Brute force attacks on login, register, and enquiry endpoints
- **File:** `sportsOS-nodejs/index.js`
- **Evidence:** No `express-rate-limit` or equivalent middleware
- **Recommendation:** Add rate limiting to `/auth/*` (5 req/min) and `/enquiries` (10 req/min)

---

## HIGH Findings

### SEC-004: Shortlist DELETE No Ownership Check
- **Risk:** HIGH
- **Impact:** Any authenticated user can delete any other user's shortlist items
- **File:** `sportsOS-nodejs/controllers/shortlistController.js:73-80`
- **Evidence:** `remove(req.params.id)` — no check that `item.userId === req.user.id`
- **Recommendation:** Fetch item first, verify `item.userId.toString() === req.user.id`

### SEC-005: Server Error Message Leakage
- **Risk:** HIGH
- **Impact:** Internal errors (MongoDB messages, file paths, stack traces) exposed to clients
- **File:** All controllers — `fail('SERVER_ERROR', err.message)`
- **Evidence:** MongoDB validation errors, cast errors, duplicate key errors all leak through `err.message`
- **Recommendation:** Return generic message in production: `fail('SERVER_ERROR', 'Internal server error')`

### SEC-006: Enquiry Controller Inline JWT Verification
- **Risk:** HIGH
- **Impact:** Inconsistent auth handling; `require('jsonwebtoken')` called on every request inside handler
- **File:** `sportsOS-nodejs/controllers/enquiryController.js:27-34`
- **Evidence:** Manual JWT verification instead of using `protect` middleware
- **Recommendation:** Create an optional auth middleware or extract token verification to a shared utility

---

## MEDIUM Findings

### SEC-007: CORS Wide Open
- **Risk:** MEDIUM
- **Impact:** Any domain can make API requests; potential for CSRF-like attacks
- **File:** `sportsOS-nodejs/index.js:10`
- **Evidence:** `app.use(cors())` with no origin restriction
- **Recommendation:** Restrict to `https://sportsos.vercel.app` (or production domain)

### SEC-008: No Password Strength Validation
- **Risk:** MEDIUM
- **Impact:** Users can set trivially weak passwords (e.g., "1", "a")
- **File:** `sportsOS-nodejs/controllers/authController.js:25`
- **Evidence:** Only checks `!password` — no length, complexity, or common password check
- **Recommendation:** Enforce minimum 8 characters, at least 1 letter and 1 number

### SEC-009: No JWT_SECRET Validation at Startup
- **Risk:** MEDIUM
- **Impact:** If `JWT_SECRET` is undefined, `jwt.sign()` throws cryptic error; potential for empty secret
- **File:** `sportsOS-nodejs/controllers/authController.js:11`
- **Evidence:** No startup check for `process.env.JWT_SECRET`
- **Recommendation:** Add at top of `index.js`: `if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET required')`

### SEC-010: Auth Middleware Inconsistent Response Format
- **Risk:** MEDIUM
- **Impact:** Frontend `client.ts` expects `{ ok: false, error: { code, message } }` but `protect` returns `{ message: '...' }`
- **File:** `sportsOS-nodejs/middleware/authMiddleware.js:7,15,24`
- **Evidence:** Returns raw `{ message }` instead of `fail()` envelope
- **Recommendation:** Use `fail('UNAUTHORIZED', 'No token')` and `fail('UNAUTHORIZED', 'Invalid token')`

---

## LOW Findings

### SEC-011: No Request Body Size Limit
- **Risk:** LOW
- **Impact:** Large payloads could cause memory issues
- **File:** `sportsOS-nodejs/index.js:11`
- **Evidence:** `express.json()` with no `limit` option (default 100kb)
- **Recommendation:** Add `express.json({ limit: '10kb' })`

### SEC-012: No Helmet Security Headers
- **Risk:** LOW
- **Impact:** Missing security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- **File:** `sportsOS-nodejs/index.js`
- **Evidence:** No `helmet` middleware
- **Recommendation:** Add `require('helmet')()` for production

### SEC-013: Email Not Normalized Before Query
- **Risk:** LOW
- **Impact:** `User.findOne({ email })` is case-sensitive; `Test@Example.com` ≠ `test@example.com`
- **File:** `sportsOS-nodejs/controllers/authController.js:29,62`
- **Evidence:** No `.toLowerCase()` on email before query
- **Recommendation:** Normalize email: `email.toLowerCase().trim()`

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 3 |
| HIGH | 3 |
| MEDIUM | 4 |
| LOW | 3 |
| **Total** | **13** |
