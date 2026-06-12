# Environment Variable Fix Plan

**Date:** June 12, 2026  
**Status:** RECOMMENDED — not yet applied (audit only)

---

## Problem

The application and seed scripts use **different variable names** for the same MongoDB connection:

| Component | Variable | File:Line |
|-----------|----------|-----------|
| App | `MONGO_URI` | `config/db.js:5` |
| Seeds | `MONGODB_URI` | `seeds/seedAcademies.js:453`, `seeds/seedCoaches.js:211` |

This requires setting **two separate environment variables** on Render with the same value, which is error-prone and confusing.

---

## Recommended Fix: Standardize to `MONGO_URI`

Change seed scripts to use `MONGO_URI` (the app's variable name) instead of `MONGODB_URI`.

### Exact Changes

#### File 1: `seeds/seedAcademies.js`
- **Line 453:** `await mongoose.connect(process.env.MONGODB_URI);`
- **Change to:** `await mongoose.connect(process.env.MONGO_URI);`

#### File 2: `seeds/seedCoaches.js`
- **Line 211:** `await mongoose.connect(process.env.MONGODB_URI);`
- **Change to:** `await mongoose.connect(process.env.MONGO_URI);`

---

## Migration Impact

### Before Fix (Current State)
- Render must have **both** `MONGO_URI` and `MONGODB_URI` set
- Both must point to the same MongoDB Atlas database
- Seed scripts fail if only `MONGO_URI` is set

### After Fix (Recommended)
- Render only needs `MONGO_URI` (already exists)
- Seed scripts automatically use the same variable as the app
- No additional Render configuration needed
- Eliminates confusion and duplication

### Risk Assessment
- **Risk:** LOW
- **Reason:** Only 2 files changed, both seed scripts (not live app code)
- **Reversibility:** Trivial — change one word back

---

## Alternative: Keep Both Variables

If you prefer not to modify seed scripts:
- Set `MONGODB_URI` on Render to the same value as `MONGO_URI`
- Document the duplication
- Accept the maintenance overhead

**Not recommended** — adds unnecessary complexity.

---

## Deployment Documentation Updates Required

If the fix is applied, these documents need line updates:

| Document | Section | Change |
|----------|---------|--------|
| `RENDER_DEPLOYMENT_CHECKLIST.md:35` | Env Vars | Remove `MONGODB_URI` row |
| `RENDER_DEPLOYMENT_CHECKLIST.md:123` | Setup | Remove `Set MONGODB_URI` step |
| `DEPLOYMENT_GAP_REPORT.md:139` | Variables | Remove `MONGODB_URI` row |
| `DATABASE_MIGRATION_CHECKLIST.md:19` | Prerequisites | Remove `MONGODB_URI` |
| `DATABASE_MIGRATION_CHECKLIST.md:63-80` | Seed Setup | Replace `MONGODB_URI` with `MONGO_URI` |
| `DEPLOYMENT_EXECUTION_PLAN.md:72` | Variables | Remove `MONGODB_URI` row |
| `DEPLOYMENT_EXECUTION_PLAN.md:84,90` | Seed sections | Change `MONGODB_URI` → `MONGO_URI` |
| `DEPLOYMENT_EXECUTION_PLAN.md:158-170` | Shell setup | Remove `MONGODB_URI` export |
| `ROLLBACK_PLAN.md:61` | Rollback | Change `MONGODB_URI` → `MONGO_URI` |
| `PHASE2_COMPLETION_REPORT.md:130` | Notes | Update reference |
| `PRODUCTION_READINESS_REPORT.md:49` | Matrix | Remove `MONGODB_URI` row |

---

## Decision Required

| Option | Action | Effort |
|--------|--------|--------|
| A (Recommended) | Change seed scripts to use `MONGO_URI` | 2 lines in 2 files |
| B | Set `MONGODB_URI` on Render | 1 env var + ongoing maintenance |

**Recommendation:** Option A — simpler, fewer variables, less confusion.
