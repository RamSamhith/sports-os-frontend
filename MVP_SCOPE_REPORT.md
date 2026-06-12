# MVP Scope Report

> Generated: 2026-06-12
> Goal: Fastest path to a working SportsOS product

---

## 1. Core User Journey (MVP)

A usable SportsOS platform requires one thing: **a parent or athlete can discover academies, view details, and send an enquiry.**

```
Homepage → Browse Academies → View Academy Detail → Register/Login → Shortlist → Enquire
                Browse Coaches → View Coach Detail → Register/Login → Shortlist → Enquire
```

Everything else is post-launch.

---

## 2. Feature Classification

### MVP — Required for Launch

| # | Feature | Why Required | Effort |
|---|---------|-------------|--------|
| M1 | Academy listing from DB | Core discovery — current static data is not a product | Medium |
| M2 | Academy detail from DB | Core discovery — must show real data | Medium |
| M3 | Coach listing from DB | Core discovery | Medium |
| M4 | Coach detail from DB | Core discovery | Medium |
| M5 | User registration | Must identify users for shortlist/enquiry | Small |
| M6 | User login | Must authenticate users | Small |
| M7 | Shortlist academies/coaches | Core engagement — saves items for later | Small |
| M8 | Enquiry form submission | Core conversion — parent contacts academy | Small |
| M9 | CORS enabled | Frontend cannot call backend without it | Trivial |
| M10 | Response envelope alignment | Frontend client expects `{ok, data}` format | Small |
| M11 | `_id` → `id` transformation | Frontend expects `id` field, backend returns `_id` | Trivial |

### POST-MVP — After Initial Launch

| # | Feature | Why Post-MVP | Effort |
|---|---------|-------------|--------|
| P1 | Sports catalog from DB | Can use static data initially | Small |
| P2 | Search with text queries | Listing filters work for now | Medium |
| P3 | Enquiry history page | Users can see past enquiries later | Small |
| P4 | Profile management | Users can update profile later | Small |
| P5 | Children profiles | Parent-child flow is complex, defer | Medium |
| P6 | Recommendations engine | Static featured items work for now | Medium |
| P7 | Compare academies/coaches | Nice-to-have, not essential | Small |
| P8 | Reviews and ratings | Can launch without UGC | Medium |
| P9 | Forgot password / OTP | Can add password reset later | Medium |
| P10 | Onboarding wizard | Can skip, assign default role | Small |

### OPTIONAL — May Never Be Needed

| # | Feature | Why Optional | Effort |
|---|---------|-------------|--------|
| O1 | Admin panel | Can manage via direct DB access | Large |
| O2 | Analytics tracking | Not needed at small scale | Medium |
| O3 | Leads/CRM pipeline | Manual follow-up initially | Large |
| O4 | Geolocation / nearby | Not needed if city filter works | Medium |
| O5 | Command palette (Cmd+K) | Advanced UX, not essential | Small |
| O6 | PWA offline support | Nice-to-have | Small |
| O7 | Theme system (4 themes) | Works with static defaults | Small |
| O8 | Motion animations | Decorative, not functional | Trivial |
| O9 | Consent management | Can add privacy controls later | Small |
| O10 | Version check / update banner | Not needed at small scale | Trivial |

### ARCHIVE — Never Build

| # | Feature | Why Archive | Reason |
|---|---------|-----------|--------|
| A1 | Athlete model / athleteController | Concept replaced by Child | Active schema uses athlete→academy; canonical uses parent→child |
| A2 | sports-os-Database repository | Fully superseded | Obsolete |
| A3 | sports-os-backend repository | Reference only | Dead code |
| A4 | fix.js scaffolding script | Dangerous if run | Overwrites files |
| A5 | Geospatial $near queries | Over-engineering for MVP | City filter is sufficient |

---

## 3. MVP Phased Implementation

### MVP Phase 1: Connect (Days 1-3)

**Goal:** Frontend loads real data from backend. User can register and login.

| Task | Files Changed | Effort |
|------|--------------|--------|
| Add CORS middleware | `index.js` | Trivial |
| Add response envelope to all controllers | `authController.js`, `academyController.js`, `coachController.js`, `shortlistController.js` | Small |
| Add `_id` → `id` transform (schema-level `toJSON`) | All model files | Trivial |
| Fix auth register response (return token) | `authController.js` | Trivial |
| Fix auth login response (wrap in envelope) | `authController.js` | Trivial |
| Add `NEXT_PUBLIC_API_URL` to `.env.example` | `.env.example` | Trivial |
| Connect frontend login page | `app/(auth)/login/page.tsx` | Small |
| Connect frontend register page | `app/(auth)/register/page.tsx` | Small |
| Verify auth flow end-to-end | — | Small |

**Exit criteria:** User can register, login, and see authenticated state in navbar.

**Schema changes required for Phase 1:**
- User model: Add `phone` field (optional, for future OTP)
- User model: Change role enum to match frontend: `'athlete' | 'parent' | 'coach' | 'academy_owner' | 'admin'`

### MVP Phase 2: Display (Days 4-7)

**Goal:** Academy and coach data loads from MongoDB. Pages render correctly.

| Task | Files Changed | Effort |
|------|--------------|--------|
| Expand Academy model with required fields | `models/Academy.js` | Medium |
| Expand Coach model with required fields | `models/Coach.js` | Medium |
| Add slug field + unique index to Academy | `models/Academy.js` | Trivial |
| Add slug field + unique index to Coach | `models/Coach.js` | Trivial |
| Rewrite academyRepository for new schema | `repositories/academyRepository.js` | Medium |
| Rewrite coachRepository for new schema | `repositories/coachRepository.js` | Medium |
| Rewrite academyController with envelope + slug route | `controllers/academyController.js` | Medium |
| Rewrite coachController with envelope + slug route | `controllers/coachController.js` | Medium |
| Add pagination to list endpoints | All controllers | Small |
| Seed 5-10 academies with full data | Seed script | Small |
| Seed 3-5 coaches with full data | Seed script | Small |
| Connect frontend academy listing | `academies/page.tsx`, `academy-listing.tsx` | Small |
| Connect frontend academy detail | `academies/[slug]/page.tsx` | Small |
| Connect frontend coach listing | `coaches/page.tsx`, `coaches-listing.tsx` | Small |
| Connect frontend coach detail | `coaches/[slug]/page.tsx` | Small |
| Verify listing + detail pages render correctly | — | Small |

**Exit criteria:** Homepage shows academies/coaches from DB. Listing pages work with filters. Detail pages show full data.

**Schema changes required for Phase 2:**

Academy model — add these fields:
```
slug (String, required, unique)
description (String)
city (String)
state (String)
address (String)
sportsOffered ([String])           ← rename from "sport"
facilities ([String])              ← enum array
trainingLevels ([String])          ← enum array
certifications ([{name, issuer, year, documentUrl}])
contact ({phone, email, website})
feeRange ({min, max, currency})
verificationStatus (String, enum)  ← replace "verified" Boolean
status (String, enum)
isFeatured (Boolean)
avgRating (Number)
reviewCount (Number)
coverImage (String)
gallery ([String])
```

Coach model — add these fields:
```
slug (String, required, unique)
avatar (String)
bio (String)
sportsCoached ([String])           ← rename from "sport", change to array
specialization ([String])
experienceYears (Number)
city (String)
state (String)
contact ({phone, email})
certifications ([{name, issuer, year, documentUrl}])
verificationStatus (String, enum)
status (String, enum)
isFeatured (Boolean)
avgRating (Number)
reviewCount (Number)
```

### MVP Phase 3: Engage (Days 8-10)

**Goal:** Users can shortlist and enquire. Core loop is complete.

| Task | Files Changed | Effort |
|------|--------------|--------|
| Replace Shortlist model with multi-entity schema | `models/Shortlist.js` | Small |
| Rewrite shortlistRepository | `repositories/shortlistRepository.js` | Small |
| Rewrite shortlistController (rename to /favorites) | `controllers/shortlistController.js` | Small |
| Mount as `/favorites` in index.js | `index.js` | Trivial |
| Create enquiryController | `controllers/enquiryController.js` | Medium |
| Create Enquiry model | `models/Enquiry.js` | Small |
| Mount as `/enquiries` in index.js | `index.js` | Trivial |
| Connect frontend shortlist toggle | `shortlist-toggle.tsx` | Small |
| Connect frontend shortlist page | `shortlist/page.tsx` | Small |
| Connect frontend enquiry form | `enquiry/[type]/[id]/page.tsx` | Small |
| Connect homepage (academy/coach cards from API) | `page.tsx` + featured components | Small |
| End-to-end testing | — | Small |

**Exit criteria:** Full user journey works: discover → browse → shortlist → enquire.

**Schema changes required for Phase 3:**

Shortlist model — replace entirely:
```
userId (ObjectId, ref User, required)
contextChildId (ObjectId, ref Child, default null)
itemId (ObjectId, required)
itemType (String, enum: 'academy'|'coach'|'sport', required)
```
Unique index: compound on `(userId, itemId, itemType)`

Enquiry model — create:
```
userId (ObjectId, ref User)
targetType (String, enum: 'academy'|'coach', required)
targetId (ObjectId, required)
intent (String, enum: 'contact'|'callback'|'trial'|'enrollment_interest', required)
parentInfo ({name, email, phone})
childInfo ({name, age})
sportInterest (String)
message (String)
status (String, enum, default: 'submitted')
createdAt (Date)
```

---

## 4. Minimum Schema Changes

### 4.1 Changes to Existing Models

**User.js** — 2 changes:
| Change | Current | Target | Lines |
|--------|---------|--------|-------|
| Add `phone` field | Not present | `{ type: String }` | 1 line |
| Fix role enum | `['user', 'admin']` | `['athlete', 'parent', 'coach', 'academy_owner', 'admin']` | 1 line |

**Academy.js** — replace entire file:
| Change | Current | Target |
|--------|---------|--------|
| Fields | 7 fields | 25+ fields |
| `sport` → `sportsOffered` | Rename | |
| `location` (String) → GeoJSON | Type change | |
| `verified` (Boolean) → `verificationStatus` (enum) | Replace field | |
| Add slug, description, city, state, etc. | New fields | |

**Coach.js** — replace entire file:
| Change | Current | Target |
|--------|---------|--------|
| Fields | 3 fields | 20+ fields |
| `sport` (String) → `sportsCoached` ([String]) | Rename + type change | |
| Add slug, avatar, bio, etc. | New fields | |

**Shortlist.js** — replace entire file:
| Change | Current | Target |
|--------|---------|--------|
| Schema model | athleteId→academyId | userId→itemId+itemType |
| Fields | 2 refs | 4 fields |

### 4.2 New Models

| Model | Fields | Lines of Code |
|-------|--------|--------------|
| Enquiry | 10 fields | ~30 lines |
| Sport | 12 fields | ~40 lines (POST-MVP) |

### 4.3 Models That Can Remain Unchanged for MVP

| Model | File | Status |
|-------|------|--------|
| Role | Not created | Not needed for MVP |
| OTP | Not created | Not needed for MVP |
| AcademyImage | Not created | Use `gallery` array on Academy instead |
| AcademyFacility | Not created | Use `facilities` array on Academy instead |
| CoachCertificate | Not created | Use `certifications` array on Coach instead |
| Lead | Not created | POST-MVP |
| LeadActivity | Not created | POST-MVP |
| Child | Not created | POST-MVP |
| Review | Not created | POST-MVP |
| Analytics | Not created | POST-MVP |
| VerificationCase | Not created | POST-MVP |

---

## 5. Controllers: MVP vs Post-MVP

### Controllers to BUILD for MVP

| Controller | Routes | Methods | Effort |
|-----------|--------|---------|--------|
| `academyController.js` (rewrite) | `GET /academies`, `GET /academies/:slug`, `POST /academies/` (admin), `PUT /academies/:id` (admin), `DELETE /academies/:id` (admin) | 5 | Medium |
| `coachController.js` (rewrite) | `GET /coaches`, `GET /coaches/:slug`, `POST /coaches/` | 3 | Medium |
| `shortlistController.js` (rewrite) | `GET /favorites`, `POST /favorites`, `DELETE /favorites/:type/:id` | 3 | Small |
| `authController.js` (extend) | `POST /auth/register` (fix), `POST /auth/login` (fix) | 2 fixed | Small |
| `enquiryController.js` (new) | `POST /enquiries`, `GET /enquiries` | 2 | Small |

**Total MVP controllers: 5** (3 rewrites, 1 extension, 1 new)

### Controllers for POST-MVP

| Controller | When | Effort |
|-----------|------|--------|
| `sportsController.js` | Phase 4 | Small |
| `searchController.js` | Phase 4 | Medium |
| `userController.js` | Phase 5 | Small |
| `childController.js` | Phase 5 | Medium |
| `reviewController.js` | Phase 6 | Medium |
| `adminController.js` | Phase 6 | Large |
| `analyticsController.js` | Phase 7 | Medium |
| `recommendationController.js` | Phase 7 | Medium |
| `leadController.js` | Archive | — |
| `locationController.js` | Archive | — |
| `compareController.js` | Archive | — |

### Controllers That Never Need to Be Built

| Controller | Reason |
|-----------|--------|
| `leadController.js` | CRM is over-engineering for launch |
| `locationController.js` | City filter is sufficient |
| `compareController.js` | Client-side compare works fine |

---

## 6. What Stays Unchanged for MVP

### Frontend Files — No Changes

| Category | Files | Reason |
|----------|-------|--------|
| All UI components | `components/**/*.tsx` (80+ files) | UI is complete |
| All layout components | `components/layout/*.tsx` | Layout is complete |
| All hooks | `lib/hooks/*.ts` (20+ files) | Hooks work with any data source |
| All utilities | `lib/utils/*.ts` | Utilities are data-source agnostic |
| All type definitions | `types/**/*.ts` | Types are the reference |
| All public pages | `app/(public)/about`, `trust`, `contact`, `privacy`, `terms`, `cookies` | Static pages |
| All auth pages (structure) | `app/(auth)/*` | Page structure stays, only data wiring changes |
| All private pages (structure) | `app/(private)/*` | Page structure stays |
| All admin pages | `app/(admin)/*` | Not connected in MVP |
| Design system | `app/(public)/design/*` | Reference only |
| PWA manifest | `manifest.ts`, `robots.ts`, `sitemap.ts` | Infrastructure |
| CSS | `globals.css`, `tokens.css` | Styling |

### Frontend Files — Minimal Changes Only

| File | Change | Lines |
|------|--------|-------|
| `app/(auth)/login/page.tsx` | Replace setTimeout with `login()` API call | ~5 lines |
| `app/(auth)/register/page.tsx` | Replace setTimeout with `register()` API call | ~5 lines |
| `app/(public)/academies/page.tsx` | Replace static import with `getAcademies()` | ~10 lines |
| `app/(public)/academies/[slug]/page.tsx` | Replace static import with `getAcademy(slug)` | ~10 lines |
| `app/(public)/coaches/page.tsx` | Replace static import with `getCoaches()` | ~10 lines |
| `app/(public)/coaches/[slug]/page.tsx` | Replace static import with `getCoach(slug)` | ~10 lines |
| `app/(public)/page.tsx` | Replace static imports with API calls for featured sections | ~15 lines |
| `components/shortlist/shortlist-toggle.tsx` | Replace localStorage with `addFavorite()`/`removeFavorite()` | ~15 lines |
| `app/(public)/shortlist/page.tsx` | Replace localStorage reads with `getFavorites()` | ~10 lines |
| `app/(public)/enquiry/[type]/[id]/page.tsx` | Wire form submit to `createEnquiry()` | ~10 lines |

**Total frontend file changes: ~10 files, ~100 lines changed**

### Backend Files — No Changes Needed

| File | Reason |
|------|--------|
| `config/db.js` | MongoDB connection works as-is |
| `middleware/authMiddleware.js` | JWT verify + adminOnly works as-is |
| `repositories/athleteRepository.js` | Not used in MVP (athlete concept deferred) |
| `repositories/academyRepository.js` | Needs rewrite (covered in Phase 2) |
| `repositories/coachRepository.js` | Needs rewrite (covered in Phase 2) |
| `repositories/shortlistRepository.js` | Needs rewrite (covered in Phase 3) |

---

## 7. Effort Summary

### MVP Phase 1: Connect (3 days)

| Task | Effort | Risk |
|------|--------|------|
| CORS middleware | Trivial | None |
| Response envelope | Small | None |
| `_id` → `id` transform | Trivial | None |
| Auth fixes (register token, login wrap) | Small | Low |
| User model (phone, role enum) | Trivial | Low |
| Connect login page | Small | Low |
| Connect register page | Small | Low |
| End-to-end auth test | Small | None |

### MVP Phase 2: Display (4 days)

| Task | Effort | Risk |
|------|--------|------|
| Academy model expansion | Medium | Medium — schema change affects existing data |
| Coach model expansion | Medium | Medium — same concern |
| Slug fields + indexes | Trivial | None |
| Rewrite academyRepository | Medium | Medium — new query patterns |
| Rewrite coachRepository | Medium | Medium — new query patterns |
| Rewrite academyController (slug + envelope) | Medium | Low |
| Rewrite coachController (slug + envelope) | Medium | Low |
| Pagination support | Small | None |
| Seed data (5-10 academies, 3-5 coaches) | Small | None |
| Connect 4 frontend pages | Small | Low |

### MVP Phase 3: Engage (3 days)

| Task | Effort | Risk |
|------|--------|------|
| Replace Shortlist model | Small | Medium — breaking change |
| Rewrite shortlistRepository | Small | Low |
| Rewrite shortlistController (/favorites) | Small | Low |
| Create Enquiry model | Small | None |
| Create enquiryController | Small | Low |
| Connect shortlist toggle + page | Small | Low |
| Connect enquiry form | Small | Low |
| Connect homepage | Small | Low |
| End-to-end testing | Small | None |

### Total MVP Effort

| Phase | Days | Description |
|-------|------|-------------|
| Phase 1 | 3 | Auth works, frontend talks to backend |
| Phase 2 | 4 | Real data displays on listing + detail pages |
| Phase 3 | 3 | Shortlist + enquiry work end-to-end |
| **Total** | **10** | **Working product** |

---

## 8. Seed Data Requirement

MVP Phase 2 requires real data in MongoDB. Minimum seed set:

### Academies (5-10)

| Academy | Sport | City | Verified |
|---------|-------|------|----------|
| National Cricket Academy | Cricket | Bengaluru | Yes |
| Mumbai Football Academy | Football | Mumbai | Yes |
| Gopichand Badminton Academy | Badminton | Hyderabad | Yes |
| Lakshmi Tennis Academy | Tennis | Chennai | Yes |
| India Hockey Academy | Hockey | Delhi | Yes |

Each academy needs: name, slug, description, city, state, sportsOffered, facilities, trainingLevels, contact, feeRange, verificationStatus, status, coverImage.

### Coaches (3-5)

| Coach | Sport | City | Verified |
|-------|-------|------|----------|
| Rahul Dravid | Cricket | Bengaluru | Yes |
| Pullela Gopichand | Badminton | Hyderabad | Yes |
| Mahesh Bhupathi | Tennis | Chennai | Yes |

Each coach needs: name, slug, bio, sportsCoached, specialization, experienceYears, city, state, verificationStatus, status.

### Users

No seed users — users register through the app.

---

## 9. Risk Assessment for MVP

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Schema change breaks existing data | Low (no production data yet) | High | Run seed script after schema change |
| Frontend pages don't render correctly with new data | Medium | Medium | Test each page after connection |
| Auth token flow has edge cases | Low | Medium | Test register→login→protected page flow |
| Shortlist multi-entity model is complex | Low | Low | Simple CRUD, well-understood pattern |
| Enquiry form submission fails silently | Low | Medium | Add error states to form |
| CORS misconfiguration | Low | High | Test with browser dev tools |
| Slug collisions | Low | Low | Unique index prevents duplicates |
| Pagination breaks existing UI | Low | Low | Frontend already handles pagination props |

---

## 10. What NOT to Build for MVP

| Feature | Why Skip | Can Add Later? |
|---------|---------|---------------|
| Sports catalog from DB | Static `data/sports.ts` works fine | Yes, Phase 4 |
| Search | Listing filters cover MVP use case | Yes, Phase 4 |
| Parent-child profiles | Complex, not needed for initial launch | Yes, Phase 5 |
| Reviews/ratings | Can launch without UGC | Yes, Phase 6 |
| Admin panel | Manage via MongoDB compass/CLI | Yes, Phase 6 |
| Analytics | Not needed at small scale | Yes, Phase 7 |
| Recommendations | Static featured items work | Yes, Phase 7 |
| Leads/CRM | Manual follow-up initially | Yes, Phase 8 |
| Geolocation | City filter is sufficient | Maybe never |
| OTP verification | Email+password is sufficient for MVP | Yes, Phase 5 |
| Forgot password | Can reset via DB manually | Yes, Phase 5 |
| Compare feature | Nice-to-have, not essential | Yes, Phase 4 |
| Command palette | Power user feature | Maybe never |
| PWA offline | Not critical for launch | Maybe never |
| 4 themes | Default theme works | Yes, post-MVP |
| Motion animations | Decorative | Maybe never |
| Consent management | Not needed at small scale | Yes, post-MVP |
