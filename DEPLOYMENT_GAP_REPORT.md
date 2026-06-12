# DEPLOYMENT GAP REPORT

**Date:** 2026-06-12
**Local Commit:** `1e43622` (phase 5 shortlist integration completed)
**Deployed Commit:** Unknown (pre-Phase 1)

---

## Executive Summary

**The Render deployment is running ORIGINAL code.** None of the Phase 1–5 changes are deployed. The live backend is incompatible with the frontend.

---

## Live Endpoint Test Results

| Endpoint | Method | Status | Response | Verdict |
|----------|--------|--------|----------|---------|
| `/` | GET | 200 | `Sports OS API is Running!` | OK |
| `/academies` | GET | 200 | 4 records (OLD schema) | STALE |
| `/coaches` | GET | 200 | `[]` (empty) | STALE |
| `/auth/register` | POST | 400 | `Bad Request` | BROKEN |
| `/auth/login` | POST | 400 | `Bad Request` | BROKEN |
| `/shortlist/me` | GET | 500 | `Cast to ObjectId failed for "me"` | BROKEN |
| `/shortlist` | POST | 400 | `Bad Request` | BROKEN |
| `/enquiries/me` | GET | 404 | `Cannot GET /enquiries/me` | MISSING |
| `/enquiries` | POST | 404 | `Cannot POST /enquiries` | MISSING |
| `/academies/by-slug/*` | GET | 404 | `Cannot GET /academies/by-slug/*` | MISSING |
| `/coaches/by-slug/*` | GET | 404 | `Cannot GET /coaches/by-slug/*` | MISSING |

---

## Files Changed Locally (Not Deployed)

### Backend — New Files
| File | Purpose |
|------|---------|
| `sportsOS-nodejs/utils/response.js` | `ok()` and `fail()` envelope helpers |
| `sportsOS-nodejs/models/Enquiry.js` | Enquiry model |
| `sportsOS-nodejs/repositories/enquiryRepository.js` | Enquiry CRUD |
| `sportsOS-nodejs/controllers/enquiryController.js` | Enquiry endpoints |
| `sportsOS-nodejs/seeds/seedAcademies.js` | Seeds 12 academies |
| `sportsOS-nodejs/seeds/seedCoaches.js` | Seeds 8 coaches |

### Backend — Modified Files
| File | Change Summary |
|------|----------------|
| `sportsOS-nodejs/package.json` | Added `cors` dependency |
| `sportsOS-nodejs/index.js` | Added CORS middleware, mounted `/enquiries` route |
| `sportsOS-nodejs/models/User.js` | Expanded role enum, added phone field, added toJSON |
| `sportsOS-nodejs/models/Academy.js` | Complete rewrite — 20+ fields, slug, location subdoc, toJSON |
| `sportsOS-nodejs/models/Coach.js` | Complete rewrite — 15+ fields, slug, location subdoc, toJSON |
| `sportsOS-nodejs/models/Shortlist.js` | Complete rewrite — `{ userId, itemType, itemId }` schema |
| `sportsOS-nodejs/controllers/authController.js` | Rewritten — envelope format, register returns token |
| `sportsOS-nodejs/controllers/academyController.js` | Rewritten — envelope, slug routes, filtering, pagination |
| `sportsOS-nodejs/controllers/coachController.js` | Rewritten — envelope, slug routes, filtering, pagination |
| `sportsOS-nodejs/controllers/athleteController.js` | Updated — envelope format |
| `sportsOS-nodejs/controllers/shortlistController.js` | Complete rewrite — auth-protected, new schema |
| `sportsOS-nodejs/repositories/academyRepository.js` | Rewritten — filtering, slug lookup |
| `sportsOS-nodejs/repositories/coachRepository.js` | Rewritten — filtering, slug lookup |
| `sportsOS-nodejs/repositories/shortlistRepository.js` | Complete rewrite — new schema |

### Frontend — Modified Files
| File | Change Summary |
|------|----------------|
| `.env.local` | Added `NEXT_PUBLIC_API_URL` |
| `lib/api/academies.ts` | Rewritten — direct import, slug routes |
| `lib/api/coaches.ts` | Rewritten — direct import, slug routes |
| `lib/api/shortlist.ts` | NEW — API client |
| `lib/api/enquiries.ts` | NEW — API client |
| `lib/hooks/use-shortlist.ts` | Added `populatedData` to context |
| `components/providers/shortlist-provider.tsx` | Rewritten — API sync |
| `components/shortlist/shortlist-view.tsx` | Rewritten — uses populated data |
| `components/enquiry/enquiry-form.tsx` | Rewritten — calls API |
| `components/academies/academy-listing.tsx` | API fetch |
| `components/coaches/coaches-listing.tsx` | API fetch |
| `components/home/featured-academies.tsx` | API fetch |
| `components/home/featured-coaches.tsx` | API fetch |
| `app/(public)/academies/[slug]/page.tsx` | Client component, API fetch |
| `app/(public)/coaches/[slug]/page.tsx` | Client component, API fetch |
| `app/(public)/enquiry/[type]/[id]/page.tsx` | Client component, API fetch |
| `app/(public)/shortlist/page.tsx` | Removed sports tab |
| `app/(private)/profile/enquiries/page.tsx` | Fetches from API |
| `app/(private)/profile/saved/page.tsx` | Removed sports tab |
| `app/(auth)/login/page.tsx` | Wired to API |
| `app/(auth)/register/page.tsx` | Wired to API |
| `components/providers/auth-provider.tsx` | Added token cleanup |

---

## Database State

### Current (Deployed) DB
| Collection | Records | Schema |
|------------|---------|--------|
| `academies` | 4 | OLD — `_id`, `sport[]`, `location` string, `distanceKm`, `verified` boolean |
| `coaches` | 0 | EMPTY |
| `users` | Unknown | Old — no phone field |
| `shortlists` | Unknown | OLD — `athleteId` + `academyId` |
| `enquiries` | 0 | DOES NOT EXIST |

### Required DB State (After Deployment)
| Collection | Records | Schema |
|------------|---------|--------|
| `academies` | 12 | NEW — slug, location subdoc, 20+ fields |
| `coaches` | 8 | NEW — slug, location subdoc, 15+ fields |
| `users` | Existing + new | Expanded role enum, phone field |
| `shortlists` | User data | NEW — `userId` + `itemType` + `itemId` |
| `enquiries` | User data | NEW — full enquiry schema |

---

## Required Migrations

1. **Drop `academies` collection** — old schema incompatible
2. **Drop `coaches` collection** — was empty
3. **Drop `shortlists` collection** — old schema incompatible
4. **Create `enquiries` collection** — new
5. **Run `seedAcademies.js`** — seed 12 academies
6. **Run `seedCoaches.js`** — seed 8 coaches
7. **Keep `users` collection** — backward compatible (new fields are optional)

---

## Required Seed Scripts

| Script | Records | Description |
|--------|---------|-------------|
| `seeds/seedAcademies.js` | 12 | 12 academies matching frontend static data |
| `seeds/seedCoaches.js` | 8 | 8 coaches linked to academies by slug |

---

## Environment Variables

| Variable | Used By | Status |
|----------|---------|--------|
| `MONGO_URI` | `config/db.js` | Required — already on Render |
| `MONGODB_URI` | Seed scripts | Required — same value as `MONGO_URI` |
| `JWT_SECRET` | `authController.js`, `authMiddleware.js` | Required — already on Render |
| `JWT_REFRESH_SECRET` | `authService.js` (DEAD CODE) | Not required |

---

## Package Dependencies

| Package | Status |
|---------|--------|
| `bcryptjs` | Already installed |
| `cors` | **NEW — needs `npm install` on Render** |
| `dotenv` | Already installed |
| `express` | Already installed |
| `jsonwebtoken` | Already installed |
| `mongoose` | Already installed |
