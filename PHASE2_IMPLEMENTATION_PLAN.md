# PHASE 2 IMPLEMENTATION PLAN

**Goal:** Academy + Coach schema expansion, slug routes, seed data, query filtering, pagination

---

## Task Breakdown

### Task 1: Expand Academy Model (30 min)
- Replace `Academy.js` with expanded schema
- Fields: slug, name, description, location (subdoc), contact (subdoc), sportsOffered, facilities, trainingLevels, certifications, verificationStatus, achievementSignals, rating, coverImage, status
- Remove: sport, distanceKm, verified, goalType
- Add: compound unique index on slug
- Keep: toJSON transform, timestamps

### Task 2: Expand Coach Model (30 min)
- Replace `Coach.js` with expanded schema
- Fields: slug, name, avatar, certifications, experienceYears, sportsCoached, specialization, academyId (optional), location (subdoc), contact (subdoc), verificationStatus, rating, status
- Remove: sport (string)
- Keep: toJSON transform, timestamps

### Task 3: Add Slug Support (20 min)
- Add `getAcademyBySlug()` to academyRepository
- Add `getCoachBySlug()` to coachRepository
- Add `GET /academies/by-slug/:slug` route (before `:id` route)
- Add `GET /coaches/by-slug/:slug` route (before `:id` route)
- Keep existing `GET /:id` routes working

### Task 4: Update Academy Repository (20 min)
- Add: `findBySlug(slug)`
- Add: `findAll({ sport, facility, level, status, search, page, pageSize })`
- Update: `findDuplicate` to use slug
- Keep: all existing methods working

### Task 5: Update Coach Repository (20 min)
- Add: `findBySlug(slug)`
- Add: `findAll({ sport, search, page, pageSize })`
- Update: `findDuplicate` to use slug
- Keep: all existing methods working

### Task 6: Update Academy Controller (15 min)
- Add: `GET /academies/by-slug/:slug` route
- Update: `GET /academies` to support query params (sport, facility, level, status, search, page, pageSize)
- Update: response format to include `{ data, pagination }`
- Keep: all existing routes working

### Task 7: Update Coach Controller (15 min)
- Add: `GET /coaches/by-slug/:slug` route
- Update: `GET /coaches` to support query params (sport, search, page, pageSize)
- Update: response format to include `{ data, pagination }`
- Keep: all existing routes working

### Task 8: Create Academy Seed Script (20 min)
- Convert `data/academies.ts` → JSON seed data
- Map: `id` → `_id`, `sportsOffered` → keep, `location` → subdoc, `verificationStatus` → keep
- Seed 12 academies with full data
- Script: `node seeds/seedAcademies.js`

### Task 9: Create Coach Seed Script (15 min)
- Convert `data/coaches.ts` → JSON seed data
- Map: `id` → `_id`, `sportsCoached` → keep, `location` → subdoc
- Seed 8 coaches with full data
- Script: `node seeds/seedCoaches.js`

### Task 10: Verify Everything (15 min)
- Syntax check all files
- Test server starts
- Test all academy endpoints
- Test all coach endpoints
- Test seed scripts

---

## Total Estimate: ~3 hours

---

## API Changes

### GET /academies (Updated)
**Query params:** `sport`, `facility`, `level`, `status`, `search`, `page`, `pageSize`
**Response:** `{ ok: true, data: [...], pagination: { page, pageSize, total, hasMore } }`

### GET /academies/by-slug/:slug (New)
**Response:** `{ ok: true, data: {...} }`

### GET /academies/:id (Unchanged)
**Response:** `{ ok: true, data: {...} }`

### GET /coaches (Updated)
**Query params:** `sport`, `search`, `page`, `pageSize`
**Response:** `{ ok: true, data: [...], pagination: { page, pageSize, total, hasMore } }`

### GET /coaches/by-slug/:slug (New)
**Response:** `{ ok: true, data: {...} }`

### GET /coaches/:id (Unchanged)
**Response:** `{ ok: true, data: {...} }`

---

## Migration Requirements

**Database:** Existing documents with old schema need migration:
1. Rename `sport` → `sportsOffered` (Academy) / `sportsCoached` (Coach)
2. Convert `location` string → `{ city: string }` subdoc
3. Map `verified: true` → `verificationStatus: 'verified'`
4. Map `verified: false` → `verificationStatus: 'unverified'`
5. Remove `distanceKm`, `goalType`
6. Generate slugs from names

**Strategy:** Delete old data + re-seed (only 4 academies, 0 coaches in prod — safe to replace)
