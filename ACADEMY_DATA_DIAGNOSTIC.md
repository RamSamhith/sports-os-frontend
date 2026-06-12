# Academy Data Diagnostic

**Date:** June 12, 2026  
**Issue:** `GET /academies` returns 0 items. `GET /coaches` returns 1 item (test data).

---

## Investigation

### Step 1: Verify API Response

```
GET /academies
Response: { "ok": true, "data": { "items": [], "pagination": { "total": 0 } } }

GET /coaches
Response: { "ok": true, "data": { "items": [{ "name": "Test Coach" }], "pagination": { "total": 1 } } }
```

### Step 2: Check Model

**File:** `models/Academy.js`
- Schema is correct (62 lines)
- All expected fields defined: slug, name, location, contact, sportsOffered, facilities, etc.
- `toJSON` transform present (removes `_id`, `__v`, adds `id`)
- `status` field defaults to `'published'`

**File:** `models/Coach.js`
- Schema is correct (53 lines)
- Same structure as Academy
- `toJSON` transform present

### Step 3: Check Repository

**File:** `repositories/academyRepository.js`
- `getAcademiesFiltered()` queries `{ status: 'published' }` — correct
- `getAcademyBySlug()` uses `findOne({ slug })` — correct
- All CRUD operations present

**File:** `repositories/coachRepository.js`
- Same pattern as academy

### Step 4: Check Controller

**File:** `controllers/academyController.js`
- `GET /` calls `academyRepo.getAcademiesFiltered()` — correct
- `GET /by-slug/:slug` calls `academyRepo.getAcademyBySlug()` — correct
- Envelope format: `ok(result)` — correct

### Step 5: Check Seed Scripts

**File:** `seeds/seedAcademies.js`
- 12 academies defined with full data
- Uses `process.env.MONGO_URI` (fixed in Phase 7)
- Calls `Academy.deleteMany({})` then `Academy.insertMany(academies)`

**File:** `seeds/seedCoaches.js`
- 8 coaches defined with full data
- Uses `process.env.MONGO_URI` (fixed in Phase 7)
- Links coaches to academies by slug
- Calls `Coach.deleteMany({})` then `Coach.insertMany(coachesWithAcademy)`

### Step 6: Check Render Database

- `GET /academies` returns 0 items → **Academy collection is empty**
- `GET /coaches` returns 1 item → **Coach collection has 1 item** (test coach from security testing)

---

## Root Cause

**Seed scripts were never executed on the Render database.**

Evidence:
1. Academy collection is empty (0 documents)
2. Coach collection has only 1 document (created via `POST /coaches` during security testing — before protection was added)
3. Seed scripts exist and are correct
4. Seed scripts were never run because:
   - They require manual execution: `node seeds/seedAcademies.js`
   - They need `MONGO_URI` environment variable (previously was `MONGODB_URI` — fixed in Phase 7)
   - No automated seed step in deployment process

---

## Additional Finding: Test Coach in Database

The one coach that exists (`Test Coach`) was created during Phase 7 security testing via the unprotected `POST /coaches` endpoint. After protection was added, this endpoint requires admin auth.

This test record should be cleaned up before production.

---

## Affected Frontend Pages

| Page | Impact |
|------|--------|
| Homepage (featured academies) | Shows empty/fallback data |
| Homepage (featured coaches) | Shows only test coach |
| `/academies` listing | Shows "No academies found" |
| `/coaches` listing | Shows only test coach |
| Academy detail pages | All return 404 |
| Coach detail pages | All return 404 |
| Shortlist (academy items) | Cannot resolve data |
| Shortlist (coach items) | Cannot resolve data |

---

## Required Action

1. Run seed scripts against Render database:
   ```bash
   MONGO_URI="<render-mongo-uri>" node seeds/seedAcademies.js
   MONGO_URI="<render-mongo-uri>" node seeds/seedCoaches.js
   ```
2. Delete test coach record
3. Verify `GET /academies` returns 12 items
4. Verify `GET /coaches` returns 8 items
