# Master Integration Plan

> Generated: 2026-06-12
> Based on: ARCHITECTURE_REPORT.md, FRONTEND_BACKEND_COMPATIBILITY_REPORT.md, DATABASE_ALIGNMENT_REPORT.md, API_GAP_REPORT.md

---

## 1. Single Source of Truth Selection

### 1.1 Backend Repository

**Selected: `sportsOS-nodejs/`**

| Criterion | sportsOS-nodejs | sports-os-backend | sports-os-Database |
|-----------|----------------|-------------------|-------------------|
| Has entry point (`index.js`) | YES | NO | YES (`server.js`, wrong name) |
| Has `package.json` | YES | NO | YES |
| Has runnable controllers | YES (5) | NO | NO |
| Has route definitions | YES (27 endpoints) | NO | NO |
| Has auth middleware | YES | NO | NO |
| Has MongoDB connection | YES | NO | YES |
| Has repositories (data access) | YES (4) | NO | NO |
| Git commits | 2 | 1 | 1 |
| Currently deployable | YES (with .env) | NO | NO |

**sports-os-backend is demoted to reference-only.** Its `models/index.js` is the canonical schema definition, but the repo has no runnable code.

**sports-os-Database is archived.** Superseded entirely.

### 1.2 Schema Source of Truth

**Selected: `sports-os-backend/models/index.js` for schema definitions, adapted into `sportsOS-nodejs/models/` as individual files.**

Rationale:
- `sports-os-backend/models/index.js` (511 lines) defines all 17 models with full field coverage, proper types, indexes, and enums — matching frontend `types/domain/*.ts`
- `sportsOS-nodejs/models/` currently has only 5 simplified models that are incompatible with both the frontend and the canonical schemas
- The canonical schema was explicitly written to match frontend types (evidence: line 4 comment: "Updated to fully match frontend types (types/domain/*.ts)")

**Frontend `types/domain/*.ts`** remains the ultimate reference for field names, types, and enums. The canonical backend schema was derived from it.

---

## 2. Schema Source of Truth Per Model

### 2.1 User

| Source | Role |
|--------|------|
| `types/domain/user.ts` | **Authoritative** for field names, types, enums |
| `sports-os-backend/models/index.js` lines 16-72 | **Authoritative** for Mongoose implementation |
| `sportsOS-nodejs/models/User.js` | **Superseded** — must be replaced |

**Canonical User fields** (from `sports-os-backend/models/index.js`):

```
name, email, password, role, phone, phoneVerified, isVerified,
isActive, isBanned, onboardingCompleted, adminRole, location (GeoJSON),
city, state, pincode, preferences, consent, themePreference, lastLoginAt
```

**Role enum:** `'athlete' | 'parent' | 'coach' | 'academy_owner' | 'admin'`

**Frontend mismatch:** `academy_rep` (user.ts:3) vs `academy_owner` (models/index.js:24). Fix required — see Section 6.

### 2.2 Academy

| Source | Role |
|--------|------|
| `types/domain/academy.ts` | **Authoritative** for field names, types, enums |
| `sports-os-backend/models/index.js` lines 98-178 | **Authoritative** for Mongoose implementation |
| `sportsOS-nodejs/models/Academy.js` | **Superseded** — must be replaced |
| `sports-os-Database/models/Academy.js` | **Obsolete** — archived |

**Canonical Academy fields** (from `sports-os-backend/models/index.js`):

```
name, slug, description, city, state, address, sportsOffered,
facilities, trainingLevels, batchInformation, certifications,
achievementSignals, contact, feeRange, ownerId, isVerified,
verificationStatus, status, isFeatured, avgRating, reviewCount,
shortlistCount, rankScore, location (GeoJSON), coverImage, gallery,
lastUpdatedAt, indexedAt
```

**Key naming:** `sportsOffered` (not `sport`), `verificationStatus` (not `verified` boolean).

### 2.3 Coach

| Source | Role |
|--------|------|
| `types/domain/coach.ts` | **Authoritative** for field names, types, enums |
| `sports-os-backend/models/index.js` lines 194-253 | **Authoritative** for Mongoose implementation |
| `sportsOS-nodejs/models/Coach.js` | **Superseded** — must be replaced |
| `sports-os-Database/models/Coach.js` | **Obsolete** — archived |

**Canonical Coach fields** (from `sports-os-backend/models/index.js`):

```
name, slug, avatar, bio, sportsCoached, specialization,
experienceYears, experience, city, state, academyId, userId,
contact, feeRange, certifications, isVerified, verificationStatus,
status, isFeatured, avgRating, reviewCount, rankScore, location (GeoJSON),
lastUpdatedAt
```

**Key naming:** `sportsCoached` (array, not singular `sport`).

### 2.4 Shortlist

| Source | Role |
|--------|------|
| `types/domain/shortlist.ts` | **Authoritative** for field names, types |
| `sports-os-backend/models/index.js` lines 307-314 | **Authoritative** for Mongoose implementation |
| `sportsOS-nodejs/models/Shortlist.js` | **Superseded** — must be replaced |
| `sports-os-Database/models/Shortlist.js` | **Obsolete** — archived |

**Canonical Shortlist fields** (from `sports-os-backend/models/index.js`):

```
userId (ref User), contextChildId (ref Child), itemId (ObjectId),
itemType (enum: 'academy'|'coach'|'sport')
```

**Unique index:** compound on `(userId, itemId, itemType)`

**Completely different from active model** which uses `athleteId→academyId`. The active model cannot be patched — it must be replaced entirely.

### 2.5 Sport

| Source | Role |
|--------|------|
| `types/domain/sport.ts` | **Authoritative** for field names, types, enums |
| `sports-os-backend/models/index.js` lines 265-304 | **Authoritative** for Mongoose implementation |
| `sportsOS-nodejs/models/Sport.js` | **DOES NOT EXIST** — must be created |
| `sports-os-Database/models/Sport.js` | **DOES NOT EXIST** |

**Canonical Sport fields** (from `sports-os-backend/models/index.js`):

```
name, slug, description, icon, coverImage, category, status,
competitionPathway, explorationGuidance, difficulty, ageRange,
careerOpportunities
```

**Category enum:** `'team' | 'individual' | 'combat' | 'racquet' | 'aquatic' | 'athletics' | 'other'`

---

## 3. File Disposition

### 3.1 sportsOS-nodejs/ — Files to KEEP

| File | Reason |
|------|--------|
| `index.js` | Entry point — add missing route mounts |
| `package.json` | Dependency manifest |
| `config/db.js` | MongoDB connection |
| `middleware/authMiddleware.js` | JWT auth — extend with more middleware |
| `controllers/authController.js` | Working auth — extend with OTP, /me, logout |
| `controllers/academyController.js` | Working CRUD — rewrite for new schema |
| `controllers/athleteController.js` | Working CRUD — may be removed if athlete concept drops |
| `controllers/coachController.js` | Working CRUD — add auth, rewrite for new schema |
| `controllers/shortlistController.js` | Working CRUD — rewrite entirely for new schema |
| `repositories/academyRepository.js` | Data access — rewrite for new schema |
| `repositories/athleteRepository.js` | Data access — may be removed |
| `repositories/coachRepository.js` | Data access — rewrite for new schema |
| `repositories/shortlistRepository.js` | Data access — rewrite entirely |
| `fix.js` | Keep for reference only — DO NOT RUN (overwrites files) |

### 3.2 sportsOS-nodejs/ — Files to MERGE (replace active with canonical)

| File | Action | Source |
|------|--------|--------|
| `models/User.js` | **REPLACE** with canonical schema from `sports-os-backend/models/index.js` lines 16-74 | Canonical |
| `models/Academy.js` | **REPLACE** with canonical schema from `sports-os-backend/models/index.js` lines 98-178 | Canonical |
| `models/Coach.js` | **REPLACE** with canonical schema from `sports-os-backend/models/index.js` lines 194-253 | Canonical |
| `models/Shortlist.js` | **REPLACE** with canonical schema from `sports-os-backend/models/index.js` lines 307-314 | Canonical |

### 3.3 sportsOS-nodejs/ — Files to CREATE (new model files)

| File | Source |
|------|--------|
| `models/Sport.js` | Extract from `sports-os-backend/models/index.js` lines 265-304 |
| `models/Role.js` | Extract from `sports-os-backend/models/index.js` lines 77-81 |
| `models/OTP.js` | Extract from `sports-os-backend/models/index.js` lines 84-95 |
| `models/Enquiry.js` | Extract from `sports-os-backend/models/index.js` lines 317-366 |
| `models/Lead.js` | Extract from `sports-os-backend/models/index.js` lines 369-392 |
| `models/LeadActivity.js` | Extract from `sports-os-backend/models/index.js` lines 395-410 |
| `models/Child.js` | Extract from `sports-os-backend/models/index.js` lines 413-430 |
| `models/Review.js` | Extract from `sports-os-backend/models/index.js` lines 433-450 |
| `models/Analytics.js` | Extract from `sports-os-backend/models/index.js` lines 453-459 |
| `models/VerificationCase.js` | Extract from `sports-os-backend/models/index.js` lines 462-490 |
| `models/AcademyImage.js` | Extract from `sports-os-backend/models/index.js` lines 181-185 |
| `models/AcademyFacility.js` | Extract from `sports-os-backend/models/index.js` lines 188-191 |
| `models/CoachCertificate.js` | Extract from `sports-os-backend/models/index.js` lines 256-262 |

### 3.4 sportsOS-nodejs/ — Files to CREATE (new controllers)

| File | Service Methods to Wire |
|------|------------------------|
| `controllers/sportsController.js` | sportsService (7 methods) |
| `controllers/searchController.js` | searchService (5 methods) |
| `controllers/enquiryController.js` | enquiryService (5 methods) |
| `controllers/childController.js` | parentChildService (6 methods) |
| `controllers/userController.js` | authService profile methods (5 methods) |
| `controllers/reviewController.js` | reviewService (7 methods) |
| `controllers/adminController.js` | adminService (8 methods) |
| `controllers/analyticsController.js` | analyticsService (8 methods) |
| `controllers/leadController.js` | leadService (6 methods) |
| `controllers/locationController.js` | locationService (3 methods) |
| `controllers/compareController.js` | compareService (2 methods) |
| `controllers/recommendationController.js` | (new — no service exists) |

### 3.5 sportsOS-nodejs/ — Files to ARCHIVE (dead code, keep for reference)

| File | Reason |
|------|--------|
| `services/*.js` (all 15) | Dead code — not wired to any controller. Keep for reference when building new controllers. Eventually delete once controllers are built. |

### 3.6 sportsOS-nodejs/ — Files to IGNORE

| File | Reason |
|------|--------|
| `fix.js` | One-time scaffolding script. Running it overwrites manual changes to User.js, authMiddleware.js, authController.js, academyController.js, athleteController.js, index.js. Keep but never run. |

### 3.7 sports-os-backend/ — Entire Repository

| Action | Reason |
|--------|--------|
| **ARCHIVE** | No entry point, no package.json, no runnable code. Single commit. `models/index.js` is the canonical schema reference — already extracted above. Services are byte-for-byte identical copies of sportsOS-nodejs services. |

### 3.8 sports-os-Database/ — Entire Repository

| Action | Reason |
|--------|--------|
| **ARCHIVE** | Obsolete. Superseded by sportsOS-nodejs. Numeric IDs, no routes, no middleware, hardcoded seed test. |

### 3.9 Frontend (root) — Files to KEEP

| File/Dir | Reason |
|----------|--------|
| `app/` | All pages — keep as-is |
| `components/` | All components — keep as-is |
| `lib/api/` | API client — keep, will be connected |
| `lib/hooks/` | Hooks — keep as-is |
| `lib/utils/` | Utilities — keep as-is |
| `types/` | TypeScript types — keep as-is (authoritative) |
| `data/` | Static data — keep until API is connected, then deprecate |
| `config/` | Config — keep as-is |
| `public/` | Static assets — keep as-is |
| `scripts/` | Build scripts — keep as-is |

### 3.10 Frontend — Files to MODIFY (connection only, no UI changes)

| File | Change | Risk |
|------|--------|------|
| `lib/api/client.ts` | Ensure `NEXT_PUBLIC_API_URL` is set | LOW |
| `.env.example` | Add `NEXT_PUBLIC_API_URL` | LOW |
| `app/(public)/academies/[slug]/page.tsx` | Replace static import with API call | MEDIUM |
| `app/(public)/coaches/[slug]/page.tsx` | Replace static import with API call | MEDIUM |
| `app/(public)/sports/[slug]/page.tsx` | Replace static import with API call | MEDIUM |
| `app/(public)/academies/page.tsx` | Replace static import with API call | MEDIUM |
| `app/(public)/coaches/page.tsx` | Replace static import with API call | MEDIUM |
| `app/(public)/sports/page.tsx` | Replace static import with API call | MEDIUM |
| `app/(auth)/login/page.tsx` | Replace setTimeout with API call | LOW |
| `app/(auth)/register/page.tsx` | Replace setTimeout with API call | LOW |
| `components/providers/shortlist-provider.tsx` | Replace localStorage with API calls | MEDIUM |
| `components/shortlist/shortlist-toggle.tsx` | Replace localStorage with API calls | MEDIUM |
| `app/(public)/enquiry/[type]/[id]/page.tsx` | Wire form to API | LOW |
| `app/(public)/search/page.tsx` | Wire to API search endpoint | MEDIUM |

---

## 4. Integration Order

The integration must follow a strict dependency chain. Each phase must be complete before the next begins.

### Phase 0: Schema Foundation (no dependencies)

```
Step 0.1: Create missing model files in sportsOS-nodejs/models/
          (13 new files — extract from sports-os-backend/models/index.js)
          
Step 0.2: Replace existing 4 model files with canonical schemas
          (User.js, Academy.js, Coach.js, Shortlist.js)
          
Step 0.3: Add missing npm dependencies to sportsOS-nodejs/package.json
          (cors, helmet, morgan, express-validator or zod)
          
Step 0.4: Add CORS middleware to index.js
          
Step 0.5: Verify MongoDB connection with new schemas
```

**Exit criteria:** Server starts, connects to MongoDB, all 17 models load without MODULE_NOT_FOUND errors.

### Phase 1: Auth Integration (depends on Phase 0)

```
Step 1.1: Extend authController.js
          - Add POST /auth/send-otp (OTP generation)
          - Add POST /auth/verify-otp (OTP verification)
          - Add POST /auth/logout (stateless)
          - Add GET /auth/me (current user from token)
          - Fix register response: return {user, token} not {message, user}
          
Step 1.2: Extend authController.js register to accept phone field

Step 1.3: Fix User.role enum to match frontend
          ('academy_owner' not 'academy_rep')

Step 1.4: Connect frontend login page
          - Replace setTimeout with POST /auth/login
          - Store token in localStorage('sportsos:auth-token')
          - Store user in localStorage('sportsos:profile')

Step 1.5: Connect frontend register page
          - Replace setTimeout with POST /auth/register
          - Auto-login after registration

Step 1.6: Add PrivateGuard to private routes
          - Redirect to /login if not authenticated
```

**Exit criteria:** User can register, login, see profile. Token is stored and sent with requests.

### Phase 2: Academy + Coach CRUD (depends on Phase 1)

```
Step 2.1: Rewrite academyRepository.js for new Academy schema
          - All 30+ fields
          - GeoJSON location support
          - Slug-based lookups
          - Pagination support
          - Text search support
          
Step 2.2: Rewrite academyController.js for new schema
          - GET /academies with query params (sport, city, trainingLevel, etc.)
          - GET /academies/:slug (not :id)
          - Response envelope: {ok: true, data: {items, pagination}}
          - Response _id → id transformation
          
Step 2.3: Rewrite coachRepository.js for new Coach schema
          - All 25+ fields
          - Slug-based lookups
          - Pagination support
          
Step 2.4: Rewrite coachController.js for new schema
          - GET /coaches with query params
          - GET /coaches/:slug (not :id)
          - Add auth middleware to POST/DELETE
          - Response envelope + _id → id transformation
          
Step 2.5: Connect frontend academy listing page
          - Replace static data import with API call
          
Step 2.6: Connect frontend academy detail page
          - Replace static data import with API call
          
Step 2.7: Connect frontend coach listing page
          - Replace static data import with API call
          
Step 2.8: Connect frontend coach detail page
          - Replace static data import with API call
```

**Exit criteria:** Academies and coaches load from MongoDB, display correctly in frontend.

### Phase 3: Sports Catalog (depends on Phase 0)

```
Step 3.1: Create sportsController.js
          - Wire all 7 sportsService methods
          - GET /sports with category filter
          - GET /sports/:slug
          - Response envelope
          
Step 3.2: Mount in index.js: app.use('/sports', sportsController)

Step 3.3: Connect frontend sports listing page

Step 3.4: Connect frontend sport detail page
```

**Exit criteria:** Sports catalog loads from MongoDB.

### Phase 4: Shortlist/Favorites (depends on Phase 1, Phase 2)

```
Step 4.1: Rewrite shortlistRepository.js for new schema
          - userId + itemType + itemId model
          - Compound unique index
          
Step 4.2: Rewrite shortlistController.js
          - Rename route mount from /shortlist to /favorites
          - GET /favorites (user's bookmarks, populated)
          - POST /favorites {itemType, itemId}
          - DELETE /favorites/:type/:id
          - Add auth middleware to all routes
          - Response envelope
          
Step 4.3: Connect frontend shortlist-toggle component
          - Replace localStorage with API calls
          
Step 4.4: Connect frontend shortlist page
          - Replace localStorage reads with API calls
```

**Exit criteria:** Shortlist persists server-side, works across tabs/devices.

### Phase 5: Children + Enquiries (depends on Phase 1, Phase 2, Phase 4)

```
Step 5.1: Create childController.js
          - Wire parentChildService methods
          - GET /children, POST /children, PATCH /children/:id, DELETE /children/:id
          - Add auth middleware
          
Step 5.2: Mount in index.js: app.use('/children', childController)

Step 5.3: Connect frontend children profile page

Step 5.4: Create enquiryController.js
          - Wire enquiryService methods
          - POST /enquiries, GET /enquiries
          - Add auth middleware
          
Step 5.5: Mount in index.js: app.use('/enquiries', enquiryController)

Step 5.6: Connect frontend enquiry form page

Step 5.7: Connect frontend enquiries history page
```

**Exit criteria:** Parent can manage children, submit enquiries.

### Phase 6: Search (depends on Phase 2, Phase 3)

```
Step 6.1: Create searchController.js
          - Wire searchService methods
          - GET /search?q=&type= (global/academy/coach/sport)
          - GET /search/suggest?q= (autocomplete)
          - Add text indexes to Academy, Coach, Sport models
          
Step 6.2: Mount in index.js: app.use('/search', searchController)

Step 6.3: Connect frontend search page
          - Replace client-side filtering with API calls
          
Step 6.4: Connect frontend command palette
          - Wire to search/suggest endpoint
```

**Exit criteria:** Full-text search works across all entities.

### Phase 7: User Profile + Settings (depends on Phase 1)

```
Step 7.1: Create userController.js
          - GET /users/me
          - PATCH /users/me
          - Wire authService profile methods
          
Step 7.2: Mount in index.js: app.use('/users', userController)

Step 7.3: Connect frontend profile pages
          - /profile/personal
          - /profile/preferences
          - /settings/*
```

**Exit criteria:** User can view and edit profile.

### Phase 8: Reviews + Ratings (depends on Phase 2)

```
Step 8.1: Create reviewController.js
          - Wire reviewService methods
          - POST /reviews, GET /reviews/:targetType/:targetId
          - Add auth middleware
          
Step 8.2: Mount in index.js: app.use('/reviews', reviewController)

Step 8.3: Update academy/coach detail pages to show reviews
```

**Exit criteria:** Users can submit and view reviews.

### Phase 9: Admin (depends on Phase 2, Phase 6, Phase 8)

```
Step 9.1: Create adminController.js
          - Wire adminService methods
          - GET /admin/stats, GET /admin/users, PATCH /admin/users/:id
          - Verification queue endpoints
          - Add adminOnly middleware
          
Step 9.2: Mount in index.js: app.use('/admin', adminController)

Step 9.3: Connect frontend admin pages
```

**Exit criteria:** Admin can manage platform.

### Phase 10: Analytics + Monitoring (depends on Phase 1)

```
Step 10.1: Create analyticsController.js
           - POST /analytics/events (batch)
           - GET /analytics/dashboard
           - Wire analyticsService methods
           
Step 10.2: Mount in index.js: app.use('/analytics', analyticsController)

Step 10.3: Connect frontend analytics provider
           - Replace placeholder /api/events with real endpoint
```

**Exit criteria:** Events are tracked and queryable.

### Phase 11: Recommendations (depends on Phase 2, Phase 5)

```
Step 11.1: Create recommendationController.js
           - GET /recommendations/academies
           - GET /recommendations/coaches
           - Implement server-side matching (port lib/utils/matching.ts to JS)
           
Step 11.2: Mount in index.js: app.use('/recommendations', recommendationController)

Step 11.3: Connect frontend homepage suggestions
           - Replace client-side matching with API calls
```

**Exit criteria:** Recommendations are server-powered.

### Phase 12: Leads/CRM + Location (depends on Phase 5, Phase 2)

```
Step 12.1: Create leadController.js
           - Wire leadService methods
           - Add adminOnly middleware
           
Step 12.2: Create locationController.js
           - Wire locationService methods
           - GET /location/nearby/academies
           - GET /location/nearby/coaches
           
Step 12.3: Add 2dsphere indexes to User, Academy, Coach models
```

**Exit criteria:** CRM pipeline functional, geospatial queries work.

### Phase 13: Cleanup

```
Step 13.1: Remove dead service files from sportsOS-nodejs/services/
           (all 15 files — now wired through controllers)

Step 13.2: Archive sports-os-backend/ directory

Step 13.3: Archive sports-os-Database/ directory

Step 13.4: Archive data/ directory in frontend (static data no longer needed)

Step 13.5: Remove Athlete model and athleteController if athlete concept is dropped
```

---

## 5. Dependency Graph

```
PHASE 0: Schema Foundation
├── models/User.js (canonical)
├── models/Academy.js (canonical)
├── models/Coach.js (canonical)
├── models/Shortlist.js (canonical)
├── models/Sport.js (new — from canonical)
├── models/Role.js (new)
├── models/OTP.js (new)
├── models/Enquiry.js (new)
├── models/Lead.js (new)
├── models/LeadActivity.js (new)
├── models/Child.js (new)
├── models/Review.js (new)
├── models/Analytics.js (new)
├── models/VerificationCase.js (new)
├── models/AcademyImage.js (new)
├── models/AcademyFacility.js (new)
├── models/CoachCertificate.js (new)
└── index.js (CORS + helmet)

         │
         ▼

PHASE 1: Auth ─────────────────────────────────────┐
├── authController.js (extend)                      │
├── POST /auth/register (fix response)              │
├── POST /auth/login (fix response)                 │
├── POST /auth/send-otp (new)                       │
├── POST /auth/verify-otp (new)                     │
├── POST /auth/logout (new)                         │
├── GET /auth/me (new)                              │
└── Frontend: login + register pages                │
         │                                          │
         ▼                                          │

PHASE 2: Academy + Coach ───────────────────────────┤
├── academyRepository.js (rewrite)                  │
├── academyController.js (rewrite)                  │
├── coachRepository.js (rewrite)                    │
├── coachController.js (rewrite + add auth)         │
├── Frontend: listing + detail pages                │
         │                                          │
         ├──────────┬──────────┐                    │
         ▼          ▼          ▼                    │

PHASE 3: Sports ──┐  PHASE 4: Shortlist ──┐        │
├── sportsCtrl     │  ├── shortlistRepo     │        │
├── Frontend:      │  ├── shortlistCtrl     │        │
│   sports pages   │  ├── /favorites route  │        │
         │         │  └── Frontend:         │        │
         │         │      shortlist page    │        │
         │         │         │              │        │
         │         │         ▼              │        │
         │         │                        │        │
         │         ▼                        ▼        │

PHASE 5: Children + Enquiries ──────────────────────┤
├── childController.js (new)                        │
├── enquiryController.js (new)                      │
├── Frontend: children + enquiry pages              │
         │                                          │
         ▼                                          │

PHASE 6: Search ────────────────────────────────────┤
├── searchController.js (new)                       │
├── Text indexes on models                          │
├── Frontend: search + command palette              │
         │                                          │
         ▼                                          │

PHASE 7: User Profile ──────────────────────────────┤
├── userController.js (new)                         │
├── Frontend: profile + settings pages              │
         │                                          │
         ▼                                          │

PHASE 8: Reviews ───────────────────────────────────┤
├── reviewController.js (new)                       │
├── Frontend: review display                        │
         │                                          │
         ▼                                          │

PHASE 9: Admin ─────────────────────────────────────┤
├── adminController.js (new)                        │
├── Frontend: admin pages                           │
         │                                          │
         ▼                                          │

PHASE 10: Analytics ────────────────────────────────┤
├── analyticsController.js (new)                    │
├── Frontend: analytics provider                    │
         │                                          │
         ▼                                          │

PHASE 11: Recommendations ──────────────────────────┤
├── recommendationController.js (new)               │
├── Server-side matching engine                     │
├── Frontend: homepage suggestions                  │
         │                                          │
         ▼                                          │

PHASE 12: Leads + Location ─────────────────────────┤
├── leadController.js (new)                         │
├── locationController.js (new)                     │
├── 2dsphere indexes                                │
         │                                          │
         ▼                                          │

PHASE 13: Cleanup ──────────────────────────────────┘
├── Remove dead services
├── Archive sports-os-backend
├── Archive sports-os-Database
├── Archive frontend data/
```

---

## 6. Mismatch Resolution

### 6.1 Response Envelope Mismatch

| Mismatch | Frontend | Backend | Fix | Risk | Files |
|----------|---------|---------|-----|------|-------|
| Success envelope | `{ok: true, data: T}` | Raw JSON | Add envelope wrapper in every controller response | LOW | All controllers |
| Error envelope | `{ok: false, error: {code, message}}` | `{message: string}` | Add error wrapper in every controller catch block | LOW | All controllers |
| List response | `{items: T[], pagination}` | Raw array | Add pagination wrapper in list endpoints | LOW | All controllers |
| Auth token location | `response.data.token` | `response.token` | Wrap in `{ok: true, data: {token, user}}` | LOW | authController.js |

### 6.2 Path Mismatches

| Mismatch | Frontend Path | Backend Path | Fix | Risk | Files |
|----------|--------------|-------------|-----|------|-------|
| Favorites naming | `/favorites` | `/shortlist` | Rename mount to `/favorites` | LOW | `index.js:17` |
| Academy slug | `GET /academies/:slug` | `GET /academies/:id` | Change route to `/:slug`, add `findBySlug()` | MEDIUM | `academyController.js:91`, `academyRepository.js` |
| Coach slug | `GET /coaches/:slug` | `GET /coaches/:id` | Change route to `/:slug`, add `findBySlug()` | MEDIUM | `coachController.js:36`, `coachRepository.js` |
| Sports routes | `GET /sports` | None | Create `sportsController.js` | LOW | New file |
| Enquiries routes | `GET/POST /enquiries` | None | Create `enquiryController.js` | LOW | New file |
| Children routes | `GET/POST/PATCH/DELETE /children` | None | Create `childController.js` | LOW | New file |
| Users routes | `GET/PATCH /users/me` | None | Create `userController.js` | LOW | New file |
| Recommendations | `GET /recommendations/*` | None | Create `recommendationController.js` | LOW | New file |
| Search routes | `GET /search` | None | Create `searchController.js` | LOW | New file |
| Auth extras | `/auth/send-otp`, `/auth/verify-otp`, `/auth/logout`, `/auth/me` | None | Extend `authController.js` | LOW | `authController.js` |

### 6.3 Field Name Mismatches

| Mismatch | Frontend | Active Backend | Canonical | Fix | Risk | Files |
|----------|---------|---------------|-----------|-----|------|-------|
| Academy sport field | `sportsOffered` | `sport` | `sportsOffered` | Rename in model | MEDIUM | `models/Academy.js`, `repositories/academyRepository.js`, `controllers/academyController.js` |
| Coach sport field | `sportsCoached` | `sport` (String) | `sportsCoached` ([String]) | Rename + change type | MEDIUM | `models/Coach.js`, `repositories/coachRepository.js`, `controllers/coachController.js` |
| Academy verification | `verificationStatus` (enum) | `verified` (Boolean) | `verificationStatus` (enum) | Replace field | HIGH | `models/Academy.js`, all academy queries |
| Academy location | `LocationSummary` (object) | `String` | GeoJSON Point | Replace field type | HIGH | `models/Academy.js`, `repositories/academyRepository.js` |
| Shortlist model | `{userId, itemType, itemId}` | `{athleteId, academyId}` | `{userId, itemType, itemId}` | Replace entire schema | HIGH | `models/Shortlist.js`, `repositories/shortlistRepository.js`, `controllers/shortlistController.js` |
| ID field | `id` | `_id` | `_id` | Add `toJSON` transform or transform in controller | LOW | All controllers or model-level |

### 6.4 Role Enum Mismatches

| Source | Value | Fix | Risk | Files |
|--------|-------|-----|------|-------|
| Frontend `user.ts` | `academy_rep` | Align with canonical `academy_owner` | LOW | `types/domain/user.ts:3` |
| Canonical `models/index.js` | `academy_owner` | Keep as-is (authoritative) | — | — |
| Active `models/User.js` | `user` | Replace with canonical enum | MEDIUM | `models/User.js` |

**Recommendation:** Change frontend `academy_rep` to `academy_owner` (1 file, 1 line change).

### 6.5 Register Response Mismatch

| Mismatch | Frontend Expects | Backend Returns | Fix | Risk | Files |
|----------|-----------------|----------------|-----|------|-------|
| Missing token at register | `{user, token}` | `{message, user}` (no token) | Generate JWT in register endpoint | LOW | `authController.js:24-37` |

### 6.6 Response `_id` → `id` Transformation

| Mismatch | Frontend | Backend | Fix | Risk | Files |
|----------|---------|---------|-----|------|-------|
| MongoDB `_id` vs frontend `id` | `id: string` | `_id: ObjectId` | Add `toJSON` transform on all schemas: `ret.id = ret._id; delete ret._id` | LOW | All model files (add at schema level) |

---

## 7. Minimum Rework / Maximum Reuse Assessment

### What Can Be Reused As-Is

| Component | Reuse | Notes |
|-----------|-------|-------|
| All 15 service files | YES | 99 methods of business logic — wire to new controllers |
| Auth middleware | YES | JWT verify + adminOnly — working correctly |
| API client (`lib/api/client.ts`) | YES | Production-ready fetch wrapper |
| All frontend pages | YES | UI is complete — only data source changes |
| All frontend components | YES | No UI changes needed |
| All frontend types | YES | Authoritative reference |
| Matching engine (`lib/utils/matching.ts`) | YES | Can be ported to backend for recommendations |
| Static data files (`data/`) | TEMPORARY | Keep until API is connected, then archive |

### What Must Be Replaced

| Component | Replace | Effort |
|-----------|---------|--------|
| 4 active model files | YES — with canonical schemas | LOW (extract + paste) |
| 13 missing model files | YES — create from canonical | LOW (extract + paste) |
| 4 active repositories | YES — rewrite for new schemas | MEDIUM |
| 4 active controllers | YES — rewrite for new schemas + envelope | MEDIUM |
| 12 new controllers | YES — create, wire services | MEDIUM (each is ~50-100 lines) |
| Frontend page data sources | YES — swap static for API | LOW (mechanical swap) |

### What Should Be Deleted

| Component | Delete | After |
|-----------|--------|-------|
| `sports-os-Database/` | YES | Phase 13 |
| `sports-os-backend/` | YES | Phase 13 |
| `services/` in sportsOS-nodejs | YES | Phase 13 (after controllers built) |
| `data/` in frontend | YES | Phase 13 (after API connected) |
| `fix.js` | YES | Phase 13 |
