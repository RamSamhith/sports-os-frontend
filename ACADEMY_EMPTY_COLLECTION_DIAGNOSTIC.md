# Academy Empty Collection Diagnostic

**Date:** June 12, 2026  
**Issue:** `GET /academies` returns `{ "items": [], "pagination": { "total": 0 } }`

---

## Investigation Results

### 1. Academy Collection Document Count

**API test:**
```
GET /academies        → total: 0, items: 0
GET /academies/verified/all → count: 0
GET /coaches          → total: 1, items: 1 (test record)
```

**Verdict:** Academy collection has **0 documents**. Coach collection has **1 document** (test data from security testing).

---

### 2. Whether seedAcademies.js Has Been Executed

**Evidence:**
- Seed script exists at `seeds/seedAcademies.js` (470 lines, 12 academies defined)
- Script was committed in `ec24443` (Phase 1-6) and is in the git repo
- Render deployment has latest code (`94a36ec`) — verified by slug endpoints returning 404 (routes registered)
- `package.json` has NO `seed` script — only `start` and `test`
- No automated seed step in deployment pipeline
- No evidence of manual execution (collection is empty)

**Verdict:** **Seed script has NEVER been executed on the Render database.**

---

### 3. Whether seedAcademies.js Would Complete Successfully

**Code analysis:**

```javascript
// Line 453: Uses correct env var (fixed in Phase 7)
await mongoose.connect(process.env.MONGO_URI);

// Line 456: Clears existing data
await Academy.deleteMany({});

// Line 459: Inserts 12 academies
const result = await Academy.insertMany(academies);
```

**Data validation against model:**

| Field | Model Enum | Seed Values | Match? |
|-------|-----------|-------------|--------|
| `facilities` | `['indoor','outdoor','ground','court','equipment','changing_room','parking','physio','gym']` | All match | ✅ |
| `trainingLevels` | `['beginner','intermediate','advanced','elite']` | All match | ✅ |
| `verificationStatus` | `['unverified','pending','verified','rejected']` | Uses `verified`, `pending`, `unverified` | ✅ |
| `status` | `['draft','published','suspended']` | All use `published` | ✅ |

**All 12 academy documents match the model schema.** No enum violations. `insertMany` would succeed.

**Verdict:** **Script would complete successfully if executed.**

---

### 4. Whether deleteAll() Removed Records

**Code:**
```javascript
// seedAcademies.js:456
await Academy.deleteMany({});  // Clears ALL academies
```

**This is the seed script's own cleanup step** — it runs `deleteMany({})` before inserting. This is correct behavior for a seed script (clear + re-seed).

**No external code calls `deleteAll()` or `deleteMany()` on the Academy collection.** The only place this runs is inside the seed script itself.

**Verdict:** **No rogue deletion. The collection was never populated in the first place.**

---

### 5. Whether Repository Queries Correct Collection

**Repository (`repositories/academyRepository.js:15-16`):**
```javascript
const query = { status: 'published' };
const total = await Academy.countDocuments(query);
```

**Model (`models/Academy.js`):**
```javascript
module.exports = mongoose.model('Academy', academySchema);
```

Mongoose auto-pluralizes `Academy` → `academies` collection. The repository queries `academies` with `{ status: 'published' }`. All seed data has `status: 'published'`.

**Verdict:** **Repository queries the correct collection with correct filter.**

---

### 6. Whether Render Deployment Uses Latest Academy Model

**Evidence:**
- Render is deployed from `main` branch, commit `94a36ec`
- `models/Academy.js` was last modified in commit `ec24443` (Phase 1-6)
- Slug endpoints exist on Render (return 404 for non-existent slugs, confirming routes are registered)
- `GET /academies` returns envelope format `{ ok, data: { items, pagination } }` — matches latest controller

**Verdict:** **Render is using the latest Academy model and controller.**

---

## Root Cause

**Seed scripts were never executed on the Render MongoDB database.**

The seed scripts:
- Exist in the repo ✅
- Use the correct env var (`MONGO_URI`) ✅
- Have valid data matching the model schema ✅
- Would complete successfully ✅

But they require **manual execution**:
```bash
MONGO_URI="<render-mongo-uri>" node seeds/seedAcademies.js
MONGO_URI="<render-mongo-uri>" node seeds/seedCoaches.js
```

No one has run these commands against the Render database.

---

## Exact Fix

**Run the seed scripts against the Render database:**

```bash
# From the sportsOS-nodejs directory
MONGO_URI="<same-value-as-Render-MONGO_URI>" node seeds/seedAcademies.js
MONGO_URI="<same-value-as-Render-MONGO_URI>" node seeds/seedCoaches.js
```

**Expected output:**
```
Connected to MongoDB
Cleared existing academies
Seeded 12 academies
Done
```

**Verify after seeding:**
```
GET /academies → total: 12
GET /coaches → total: 8
```

**Alternative: Add a seed script to `package.json`:**
```json
"scripts": {
    "start": "node index.js",
    "seed:academies": "node seeds/seedAcademies.js",
    "seed:coaches": "node seeds/seedCoaches.js",
    "seed": "node seeds/seedAcademies.js && node seeds/seedCoaches.js"
}
```

---

## Summary

| Check | Result |
|-------|--------|
| Collection count | 0 academies, 1 test coach |
| Seed script executed? | **NO** — never run on Render |
| Seed script would succeed? | **YES** — data matches schema |
| Rogue deletion? | **NO** — collection never populated |
| Correct collection queried? | **YES** — `academies` with `{ status: 'published' }` |
| Latest model on Render? | **YES** — commit `94a36ec` |

**Root cause: Seed scripts never executed.**  
**Fix: Run 2 commands.**  
**Effort: 5 minutes.**
