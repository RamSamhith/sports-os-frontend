# CRITICAL FIX PLAN

**Date:** June 12, 2026  
**Source:** CRITICAL_FINDINGS_VALIDATION.md  
**Status:** No VALID CRITICAL findings. Fixes below are for VALID NON-CRITICAL items.

---

## Fix Priority

| Finding | Classification | Active Code? | Fix Priority |
|---------|---------------|--------------|--------------|
| C4 | VALID NON-CRITICAL | Yes | Medium |
| C6 | VALID NON-CRITICAL | Yes | Low |
| C2 | VALID NON-CRITICAL | No | Low |
| C3 | VALID NON-CRITICAL | No | Low |
| C5 | VALID NON-CRITICAL | No | Low |
| C1 | FALSE POSITIVE | No | Skip |

---

## Fix C4: ReDoS in Search Endpoints

**File:** `sportsOS-nodejs/repositories/academyRepository.js:39`  
**File:** `sportsOS-nodejs/repositories/coachRepository.js:24`  
**Also:** `repositories/academyRepository.js:75-76`, `repositories/coachRepository.js:62` (duplicate checks)

### Current Code

```javascript
// academyRepository.js:39
const regex = new RegExp(search, 'i');

// academyRepository.js:75-76
const existing = await Academy.findOne({
  name: { $regex: new RegExp('^' + name + '$', 'i') }
});
```

### Proposed Change

Add a regex escaping utility function and apply it before constructing `RegExp`:

```javascript
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// academyRepository.js:39
const regex = new RegExp(escapeRegex(search), 'i');

// academyRepository.js:75-76
const existing = await Academy.findOne({
  name: { $regex: new RegExp('^' + escapeRegex(name) + '$', 'i') }
});
```

### Risk

**LOW** — Adding input sanitization. No behavioral change for normal input. Malicious input gets escaped.

### Time

**10 minutes** — 2 files, 2 changes each.

---

## Fix C6: Remove Debug console.count()

**Files:**
- `components/providers/auth-provider.tsx:103`
- `components/auth/private-guard.tsx:13`
- `components/home/personalized-home.tsx:26`
- `components/layout/navbar.tsx:21`

### Current Code

```javascript
// auth-provider.tsx:103
console.count('AuthProvider');

// private-guard.tsx:13
console.count('PrivateGuard');

// personalized-home.tsx:26
console.count('PersonalizedHome');

// navbar.tsx:21
console.count('Navbar');
```

### Proposed Change

Delete each `console.count()` line.

### Risk

**NONE** — Removing debug logging. No functional impact.

### Time

**5 minutes** — 4 deletions.

---

## Fix C2: Add JWT_REFRESH_SECRET Validation (Optional)

**File:** `sportsOS-nodejs/index.js:4`

### Current Code

```javascript
const requiredEnv = ['MONGO_URI', 'JWT_SECRET'];
```

### Proposed Change

```javascript
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
```

### Risk

**LOW** — Adds validation for an env var used in dead code. Will crash Render if not set (but it should be set).

### Time

**2 minutes** — 1 line change.

### Note

Only needed if `services/authService.js` is ever activated. Currently dead code.

---

## Fix C3: Delete Dead Services (Optional)

**File:** `sportsOS-nodejs/services/` (15 files)

### Current State

15 service files exist but are never imported. They reference 12 missing model files.

### Proposed Change

Delete entire `services/` directory.

### Risk

**NONE** — Dead code removal. No active code imports from services.

### Time

**1 minute** — Delete directory.

### Note

Removes confusion about which pattern to follow (controllers+repositories vs services).

---

## Fix C5: Remove Duplicate getMe (Optional)

**Files:**
- `lib/api/auth.ts:72` (remove getMe)
- `lib/api/users.ts:13` (keep getMe)

### Current State

Two `getMe` functions: one in auth.ts (calls `/auth/me`), one in users.ts (calls `/users/me`). Neither is imported anywhere.

### Proposed Change

Delete `getMe` from `auth.ts`. Keep `users.ts` version (matches frontend pattern).

### Risk

**NONE** — Neither function is imported. No behavioral change.

### Time

**2 minutes** — 1 deletion.

---

## Recommended Action

| Fix | Priority | Recommended? |
|-----|----------|--------------|
| C4 (ReDoS) | Medium | **Yes** — security best practice |
| C6 (console.count) | Low | **Yes** — quick cleanup |
| C2 (JWT_REFRESH_SECRET) | Low | Optional — dead code |
| C3 (Delete services) | Low | Optional — dead code cleanup |
| C5 (Duplicate getMe) | Low | Optional — code cleanup |
| C1 (fix.js) | Skip | FALSE POSITIVE |

---

## Total Estimated Time

| Fix | Time |
|-----|------|
| C4 (ReDoS) | 10 min |
| C6 (console.count) | 5 min |
| **Total** | **15 min** |

---

## Verification After Fixes

1. `npm run build` — frontend builds successfully
2. `node index.js` — backend starts without errors
3. `GET /academies?search=cr` — returns results (not frozen)
4. `GET /coaches?search=cr` — returns results (not frozen)
5. Browser console — no `console.count` output
