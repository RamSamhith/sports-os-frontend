# SportsOS Architecture Report

> Generated: 2026-06-12
> Status: Analysis complete — no code changes made

---

## 1. Project Overview

**SportsOS** is a sports discovery platform for India that helps athletes and parents discover, compare, and enquire about sports academies, coaches, and sports pathways. Think "Zomato for sports coaching."

The workspace is a **monorepo** containing 4 separate git repositories:

| # | Repository | Purpose | Maturity |
|---|-----------|---------|----------|
| 1 | **Frontend** (root) | Next.js 14 App Router SPA | High — full UI, no backend wiring |
| 2 | **sportsOS-nodejs** | Express.js REST API server | Medium — basic CRUD, incomplete services |
| 3 | **sports-os-backend** | Shared business logic library | High — complete services, no server |
| 4 | **sports-os-Database** | Early database scaffolding | Low — minimal, no routes |

---

## 2. Repository Architecture

### 2.1 Frontend (Root — Next.js 14)

```
┌─────────────────────────────────────────────────────────┐
│                    NEXT.JS 14 APP                        │
│                  (App Router, TypeScript)                 │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│  app/    │components│  lib/    │  data/   │   types/    │
│ (routes) │  (UI)    │ (utils)  │ (static) │  (domain)   │
├──────────┴──────────┴──────────┴──────────┴─────────────┤
│              lib/api/ (API client layer)                  │
│         lib/hooks/ (React hooks, state mgmt)             │
│         lib/utils/ (matching engine, validators)         │
│         lib/analytics/ (consent-gated tracking)          │
└─────────────────────────────────────────────────────────┘
```

**Key directories:**
- `app/` — 4 route groups: (public), (auth), (private), (admin)
- `components/` — 30+ component directories, ~80+ components
- `lib/api/` — Centralized fetch client with auth headers
- `lib/hooks/` — 20+ custom hooks (auth, compare, shortlist, location, etc.)
- `lib/utils/matching.ts` — Client-side matching/scoring engine
- `data/` — Static mock data (academies, coaches, sports, competitions)

### 2.2 sportsOS-nodejs (Express API Server)

```
┌─────────────────────────────────────────────┐
│              EXPRESS 5 SERVER                │
│                  index.js                    │
├─────────────────────────────────────────────┤
│  controllers/    │  repositories/            │
│  authController  │  academyRepository        │
│  academyControl  │  athleteRepository        │
│  athleteControl  │  coachRepository          │
│  coachController │  shortlistRepository      │
│  shortlistCtrl   │                           │
├─────────────────────────────────────────────┤
│  services/ (15 files — NOT wired to ctrl)   │
│  middleware/authMiddleware.js                │
│  config/db.js (MongoDB connection)          │
├─────────────────────────────────────────────┤
│  models/ (5 files — subset of full schema)  │
│  User, Academy, Athlete, Coach, Shortlist   │
└─────────────────────────────────────────────┘
```

**Active controllers mount:**
- `/auth` → authController
- `/athletes` → athleteController
- `/academies` → academyController
- `/coaches` → coachController
- `/shortlist` → shortlistController

### 2.3 sports-os-backend (Business Logic Library)

```
┌─────────────────────────────────────────────┐
│         SHARED SERVICE LAYER                 │
│         (No server, no routes)               │
├─────────────────────────────────────────────┤
│  models/index.js (17 Mongoose models)       │
│  services/ (16 service files)                │
│  - academyService    - enquiryService        │
│  - coachService      - leadService           │
│  - authService       - reviewService         │
│  - adminService      - searchService         │
│  - analyticsService  - shortlistService      │
│  - compareService    - sportsService         │
│  - locationService   - parentChildService    │
│  - slugService                               │
└─────────────────────────────────────────────┘
```

**This is the canonical business logic layer.** It defines all 17 Mongoose models and 16 service files but has no Express server or route definitions. It's designed to be imported by the sportsOS-nodejs server.

### 2.4 sports-os-Database (Early Scaffolding)

```
┌─────────────────────────────────────────────┐
│         EARLY DATABASE LAYER                 │
│         (Minimal, no routes)                 │
├─────────────────────────────────────────────┤
│  server.js (Express 5, port 8095)           │
│  config/db.js (MongoDB connection)          │
│  models/ (4 simplified schemas)             │
│  - Athlete, Academy, Coach, Shortlist       │
└─────────────────────────────────────────────┘
```

**Oldest/earliest version.** Contains only basic schemas with no required fields, no route handlers, and a hardcoded seed test in server.js.

---

## 3. Complete Model/Schema Map

### 3.1 Canonical Models (sports-os-backend — 17 models)

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| **User** | name, email, password, role (athlete/parent/coach/academy_owner/admin), phone, phoneVerified, isVerified, isActive, isBanned, onboardingCompleted, location (GeoJSON), preferences, consent, themePreference | Platform accounts |
| **Role** | name, permissions[], scopes[] | RBAC definitions |
| **OTP** | userId, otp, type (email/phone/password_reset), expiresAt (TTL) | Verification codes |
| **Academy** | name, slug, description, city, state, sportsOffered[], facilities[], trainingLevels[], certifications[], contact, feeRange, ownerId, isVerified, verificationStatus, status, isFeatured, avgRating, reviewCount, shortlistCount, rankScore, location (GeoJSON) | Sports academies |
| **AcademyImage** | academyId, url, isPrimary | Gallery images |
| **AcademyFacility** | academyId, name | Legacy facilities |
| **Coach** | name, slug, avatar, bio, sportsCoached[], specialization[], experienceYears, city, state, academyId, userId, contact, feeRange, certifications[], isVerified, verificationStatus, status, isFeatured, avgRating, reviewCount, rankScore, location (GeoJSON) | Coach profiles |
| **CoachCertificate** | coachId, title, issuedBy, issuedYear, documentUrl | Certifications |
| **Sport** | name, slug, description, icon, coverImage, category, status, competitionPathway (levels), explorationGuidance, difficulty, ageRange, careerOpportunities | Sports catalog |
| **Shortlist** | userId, contextChildId, itemId, itemType (academy/coach/sport) | Bookmarks |
| **Enquiry** | userId, childId, targetType, targetId, intent, parentInfo, childInfo, sportInterest, message, status, leadId, source | Contact forms |
| **Lead** | enquiryId, source, ownerType, ownerId, userId, childId, status, assignedTo | CRM pipeline |
| **LeadActivity** | leadId, actorType, actorId, type, payload | Activity log |
| **Child** | parentId, name, age, dob, gender, sportInterests[], skillLevel, medicalNotes | Child profiles |
| **Review** | userId, targetId, targetType, rating (1-5), text, moderationStatus | User reviews |
| **Analytics** | event, userId, data (Mixed) | Event tracking |
| **VerificationCase** | targetType, targetId, status, evidence[], reviewerNotes | Verification workflow |

### 3.2 Active Models (sportsOS-nodejs — 5 models)

| Model | Fields | Notes |
|-------|--------|-------|
| **User** | name, email, password, role [user/admin] | Simplified — no OTP, no phone, no preferences |
| **Academy** | name, sport[], location, distanceKm, verified, goalType | Basic — no slug, no rating, noGeoJSON |
| **Athlete** | name, sport[], age, academy, distanceKm, goalType | Not in canonical schema |
| **Coach** | name, sport, academyId (ref) | Minimal — no slug, no bio |
| **Shortlist** | athleteId (ref), academyId (ref) | Basic — no user context |

### 3.3 Database Models (sports-os-Database — 4 models)

| Model | Fields | Notes |
|-------|--------|-------|
| **Athlete** | name (required), sport, age, academy | Only name required |
| **Academy** | name, sport, location, distanceKm, monthlyFee, batchSchedule, trainingLevel, verified | Most complete of the 4 |
| **Coach** | name, sport, certification, level, experienceYears, academyId | Numeric academyId (no ref) |
| **Shortlist** | athleteId, academyId, academyName, sport, note | Numeric IDs (no refs) |

---

## 4. Complete Service Map (sports-os-backend — 16 services)

| Service | Methods | Purpose |
|---------|---------|---------|
| **academyService** | createAcademy, updateAcademy, deleteAcademy, getAcademyById, getAcademyBySlug, searchAcademies, getFeaturedAcademies, calculateAcademyRank | Academy CRUD + search + ranking |
| **coachService** | createCoach, updateCoach, deleteCoach, getCoachById, getCoachBySlug, searchCoaches, getFeaturedCoaches, getCoachDetails, compareCoaches, calculateCoachRank | Coach CRUD + comparison + ranking |
| **authService** | registerUser, loginUser, forgotPassword, resetPassword, verifyEmail, sendPhoneOtp, verifyPhone, completeOnboarding, refreshToken, updatePreferences, updateConsent, updateTheme, logout | Full auth lifecycle (OTP, refresh tokens) |
| **adminService** | createVerificationCase, getVerificationCases, updateVerificationCase, verifyAcademy, verifyCoach, manageUser, getAllUsers, dashboardStats | Admin operations + verification workflow |
| **analyticsService** | trackBatch, trackPageView, trackSearch, trackEnquirySubmit, trackProfileView, trackShortlist, getDashboardAnalytics, getTopSearches | Event tracking + dashboard |
| **searchService** | searchSuggest, searchAll, searchAcademies, searchCoaches, searchSports | Unified search with autocomplete |
| **shortlistService** | addAcademyToShortlist, addCoachToShortlist, addSportToShortlist, removeFromShortlist, getUserShortlist, getShortlistedAcademies, getShortlistedCoaches, getShortlistedSports, clearShortlist, getShortlistDecoded | Multi-entity bookmarks |
| **enquiryService** | createEnquiry, getEnquiriesByUser, getEnquiriesByAcademy, getEnquiriesByCoach, updateEnquiryDeliveryStatus | Lead generation + CRM |
| **leadService** | getLeadById, getLeadsByOwner, getAllLeads, updateLeadStatus, assignLead, logActivity | CRM pipeline management |
| **reviewService** | addReview, updateReview, moderateReview, getApprovedReviews, getAcademyReviews, getPendingReviews, calculateRating | Reviews with moderation |
| **compareService** | compareAcademies, compareCoaches | Side-by-side comparison |
| **parentChildService** | addChild, updateChild, deleteChild, setActiveChild, getChildrenByParent, getActiveChild | Parent-child profile management |
| **locationService** | saveLocation, getNearbyAcademies, getNearbyCoaches | Geospatial queries ($near) |
| **sportsService** | addSport, updateSport, deleteSport, getAllSports, getSportBySlug, getSportById, compareSports | Sports catalog CRUD |
| **slugService** | generateSlug | URL-safe slug generation |
| **(15 total)** | | |

---

## 5. Controller Map (sportsOS-nodejs)

### Active Controllers (wired to routes)

| Controller | Route Prefix | Public Endpoints | Protected Endpoints |
|-----------|-------------|------------------|-------------------|
| authController | `/auth` | POST /register, POST /login | None |
| academyController | `/academies` | 8 GET endpoints | POST, PUT, DELETE (adminOnly) |
| athleteController | `/athletes` | 6 GET endpoints | POST, PUT, DELETE (adminOnly) |
| coachController | `/coaches` | 6 endpoints (ALL unprotected) | None |
| shortlistController | `/shortlist` | 5 endpoints (ALL unprotected) | None |

### Unimplemented Controllers (services exist but no controller)

| Missing Controller | Service Available |
|-------------------|------------------|
| searchController | searchService |
| enquiryController | enquiryService |
| leadController | leadService |
| reviewController | reviewService |
| analyticsController | analyticsService |
| adminController | adminService |
| sportsController | sportsService |
| childController | parentChildService |
| locationController | locationService |
| compareController | compareService |
| userController | authService (profile methods) |

---

## 6. Middleware Map

| Middleware | Location | Purpose | Used By |
|-----------|----------|---------|---------|
| `protect` | sportsOS-nodejs/middleware/authMiddleware.js | JWT verification (Bearer token) | academyController, athleteController |
| `adminOnly` | sportsOS-nodejs/middleware/authMiddleware.js | Role check (role === 'admin') | academyController, athleteController |

**Missing middleware:**
- CORS configuration
- Rate limiting
- Request body validation/sanitization
- Helmet security headers
- Error handling middleware
- Request logging

---

## 7. Data Flow Diagrams

### 7.1 Current Flow (Frontend → Static Data)

```
User → Browser → Next.js Page
                     ↓
              data/academies.ts (import)
              data/coaches.ts (import)
              data/sports.ts (import)
                     ↓
              Static rendering (SSG/SSR)
                     ↓
              localStorage (auth, shortlist, compare)
```

### 7.2 Intended Flow (Frontend → Backend → Database)

```
User → Browser → Next.js Page
                     ↓
              lib/api/client.ts (fetch wrapper)
                     ↓
              NEXT_PUBLIC_API_URL (configured base URL)
                     ↓
              sportsOS-nodejs Express Server
                     ↓
              controllers/ → services/ → repositories/ → models/
                     ↓
              MongoDB (via Mongoose)
```

### 7.3 Auth Flow (Intended)

```
1. User submits login form
2. Frontend → POST /auth/login {email, password}
3. Server → authController → bcrypt compare → JWT sign
4. Server → returns {token, user}
5. Frontend → stores token in localStorage('sportsos:auth-token')
6. Subsequent requests → Authorization: Bearer <token>
7. Server → authMiddleware.protect → verifies JWT → sets req.user
8. Admin routes → authMiddleware.adminOnly → checks role
```

### 7.4 Search Flow (Intended)

```
1. User types in search bar
2. useSearchQuery hook → debounced URL update (?q=...)
3. Search page → GET /search?q=...&type=academy|coach|sport
4. Server → searchService.searchAll() → MongoDB text search
5. Server → returns {items: [...], pagination: {...}}
6. Frontend → renders tabbed results
```

### 7.5 Compare Flow (Client-Side Only)

```
1. User clicks "Compare" on academy/coach card
2. CompareProvider → adds to compareItems (max 2)
3. CompareTray → floating bar shows selected items
4. User clicks "Compare Now"
5. /compare page → renders CompareView component
6. Side-by-side comparison rendered from client state
```

### 7.6 Shortlist Flow (Currently localStorage, Intended Server)

```
1. User clicks heart/bookmark icon
2. ShortlistToggle → adds/removes from localStorage
3. Shortlist page → reads from localStorage
4. Intended: POST /favorites (add), DELETE /favorites/:type/:id (remove)
5. Intended: GET /favorites → populated list from server
```

### 7.7 Parent-Child Flow (Intended)

```
1. Parent registers as role="parent"
2. Onboarding wizard → creates child profiles
3. POST /children → parentChildService.addChild()
4. Parent selects "active child" → context for recommendations
5. Child profiles store: name, age, sportInterests, skillLevel
6. Matching engine uses active child's profile for scoring
```

### 7.8 Academy Flow (Intended)

```
1. Academy owner registers → role="academy_owner"
2. Creates academy profile → POST /academies
3. Academy enters verification queue
4. Admin reviews → VerificationCase workflow
5. Once verified → isVerified=true, appears in search results
6. Parents/athletes can enquire → POST /enquiries
7. Enquiry creates Lead record → CRM pipeline
```

### 7.9 Coach Flow (Intended)

```
1. Coach registers → role="coach"
2. Creates coach profile → POST /coaches
3. Links to academy (optional) → academyId
4. Verification workflow (same as academy)
5. Parents/athletes can enquire → POST /enquiries
6. Reviews system → avgRating, reviewCount
7. Ranking algorithm → rankScore calculation
```

---

## 8. Database Indexes (Canonical Schema)

| Collection | Index Type | Fields | Purpose |
|-----------|-----------|--------|---------|
| User | 2dsphere | location | Geospatial queries |
| OTP | TTL | expiresAt | Auto-delete expired OTPs |
| Academy | 2dsphere | location | Nearby academy queries |
| Academy | Text | name, description, city | Full-text search |
| Coach | 2dsphere | location | Nearby coach queries |
| Coach | Text | name, bio, city | Full-text search |
| Shortlist | Compound Unique | userId, itemId, itemType | Prevent duplicate bookmarks |
| Review | Compound Unique | userId, targetId, targetType | One review per user per entity |
| Analytics | Compound | event, createdAt | Event querying |
| LeadActivity | Compound | leadId, createdAt | Activity timeline |
| VerificationCase | Compound | targetType, targetId, status | Verification queue |

---

## 9. Frontend Architecture

### 9.1 Route Groups

| Group | Layout | Purpose | Auth Required |
|-------|--------|---------|--------------|
| `(public)` | Navbar + Footer + CompareTray | Public browsing pages | No |
| `(auth)` | Aurora background, centered card | Login, register, verify | No |
| `(private)` | ProfileSidebar + PrivateGuard | User profile, settings | Yes |
| `(admin)` | AdminShell | Admin dashboard, management | Yes (admin) |

### 9.2 State Management

| State | Storage | Hook | Provider |
|-------|---------|------|----------|
| Auth | localStorage | useAuth | AuthProvider |
| Shortlist | localStorage | useShortlist | ShortlistProvider |
| Compare | localStorage | useCompare | CompareProvider |
| Children | localStorage | useChildren | — |
| Recently Viewed | localStorage | useRecentlyViewed | — |
| Location | localStorage + GPS | useLocation | LocationProvider |
| Theme | localStorage | useThemeSafe | ThemeProvider |
| Consent | localStorage | useConsent | — |
| Search | URL params | useSearchQuery | — |

### 9.3 Design System

- **4 themes:** Midnight Ice, Ember Orange, Graphite Titanium, Alpine Light
- **UI primitives:** shadcn/ui (Radix UI + Tailwind CSS)
- **Animations:** Framer Motion (page transitions, scroll reveal, stagger)
- **Typography:** Geist Sans/Mono + Inter

---

## 10. Environment Variables

### Frontend (.env.example)

| Variable | Default | Purpose |
|----------|---------|---------|
| NEXT_PUBLIC_SITE_URL | http://localhost:3000 | Site URL for metadata |
| NEXT_PUBLIC_SITE_NAME | SportsOS | App name |
| NEXT_PUBLIC_ANALYTICS_ENABLED | false | Analytics toggle |
| NEXT_PUBLIC_ANALYTICS_ENDPOINT | (empty) | Analytics ingestion URL |
| NEXT_PUBLIC_ENABLE_ADMIN | false | Admin feature flag |
| NEXT_PUBLIC_ENABLE_AI | false | AI feature flag |
| NEXT_PUBLIC_API_URL | (empty) | Backend API base URL |

### sportsOS-nodejs (.env — not committed)

| Variable | Purpose |
|----------|---------|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | JWT signing key |
| JWT_REFRESH_SECRET | Refresh token signing key (authService only) |

### sports-os-Database (.env — not committed)

| Variable | Purpose |
|----------|---------|
| MONGO_URI | MongoDB connection string |

---

## 11. Critical Observations

1. **4 separate git repos in one workspace** — potential for duplication and drift
2. **sports-os-Database is obsolete** — superseded by sportsOS-nodejs and sports-os-backend
3. **sports-os-backend has no entry point** — it's a library, not a runnable server
4. **sportsOS-nodejs uses 5 models** — but sports-os-backend defines 17 canonical models
5. **13 models referenced by services don't exist** in sportsOS-nodejs
6. **11 service files exist but aren't wired** to controllers in sportsOS-nodejs
7. **Frontend API client is complete** but unused — all pages use static data
8. **No CORS, rate limiting, or security middleware** in any backend
9. **Deployed URL (onrender.com) returns 503** — service is down
