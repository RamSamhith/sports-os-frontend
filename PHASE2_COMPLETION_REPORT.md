# PHASE 2 COMPLETION REPORT

**Date:** 2026-06-12
**Goal:** Academy & Coach schema expansion, slug routes, seed data, query filtering, pagination

---

## Summary

All Phase 2 tasks completed. Academy and Coach models now match frontend types. Slug routes, filtering, and pagination added. Seed scripts ready to populate 12 academies + 8 coaches.

---

## Files Changed

| File | Change |
|------|--------|
| `sportsOS-nodejs/models/Academy.js` | **Rewritten** — 22 lines → 70 lines. New fields: slug, description, location (subdoc), contact (subdoc), sportsOffered, facilities, trainingLevels, certifications, verificationStatus, achievementSignals, rating, coverImage, status |
| `sportsOS-nodejs/models/Coach.js` | **Rewritten** — 18 lines → 55 lines. New fields: slug, avatar, certifications, experienceYears, sportsCoached, specialization, academyId (optional), location (subdoc), contact (subdoc), verificationStatus, rating, status |
| `sportsOS-nodejs/repositories/academyRepository.js` | **Rewritten** — Added: findBySlug, getAcademiesFiltered (sport/facility/level/status/search/pagination), deleteAll |
| `sportsOS-nodejs/repositories/coachRepository.js` | **Rewritten** — Added: findBySlug, getCoachesFiltered (sport/search/pagination), updateCoach, deleteAll |
| `sportsOS-nodejs/controllers/academyController.js` | **Rewritten** — Added: GET /by-slug/:slug, query params on GET /, pagination in response |
| `sportsOS-nodejs/controllers/coachController.js` | **Rewritten** — Added: GET /by-slug/:slug, query params on GET /, pagination in response, PUT /:id |
| `sportsOS-nodejs/seeds/seedAcademies.js` | **NEW** — Seeds 12 academies from frontend data |
| `sportsOS-nodejs/seeds/seedCoaches.js` | **NEW** — Seeds 8 coaches from frontend data, links to academies by slug |

**Total: 6 files rewritten, 2 new files**

---

## Schema Changes

### Academy (Before → After)

| Before | After |
|--------|-------|
| `name: String` | `name: String` |
| `sport: [String]` | `sportsOffered: [String]` |
| `location: String` | `location: {address, city, state, country, lat, lng, pincode, geohash}` |
| `distanceKm: Number` | ❌ Removed |
| `verified: Boolean` | `verificationStatus: enum` |
| `goalType: String` | ❌ Removed |
| — | `slug: String (unique)` |
| — | `description: String` |
| — | `contact: {phone, email, website}` |
| — | `facilities: [String]` |
| — | `trainingLevels: [String]` |
| — | `certifications: [{name, issuer, year}]` |
| — | `achievementSignals: {state, national, competitions, milestones}` |
| — | `rating: {average, count}` |
| — | `coverImage: String` |
| — | `status: enum` |

### Coach (Before → After)

| Before | After |
|--------|-------|
| `name: String` | `name: String` |
| `sport: String` | `sportsCoached: [String]` |
| `academyId: ObjectId (required)` | `academyId: ObjectId (optional)` |
| — | `slug: String (unique)` |
| — | `avatar: String` |
| — | `certifications: [{name, issuer, year}]` |
| — | `experienceYears: Number` |
| — | `specialization: [String]` |
| — | `location: {address, city, state, country, lat, lng}` |
| — | `contact: {phone, email}` |
| — | `verificationStatus: enum` |
| — | `rating: {average, count}` |
| — | `status: enum` |

---

## Endpoints Changed

### GET /academies (Updated)
- **Before:** Returns flat array of all academies
- **After:** Returns `{ ok: true, data: [...], pagination: { page, pageSize, total, hasMore } }`
- **Query params:** `sport`, `facility`, `level`, `status`, `search`, `page`, `pageSize`

### GET /academies/by-slug/:slug (New)
- Returns single academy by slug

### GET /coaches (Updated)
- **Before:** Returns flat array of all coaches
- **After:** Returns `{ ok: true, data: [...], pagination: { page, pageSize, total, hasMore } }`
- **Query params:** `sport`, `search`, `page`, `pageSize`

### GET /coaches/by-slug/:slug (New)
- Returns single coach by slug

### PUT /coaches/:id (New)
- Update coach by ID

---

## Migration Requirements

**Old data must be replaced.** Only 4 academies and 0 coaches exist in production — safe to delete and re-seed.

After deployment, run:
```bash
node seeds/seedAcademies.js
node seeds/seedCoaches.js
```

This will:
1. Clear old academies/coaches
2. Insert 12 academies + 8 coaches with full frontend-compatible data
3. Link coaches to academies by slug

---

## Build Status

| Check | Result |
|-------|--------|
| Syntax check (8 JS files) | PASS |
| Node server start | PASS |
| Frontend build (`npm run build`) | PASS — all 35+ pages compile |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Old data incompatible with new schema | Delete + re-seed (only 4 records) |
| Render cold start still 503 | Expected — free tier limitation |
| Seed scripts require MONGODB_URI | Must be set in Render env vars |
| Coach academyId now optional | Existing coaches without academy still work |

---

## What Was NOT Changed (By Design)

| Item | Reason |
|------|--------|
| Frontend pages | Phase 4 — wait for approval |
| Shortlist | Phase 3 — different data model |
| Enquiries | Out of scope |
| Profile system | Out of scope |

---

## Remaining Blockers

### Before Frontend Integration (Phase 4)
1. **Deploy to Render** — Run seed scripts after deploy
2. **Set NEXT_PUBLIC_API_URL** in frontend `.env.local`
3. **Wire frontend pages** to use API instead of static data

### Future Phases
4. **Shortlist schema rewrite** — Different data model (userId+itemType+itemId)
5. **Enquiry model** — New model + controller
6. **Authentication wiring** — Login/register pages → API
7. **ageRange, batchInformation, gallery** — Low priority fields
8. **verificationEvidence** — Future feature

---

## Next Phase

**Phase 3:** Shortlist model rewrite (userId+itemType+itemId)
- Requires: User approval
- Scope: Model rewrite, controller rewrite, frontend wiring

**OR**

**Phase 4:** Frontend integration (connect pages to API)
- Requires: User approval
- Scope: 6 pages, env config, API wiring
