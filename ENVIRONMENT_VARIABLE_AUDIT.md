# Environment Variable Audit

**Date:** June 12, 2026  
**Scope:** `sportsOS-nodejs/` — all files  
**Method:** Grep for `process.env.` + manual file reads

---

## Complete Environment Variable Inventory

| # | Variable | File | Line | Required | Purpose |
|---|----------|------|------|----------|---------|
| 1 | `MONGO_URI` | `config/db.js` | 5 | **Yes (App)** | Main MongoDB connection string for application |
| 2 | `MONGODB_URI` | `seeds/seedAcademies.js` | 453 | **Yes (Seeds)** | MongoDB connection string for academy seeding |
| 3 | `MONGODB_URI` | `seeds/seedCoaches.js` | 211 | **Yes (Seeds)** | MongoDB connection string for coach seeding |
| 4 | `JWT_SECRET` | `controllers/authController.js` | 20 | **Yes** | JWT token signing (login/register) |
| 5 | `JWT_SECRET` | `controllers/enquiryController.js` | 40 | **Yes** | JWT token verification (optional auth on enquiry POST) |
| 6 | `JWT_SECRET` | `middleware/authMiddleware.js` | 12 | **Yes** | JWT token verification (all protected routes) |
| 7 | `JWT_SECRET` | `services/authService.js` | 70, 196 | No (dead code) | JWT signing in unused service file |
| 8 | `JWT_REFRESH_SECRET` | `services/authService.js` | 76, 196 | No (dead code) | Refresh token signing in unused service file |

---

## Evidence

### 1. `MONGO_URI` — Application Database

**File:** `config/db.js:5`
```js
await mongoose.connect(process.env.MONGO_URI);
```
- Called by `index.js:8` via `connectDB()`
- This is the **live application** database connection
- Render environment: **EXISTS** (verified in deployment docs)

### 2. `MONGODB_URI` — Seed Scripts

**File:** `seeds/seedAcademies.js:453`
```js
await mongoose.connect(process.env.MONGODB_URI);
```

**File:** `seeds/seedCoaches.js:211`
```js
await mongoose.connect(process.env.MONGODB_URI);
```
- Both seed scripts use `MONGODB_URI`
- This is a **different variable name** than the app (`MONGO_URI`)
- Render environment: **NOT SET** (per `RENDER_DEPLOYMENT_CHECKLIST.md:35`)

### 3. `JWT_SECRET` — Authentication

**File:** `controllers/authController.js:20`
```js
process.env.JWT_SECRET,
```
- Used in `generateToken()` for `jwt.sign()`
- 7-day expiry

**File:** `middleware/authMiddleware.js:12`
```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
- Used in `protect` middleware for all protected routes

**File:** `controllers/enquiryController.js:40`
```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
- Used for optional auth on enquiry POST (guests can submit)

### 4. `JWT_REFRESH_SECRET` — Dead Code Only

**File:** `services/authService.js:76, 196`
```js
process.env.JWT_REFRESH_SECRET,
```
- `authService.js` is **DEAD CODE** — no controller or route imports it
- Only referenced in `fix.js` (also dead code)
- **Not required for MVP**

---

## Critical Finding: Variable Name Mismatch

| Component | Variable Name | Status |
|-----------|--------------|--------|
| Application (`config/db.js`) | `MONGO_URI` | ✅ Set on Render |
| Seed scripts | `MONGODB_URI` | ❌ NOT set on Render |

**Impact:** Seed scripts will fail with `MongooseError: The uri option to connect() must be a string, got undefined` because `process.env.MONGODB_URI` is undefined.

**Root Cause:** Inconsistent naming between app code and seed scripts.

---

## Deployment Documentation Accuracy

| Document | Claims | Accurate? |
|----------|--------|-----------|
| `RENDER_DEPLOYMENT_CHECKLIST.md:33-35` | `MONGO_URI` exists, `MONGODB_URI` not set | ✅ Correct |
| `DEPLOYMENT_GAP_REPORT.md:138-141` | App uses `MONGO_URI`, seeds use `MONGODB_URI` | ✅ Correct |
| `DATABASE_MIGRATION_CHECKLIST.md:66` | "Seed scripts use `MONGODB_URI`, the app uses `MONGO_URI`" | ✅ Correct |
| `DEPLOYMENT_EXECUTION_PLAN.md:70-72` | Lists both variables separately | ✅ Correct |
| `PRODUCTION_READINESS_REPORT.md:48-50` | Lists both variables | ✅ Correct |

All existing deployment documentation correctly identifies the mismatch. No documentation is inaccurate.

---

## Summary

- **3 distinct environment variables** found across the codebase
- **1 critical mismatch:** App uses `MONGO_URI`, seeds use `MONGODB_URI`
- **1 dead variable:** `JWT_REFRESH_SECRET` (only in dead code)
- **Deployment docs are accurate** — they correctly identify the mismatch
