# Final Issue Backlog

**Date:** June 12, 2026  
**Scope:** All findings from Phase 8A-8E audits  
**Rule:** Every issue has evidence. No hypothetical issues.

---

## CRITICAL

*No CRITICAL issues found.*

---

## HIGH

### ISSUE-001: Seed Scripts Never Executed on Production

**Description:** Academy and coach seed data was never deployed to the Render MongoDB database. `GET /academies` returns 0 items. `GET /coaches` returns 1 test record.

**Severity:** HIGH  
**Evidence:**
- `GET /academies` → `{ "items": [], "pagination": { "total": 0 } }`
- `GET /coaches` → `{ "items": [{ "name": "Test Coach" }], "pagination": { "total": 1 } }`
- Seed scripts exist at `seeds/seedAcademies.js` (12 academies) and `seeds/seedCoaches.js` (8 coaches)
- Seed scripts require manual execution: `MONGO_URI="<uri>" node seeds/seedAcademies.js`

**Root cause:** No automated seed step in deployment process. Seeds were written but never run.

**Files affected:**
- `seeds/seedAcademies.js`
- `seeds/seedCoaches.js`
- All frontend pages consuming academy/coach data

**Estimated effort:** 5 minutes (run 2 commands)  
**Risk level:** HIGH — All academy/coach pages show empty data

---

### ISSUE-002: Frontend Error Parsing Bug

**Description:** `lib/api/client.ts` reads error responses incorrectly. Backend returns `{ ok: false, error: { code, message } }` but client reads `json.code` and `json.message` at the top level.

**Severity:** HIGH  
**Evidence:**

Backend error response:
```json
{ "ok": false, "error": { "code": "INVALID_CREDENTIALS", "message": "Invalid email or password" } }
```

Client code (`lib/api/client.ts:63-72`):
```typescript
code: json.code ?? 'UNKNOWN_ERROR',      // undefined → 'UNKNOWN_ERROR'
message: json.message ?? res.statusText,  // undefined → 'Bad Request'
```

**Impact:** Every API error shows "UNKNOWN_ERROR" instead of the actual error message. Users see generic errors for login failures, validation errors, conflicts, etc.

**Root cause:** Client was written for a flat error format `{ code, message }` but backend uses nested format `{ error: { code, message } }`.

**Files affected:**
- `lib/api/client.ts:63-72`

**Estimated effort:** 2 minutes (change 3 lines)  
**Risk level:** HIGH — Breaks all error display in the app

---

### ISSUE-003: Error Message Leakage in athleteController.js

**Description:** 9 catch blocks in `athleteController.js` expose `err.message` in responses instead of generic "Internal server error".

**Severity:** HIGH  
**Evidence:** `controllers/athleteController.js` lines 14, 22, 32, 42, 60, 71, 93, 105, 114

```javascript
} catch (err) {
    res.status(500).json(fail('SERVER_ERROR', err.message));
}
```

**Impact:** Internal error details (DB errors, stack traces) exposed to clients.

**Root cause:** Phase 7 security hardening fixed this in auth, academy, coach, enquiry, and shortlist controllers but missed athlete controller.

**Files affected:**
- `controllers/athleteController.js` (9 catch blocks)

**Estimated effort:** 2 minutes (replace 9 instances)  
**Risk level:** HIGH — Information disclosure on athlete endpoints

---

### ISSUE-004: Test Coach Record in Production Database

**Description:** A test coach record ("Test Coach") exists in the production MongoDB, created during Phase 7 security testing via the unprotected `POST /coaches` endpoint.

**Severity:** HIGH  
**Evidence:**
- `GET /coaches` returns 1 item: `{ "name": "Test Coach", "slug": "test-coach" }`
- Created via `POST /coaches` before coach protection was added
- This is test data, not real seed data

**Impact:** Users see a fake "Test Coach" in the coaches listing.

**Root cause:** Security testing created data that was never cleaned up.

**Files affected:**
- Production MongoDB `coaches` collection

**Estimated effort:** 1 minute (delete via MongoDB or API)  
**Risk level:** HIGH — Test data visible to users

---

## MEDIUM

### ISSUE-005: Auth Flow Expects `verified` Field Not Sent by Backend

**Description:** Frontend `auth-provider.tsx` persists a `verified` state. Login/register pages check `verified` and redirect to `/verify/method` if false. But the backend `safeUser()` doesn't return a `verified` field, so it defaults to `false`. This means every login redirects to OTP verification even though the backend doesn't support OTP.

**Severity:** MEDIUM  
**Evidence:**

`controllers/authController.js:16-18`:
```javascript
function safeUser(user) {
    return { id: user.id || user._id, name: user.name, email: user.email, role: user.role };
}
```
No `verified` field returned.

`app/(auth)/login/page.tsx:139-153`:
```javascript
if (!res.ok) { ... }
localStorage.setItem('sportsos:auth-token', res.data.token);
setProfile({ name: res.data.user.name, email: res.data.user.email, phone: '' });
setAuth(true);
router.replace('/');
```

`app/(auth)/register/page.tsx:89-92`:
```javascript
if (!verified) {
    router.replace('/verify/method');
    return;
}
```

**Impact:** After registration, user is redirected to `/verify/method` (OTP page). If they navigate away and log in again, they're redirected to `/` (because `verified` persists as `false` in localStorage and the login page only redirects if `verified && onboardingCompleted`). The flow is confusing but not broken — users can still use the app.

**Root cause:** Frontend OTP flow was designed for a backend that doesn't exist yet.

**Files affected:**
- `app/(auth)/register/page.tsx:89-92`
- `components/providers/auth-provider.tsx:33`

**Estimated effort:** 5 minutes (set `verified: true` in `safeUser()` or skip redirect)  
**Risk level:** MEDIUM — Confusing UX but not blocking

---

### ISSUE-006: CORS Allows All Origins

**Description:** `app.use(cors())` with no origin restriction allows any website to make API requests.

**Severity:** MEDIUM  
**Evidence:** `index.js:22`

**Impact:** Any website can authenticate users, submit enquiries, manage shortlists.

**Root cause:** Development convenience, not production-ready.

**Files affected:**
- `index.js:22`

**Estimated effort:** 2 minutes (add origin config)  
**Risk level:** MEDIUM — Not blocking for MVP, but should be restricted before public launch

---

## LOW

### ISSUE-007: No `.env.example` File

**Description:** No `.env.example` file exists in the backend repo. New developers have no reference for required environment variables.

**Severity:** LOW  
**Evidence:** `ls sportsOS-nodejs/` shows no `.env*` files

**Files affected:**
- `sportsOS-nodejs/` (missing file)

**Estimated effort:** 2 minutes  
**Risk level:** LOW — Documentation gap

---

### ISSUE-008: DNS Override May Be Unnecessary

**Description:** `index.js:1` forces Google DNS (`8.8.8.8`, `8.8.4.4`). This may be a workaround for a previous DNS issue. Render's DNS should work fine.

**Severity:** LOW  
**Evidence:** `index.js:1`: `require("dns").setServers(["8.8.8.8", "8.8.4.4"]);`

**Files affected:**
- `index.js:1`

**Estimated effort:** 1 minute (remove line)  
**Risk level:** LOW — Cosmetic, no functional impact

---

## Summary

| Severity | Count | Blocking? |
|----------|-------|-----------|
| CRITICAL | 0 | — |
| HIGH | 4 | Yes — must fix before launch |
| MEDIUM | 2 | Should fix before public launch |
| LOW | 2 | Nice to have |

---

## Recommended Fix Order

| Order | Issue | Effort | Impact |
|-------|-------|--------|--------|
| 1 | ISSUE-001: Run seed scripts | 5 min | Fixes all empty data pages |
| 2 | ISSUE-002: Fix error parsing in client.ts | 2 min | Fixes all error display |
| 3 | ISSUE-004: Delete test coach | 1 min | Removes fake data |
| 4 | ISSUE-003: Fix athleteController error leakage | 2 min | Security fix |
| 5 | ISSUE-005: Set verified=true in safeUser | 5 min | Fixes auth flow |
| 6 | ISSUE-006: Configure CORS origin | 2 min | Security hardening |
| 7 | ISSUE-007: Add .env.example | 2 min | Developer experience |
| 8 | ISSUE-008: Remove DNS override | 1 min | Cleanup |

**Total estimated effort: ~20 minutes**
