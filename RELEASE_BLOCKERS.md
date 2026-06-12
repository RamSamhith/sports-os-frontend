# Release Blockers

**Date:** June 12, 2026  
**Scope:** CRITICAL and HIGH issues only

---

## CRITICAL

*No CRITICAL blockers.*

---

## HIGH

### BLOCKER-001: Seed Scripts Not Executed on Render

**Description:** Academy and coach collections are empty. All data-dependent pages show empty states.

**Impact:** 5 user flows blocked (Homepage, Academy Listing, Academy Detail, Coach Listing, Coach Detail)

**Fix:** Run 2 commands:
```bash
MONGO_URI="<render-mongo-uri>" node seeds/seedAcademies.js
MONGO_URI="<render-mongo-uri>" node seeds/seedCoaches.js
```

**Effort:** 5 minutes  
**Risk:** LOW — seeds are idempotent, `deleteMany({})` before insert

---

### BLOCKER-002: Test Coach Record in Production

**Description:** 1 "Test Coach" record exists from security testing.

**Impact:** Users see fake coach in listing.

**Fix:** Seed script's `Coach.deleteMany({})` removes it automatically when run.

**Effort:** 0 (handled by seed execution)  
**Risk:** LOW

---

## Summary

| Severity | Count | Fix Required |
|----------|-------|-------------|
| CRITICAL | 0 | — |
| HIGH | 2 | Run seed scripts |

**Both blockers resolved by running seed scripts.** No code changes needed.
