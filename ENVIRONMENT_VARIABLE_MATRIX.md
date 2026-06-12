# Environment Variable Matrix

**Date:** June 12, 2026  
**Scope:** `sportsOS-nodejs/` — all files with `process.env` usage

---

## Matrix

| Variable | Used By | Required | Render Status | Notes |
|----------|---------|----------|---------------|-------|
| `MONGO_URI` | `config/db.js` (app) | Yes | ✅ Set | Main app database connection |
| `MONGODB_URI` | `seeds/seedAcademies.js`, `seeds/seedCoaches.js` | Yes (seeds) | ❌ Not Set | **MISMATCH** — should be `MONGO_URI` |
| `JWT_SECRET` | `authController.js`, `authMiddleware.js`, `enquiryController.js` | Yes | ✅ Set | JWT signing/verification |
| `JWT_REFRESH_SECRET` | `services/authService.js` (dead code) | No | Unknown | Not used by any active code |

---

## Status Legend

| Status | Meaning |
|--------|---------|
| ✅ Set | Variable exists in Render environment |
| ❌ Not Set | Variable must be created before deployment |
| ⚠️ Mismatch | Variable name differs between components that need the same value |
| 🔒 Dead Code | Variable only used in unused files |

---

## Detailed Breakdown

### `MONGO_URI`
- **Used by:** `config/db.js:5` → `mongoose.connect(process.env.MONGO_URI)`
- **Called from:** `index.js:8` → `connectDB()`
- **Required:** Yes — app crashes without it
- **Render:** Already set (existing deployment)
- **Value:** MongoDB Atlas connection string

### `MONGODB_URI`
- **Used by:** `seeds/seedAcademies.js:453`, `seeds/seedCoaches.js:211`
- **Required:** Yes — seed scripts fail without it
- **Render:** NOT SET
- **Problem:** Same database, different variable name than `MONGO_URI`
- **Impact:** Seeds cannot run on Render without setting this separately

### `JWT_SECRET`
- **Used by:** 3 active files (authController, authMiddleware, enquiryController)
- **Required:** Yes — auth system fails without it
- **Render:** Already set (existing deployment)
- **Value:** Random string for JWT signing

### `JWT_REFRESH_SECRET`
- **Used by:** `services/authService.js:76, 196` only
- **Required:** No — `authService.js` is dead code (no imports from controllers/routes)
- **Render:** Unknown
- **Recommendation:** Ignore for MVP

---

## Inconsistency Summary

```
config/db.js          →  process.env.MONGO_URI      (app)
seeds/seedAcademies.js →  process.env.MONGODB_URI   (seeds)
seeds/seedCoaches.js   →  process.env.MONGODB_URI   (seeds)
```

**Both variables should point to the same MongoDB Atlas connection string.**  
**The names differ, requiring two separate Render environment variables or a code fix.**
