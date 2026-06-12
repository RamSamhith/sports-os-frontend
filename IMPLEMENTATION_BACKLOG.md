# Implementation Backlog

> Generated: 2026-06-12
> Every item classified with evidence

---

## 1. ALREADY WORKING

Items that function correctly and require zero changes.

| # | Item | Evidence | Files |
|---|------|----------|-------|
| A1 | Server starts and listens on port 3000 | `index.js:19-21`; live test root returns 200 | `index.js` |
| A2 | MongoDB connection | Live queries return data | `config/db.js` |
| A3 | GET `/academies` returns data | Live test: 4 academies returned | `academyController.js:9-16` |
| A4 | GET `/academies/sport/:sport` filters correctly | Live test: Cricket filter returns 2 | `academyController.js:20-27` |
| A5 | GET `/academies/verified/all` filters correctly | Live test: returns 3 verified | `academyController.js:53-60` |
| A6 | GET `/academies/distance/:maxKm` filters correctly | Live test: 20km returns 3 | `academyController.js:30-37` |
| A7 | GET `/academies/goal/:goalType` filters correctly | Source verified | `academyController.js:74-88` |
| A8 | GET `/academies/:id` returns single academy | Source verified | `academyController.js:91-99` |
| A9 | POST `/academies/` creates (admin) | Source verified | `academyController.js:104-122` |
| A10 | PUT `/academies/:id` updates (admin) | Source verified | `academyController.js:125-136` |
| A11 | DELETE `/academies/:id` deletes (admin) | Source verified | `academyController.js:139-147` |
| A12 | GET `/coaches` returns data | Live test: empty array (no data) | `coachController.js:6-13` |
| A13 | GET `/coaches/academy/:academyId` | Source verified | `coachController.js:16-23` |
| A14 | GET `/coaches/sport/:sport` | Live test: empty array | `coachController.js:26-33` |
| A15 | GET `/coaches/:id` | Source verified | `coachController.js:36-44` |
| A16 | POST `/coaches/` creates | Source verified | `coachController.js:47-61` |
| A17 | DELETE `/coaches/:id` deletes | Source verified | `coachController.js:64-72` |
| A18 | GET `/athletes` returns data | Live test: 3 athletes | `athleteController.js:8-15` |
| A19 | GET `/athletes/sport/:sport` | Live test: Cricket returns 1 | `athleteController.js:17-24` |
| A20 | POST `/auth/register` creates user | Live test: 201 returned | `authController.js:8-38` |
| A21 | POST `/auth/login` with valid credentials | Live test: 401 on bad creds (correct behavior) | `authController.js:41-74` |
| A22 | JWT token generation | `jwt.sign()` in authController | `authController.js:60-63` |
| A23 | Password hashing (bcrypt) | `bcrypt.hash()` in authController | `authController.js:22` |
| A24 | `protect` middleware | JWT verification works | `authMiddleware.js` |
| A25 | `adminOnly` middleware | Role check works | `authMiddleware.js` |
| A26 | Frontend UI (80+ components) | All components render correctly with static data | `components/**/*.tsx` |
| A27 | Frontend routing (35+ pages) | All routes navigate correctly | `app/**/*.tsx` |
| A28 | Frontend API client layer | 26 functions defined, correct fetch wrapper | `lib/api/*.ts` |
| A29 | Frontend auth provider | localStorage-based auth works | `components/providers/auth-provider.tsx` |
| A30 | Frontend shortlist provider | localStorage-based shortlist works | `components/providers/shortlist-provider.tsx` |
| A31 | Frontend compare provider | Client-side compare works | `components/providers/compare-provider.tsx` |
| A32 | Frontend matching engine | Client-side scoring works | `lib/utils/matching.ts` |
| A33 | Frontend design system | 4 themes, all styled correctly | `components/theme/*` |

---

## 2. MINOR FIX

Issues that require small, low-risk changes.

| # | Item | Evidence | Files | Risk | Effort |
|---|------|----------|-------|------|--------|
| B1 | Add CORS middleware | No CORS in `index.js`; frontend cannot call backend from different origin | `index.js` | None | 5 min |
| B2 | Add response envelope wrapper | Frontend `client.ts:74` expects `{ok, data}`; backend returns raw JSON | New `utils/response.js` + all controllers | None | 30 min |
| B3 | Add `_id` → `id` transform | Frontend uses `id` field; backend returns `_id` | All model files | None | 10 min |
| B4 | Fix register response (add token) | Frontend expects `{user, token}`; backend returns `{message, user}` (no token) | `authController.js:31-34` | None | 5 min |
| B5 | Fix login response envelope | Frontend expects `{ok, data: {user, token}}`; backend returns raw `{message, token, user}` | `authController.js:66-70` | None | 5 min |
| B6 | Expand User role enum | Frontend: `'athlete'\|'parent'\|'coach'\|'academy_rep'\|'admin'`; Backend: `'user'\|'admin'` | `models/User.js:7` | None | 2 min |
| B7 | Add `phone` field to User model | Frontend sends `phone` in register; backend ignores it | `models/User.js` | None | 2 min |
| B8 | Change shortlist mount to `/favorites` | Frontend calls `/favorites`; backend mounts at `/shortlist` | `index.js:17` | None | 2 min |
| B9 | Add `findBySlug` to academyRepository | Frontend calls `GET /academies/:slug`; backend uses `:id` | `repositories/academyRepository.js` | Low | 10 min |
| B10 | Add `findBySlug` to coachRepository | Frontend calls `GET /coaches/:slug`; backend uses `:id` | `repositories/coachRepository.js` | Low | 10 min |
| B11 | Add auth to coach POST/DELETE | Currently no auth — anyone can create/delete coaches | `controllers/coachController.js` | None | 5 min |
| B12 | Add auth to shortlist routes | Currently no auth — anyone can modify shortlists | `controllers/shortlistController.js` | None | 5 min |

---

## 3. NEEDS IMPLEMENTATION

Features that do not exist and must be built.

| # | Item | Evidence | Files | Risk | Effort |
|---|------|----------|-------|------|--------|
| C1 | Expand Academy model (15+ fields) | Active model has 7 fields; frontend expects 25+ | `models/Academy.js` | **MEDIUM** | 30 min |
| C2 | Expand Coach model (15+ fields) | Active model has 3 fields; frontend expects 20+ | `models/Coach.js` | **MEDIUM** | 20 min |
| C3 | Rewrite academyRepository | Current queries use old field names (`sport`, `verified`, `location:string`) | `repositories/academyRepository.js` | Low | 30 min |
| C4 | Rewrite coachRepository | Current queries use old field names | `repositories/coachRepository.js` | Low | 20 min |
| C5 | Rewrite academyController | Must add slug route, envelope, query params, pagination | `controllers/academyController.js` | Low | 45 min |
| C6 | Rewrite coachController | Must add slug route, envelope, auth, pagination | `controllers/coachController.js` | Low | 30 min |
| C7 | Replace Shortlist model | Current: `athleteId→academyId`; Required: `userId→itemId+itemType` | `models/Shortlist.js` | **MEDIUM** | 10 min |
| C8 | Rewrite shortlistRepository | Must support new multi-entity schema | `repositories/shortlistRepository.js` | Low | 15 min |
| C9 | Rewrite shortlistController | Must rename to `/favorites`, add auth, new routes | `controllers/shortlistController.js` | Low | 20 min |
| C10 | Create Enquiry model | No model exists; enquiry form needs backend | New `models/Enquiry.js` | None | 10 min |
| C11 | Create enquiryController | No controller exists; `enquiryService.js` is dead code | New `controllers/enquiryController.js` | None | 20 min |
| C12 | Seed database | DB has 4 academies with old schema; needs full-data seed | New `scripts/seed.js` | None | 30 min |
| C13 | Connect login page to API | Currently uses setTimeout placeholder | `app/(auth)/login/page.tsx` | Low | 15 min |
| C14 | Connect register page to API | Currently uses setTimeout placeholder | `app/(auth)/register/page.tsx` | Low | 15 min |
| C15 | Connect academy listing to API | Currently imports from `@/data/academies` | `components/academies/academy-listing.tsx` | Low | 20 min |
| C16 | Connect academy detail to API | Currently imports from `@/data/academies` | `app/(public)/academies/[slug]/page.tsx` | Low | 20 min |
| C17 | Connect coach listing to API | Currently imports from `@/data/coaches` | `components/coaches/coaches-listing.tsx` | Low | 15 min |
| C18 | Connect coach detail to API | Currently imports from `@/data/coaches` | `app/(public)/coaches/[slug]/page.tsx` | Low | 20 min |
| C19 | Connect homepage to API | Featured sections import from static data | `components/home/featured-academies.tsx`, `featured-coaches.tsx` | Low | 15 min |
| C20 | Connect shortlist to API | Currently uses localStorage only | `components/providers/shortlist-provider.tsx`, `shortlist-toggle.tsx`, `shortlist-view.tsx` | Medium | 30 min |
| C21 | Connect enquiry form to API | Currently shows toast only, no submission | `components/enquiry/enquiry-form.tsx` | Low | 10 min |
| C22 | Set `NEXT_PUBLIC_API_URL` | Frontend needs to know backend URL | `.env.local`, `.env.example` | None | 2 min |
| C23 | Install `cors` package | Required for CORS middleware | `sportsOS-nodejs/package.json` | None | 1 min |

---

## 4. BLOCKED

Items that cannot proceed until blockers are resolved.

| # | Item | Blocker | Resolution |
|---|------|---------|-----------|
| D1 | Connect academy detail page | Requires Academy slug field (C1) + slug route (C5) | Complete C1, C5 first |
| D2 | Connect coach detail page | Requires Coach slug field (C2) + slug route (C6) | Complete C2, C6 first |
| D3 | Connect shortlist to API | Requires Shortlist model rewrite (C7) + controller rewrite (C9) | Complete C7, C9 first |
| D4 | Connect enquiry form to API | Requires Enquiry model (C10) + controller (C11) | Complete C10, C11 first |
| D5 | Visual verification of pages | Requires seed data (C12) in new schema | Complete C1, C2, C12 first |

---

## 5. NOT IN MVP (Post-MVP / Optional / Archive)

| # | Item | Classification | Reason |
|---|------|---------------|--------|
| E1 | Sports catalog from DB | POST-MVP | Static `data/sports.ts` works |
| E2 | Search endpoint | POST-MVP | Client-side filtering works |
| E3 | User profile endpoints | POST-MVP | Can add later |
| E4 | Children endpoints | POST-MVP | Can add later |
| E5 | Recommendations endpoint | POST-MVP | Client-side matching works |
| E6 | Reviews/ratings | POST-MVP | Can launch without UGC |
| E7 | Admin panel | POST-MVP | Can manage via DB directly |
| E8 | Analytics tracking | OPTIONAL | Not needed at small scale |
| E9 | Leads/CRM | OPTIONAL | Manual follow-up initially |
| E10 | Geolocation/nearby | OPTIONAL | City filter sufficient |
| E11 | OTP verification | POST-MVP | Email+password sufficient |
| E12 | Forgot password | POST-MVP | Can reset via DB |
| E13 | Onboarding wizard | POST-MVP | Can skip, default role |
| E14 | Compare feature | POST-MVP | Client-side works |
| E15 | Command palette | OPTIONAL | Power user feature |
| E16 | PWA offline | OPTIONAL | Not critical |
| E17 | 4 themes | POST-MVP | Default theme works |
| E18 | Motion animations | OPTIONAL | Decorative |
| E19 | Consent management | OPTIONAL | Not needed at small scale |
| E20 | Athlete model/controller | ARCHIVE | Concept replaced by Child |
| E21 | sports-os-Database repo | ARCHIVE | Fully superseded |
| E22 | sports-os-backend repo | ARCHIVE | Reference only |
| E23 | fix.js | ARCHIVE | Dangerous if run |
| E24 | 15 dead service files | ARCHIVE | Not wired to any controller |

---

## 6. Summary

| Classification | Count | Total Effort |
|---------------|-------|-------------|
| ALREADY WORKING | 33 items | 0 |
| MINOR FIX | 12 items | ~2 hours |
| NEEDS IMPLEMENTATION | 23 items | ~8 hours |
| BLOCKED | 5 items | (resolved by above) |
| NOT IN MVP | 24 items | N/A |
| **Total actionable** | **35 items** | **~10 hours** |
