# SportsOS API Endpoints

> Generated: 2026-06-12
> Backend: sportsOS-nodejs (Express 5, port 3000)
> Deployed: https://sportsos-nodejs.onrender.com (currently 503)

---

## 1. Deployed Backend Endpoints (sportsOS-nodejs)

### Root

| Method | Path | Auth | Handler | Status |
|--------|------|------|---------|--------|
| GET | `/` | None | Inline | Working |

### Auth (`/auth`)

| Method | Path | Auth | Handler | Status |
|--------|------|------|---------|--------|
| POST | `/auth/register` | None | authController.register | Working |
| POST | `/auth/login` | None | authController.login | Working |

**Note:** Register returns user object only (no token). Login returns `{token, user}`.

### Academies (`/academies`)

| Method | Path | Auth | Handler | Status |
|--------|------|------|---------|--------|
| GET | `/academies/` | None | academyController.getAll | Working |
| GET | `/academies/sport/:sport` | None | getBySport | Working |
| GET | `/academies/distance/:maxKm` | None | getByDistance | Working |
| GET | `/academies/distance/:maxKm/sport/:sport` | None | getByDistanceAndSport | Working |
| GET | `/academies/verified/all` | None | getVerified | Working |
| GET | `/academies/verified/distance/:maxKm` | None | getVerifiedByDistance | Working |
| GET | `/academies/goal/:goalType` | None | getByGoalType | Working |
| GET | `/academies/:id` | None | getById | Working |
| POST | `/academies/` | **protect + adminOnly** | createAcademy | Working |
| PUT | `/academies/:id` | **protect + adminOnly** | updateAcademy | Working |
| DELETE | `/academies/:id` | **protect + adminOnly** | deleteAcademy | Working |

### Athletes (`/athletes`)

| Method | Path | Auth | Handler | Status |
|--------|------|------|---------|--------|
| GET | `/athletes/` | None | athleteController.getAll | Working |
| GET | `/athletes/sport/:sport` | None | getBySport | Working |
| GET | `/athletes/distance/:maxKm` | None | getByDistance | Working |
| GET | `/athletes/distance/:maxKm/sport/:sport` | None | getByDistanceAndSport | Working |
| GET | `/athletes/goal/:goalType` | None | getByGoalType | Working |
| GET | `/athletes/:id` | None | getById | Working |
| POST | `/athletes/` | **protect + adminOnly** | createAthlete | Working |
| PUT | `/athletes/:id` | **protect + adminOnly** | updateAthlete | Working |
| DELETE | `/athletes/:id` | **protect + adminOnly** | deleteAthlete | Working |

### Coaches (`/coaches`)

| Method | Path | Auth | Handler | Status |
|--------|------|------|---------|--------|
| GET | `/coaches/` | None | coachController.getAll | Working |
| GET | `/coaches/academy/:academyId` | None | getByAcademy | Working |
| GET | `/coaches/sport/:sport` | None | getBySport | Working |
| GET | `/coaches/:id` | None | getById | Working |
| POST | `/coaches/` | **None** | createCoach | Working |
| DELETE | `/coaches/:id` | **None** | deleteCoach | Working |

**⚠️ Security Issue:** POST and DELETE on coaches have no authentication.

### Shortlist (`/shortlist`)

| Method | Path | Auth | Handler | Status |
|--------|------|------|---------|--------|
| GET | `/shortlist/` | None | shortlistController.getAll | Working |
| GET | `/shortlist/athlete/:athleteId` | None | getByAthlete | Working |
| GET | `/shortlist/:id` | None | getById | Working |
| POST | `/shortlist/` | **None** | createShortlist | Working |
| DELETE | `/shortlist/:id` | **None** | deleteShortlist | Working |

**⚠️ Security Issue:** All shortlist routes have no authentication.

---

## 2. Frontend API Client Endpoints (lib/api/)

These are the endpoints the frontend **intends** to call. They are defined in `lib/api/` modules but **none are currently invoked** by page components.

### Auth API (`lib/api/auth.ts`)

| Method | Endpoint | Purpose | Wired? |
|--------|----------|---------|--------|
| POST | `/auth/register` | Register user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/send-otp` | Send OTP (email/sms/whatsapp) | No |
| POST | `/auth/verify-otp` | Verify OTP code | No |
| POST | `/auth/logout` | Logout user | No |
| GET | `/auth/me` | Get current user | No |

### Users API (`lib/api/users.ts`)

| Method | Endpoint | Purpose | Wired? |
|--------|----------|---------|--------|
| GET | `/users/me` | Get user profile | No |
| PATCH | `/users/me` | Update user profile | No |

### Children API (`lib/api/children.ts`)

| Method | Endpoint | Purpose | Wired? |
|--------|----------|---------|--------|
| GET | `/children` | List children | No |
| POST | `/children` | Create child | No |
| PATCH | `/children/:id` | Update child | No |
| DELETE | `/children/:id` | Delete child | No |

### Academies API (`lib/api/academies.ts`)

| Method | Endpoint | Purpose | Wired? |
|--------|----------|---------|--------|
| GET | `/academies` | List academies (with filters) | No |
| GET | `/academies/:slug` | Get academy detail | No |
| GET | `/recommendations/academies` | Get academy suggestions | No |

### Coaches API (`lib/api/coaches.ts`)

| Method | Endpoint | Purpose | Wired? |
|--------|----------|---------|--------|
| GET | `/coaches` | List coaches (with filters) | No |
| GET | `/coaches/:slug` | Get coach detail | No |

### Sports API (`lib/api/sports.ts`)

| Method | Endpoint | Purpose | Wired? |
|--------|----------|---------|--------|
| GET | `/sports` | List sports | No |
| GET | `/sports/:slug` | Get sport detail | No |

### Favorites API (`lib/api/favorites.ts`)

| Method | Endpoint | Purpose | Wired? |
|--------|----------|---------|--------|
| GET | `/favorites` | Get favourited items | No |
| POST | `/favorites` | Add favourite | No |
| DELETE | `/favorites/:type/:id` | Remove favourite | No |

### Enquiries API (`lib/api/enquiries.ts`)

| Method | Endpoint | Purpose | Wired? |
|--------|----------|---------|--------|
| GET | `/enquiries` | List user enquiries | No |
| POST | `/enquiries` | Create enquiry | No |

### Recommendations API (`lib/api/recommendations.ts`)

| Method | Endpoint | Purpose | Wired? |
|--------|----------|---------|--------|
| GET | `/recommendations/academies` | Academy recommendations | No |
| GET | `/recommendations/coaches` | Coach recommendations | No |

### Analytics (lib/analytics/client.ts)

| Method | Endpoint | Purpose | Wired? |
|--------|----------|---------|--------|
| POST | `/api/events` | Batch analytics events | Placeholder only |

---

## 3. Endpoint Mismatch Analysis

### Frontend Expects but Backend Doesn't Have

| Frontend Endpoint | Backend Status |
|-------------------|---------------|
| POST `/auth/send-otp` | ❌ Not implemented |
| POST `/auth/verify-otp` | ❌ Not implemented |
| POST `/auth/logout` | ❌ Not implemented |
| GET `/auth/me` | ❌ Not implemented |
| GET/POST/PATCH `/users/me` | ❌ Not implemented |
| GET/POST/PATCH/DELETE `/children` | ❌ Not implemented |
| GET `/favorites` | ❌ Not implemented (different path) |
| POST `/favorites` | ❌ Not implemented |
| DELETE `/favorites/:type/:id` | ❌ Not implemented |
| GET `/enquiries` | ❌ Not implemented |
| POST `/enquiries` | ❌ Not implemented |
| GET `/recommendations/academies` | ❌ Not implemented |
| GET `/recommendations/coaches` | ❌ Not implemented |
| GET `/sports` | ❌ Not implemented |
| GET `/sports/:slug` | ❌ Not implemented |

### Backend Has but Frontend Doesn't Call

| Backend Endpoint | Frontend Status |
|------------------|---------------|
| GET `/academies/sport/:sport` | Not used (frontend uses query params) |
| GET `/academies/distance/:maxKm` | Not used |
| GET `/academies/verified/all` | Not used |
| GET `/academies/goal/:goalType` | Not used |
| POST/PUT/DELETE `/academies/` | Admin only (no admin UI wired) |
| All `/athletes` endpoints | Not used (athlete concept different) |
| POST/DELETE `/coaches/` | No auth (security issue) |
| All `/shortlist` endpoints | Not used (localStorage instead) |

### Path Convention Mismatch

| Frontend Path | Backend Path | Issue |
|--------------|-------------|-------|
| `/favorites` | `/shortlist` | Different naming |
| `/academies/:slug` | `/academies/:id` | Slug vs ID |
| `/coaches/:slug` | `/coaches/:id` | Slug vs ID |
| `/sports/:slug` | — | Backend has no sports routes |
| Query params for filters | Path params for filters | Different pattern |

---

## 4. Frontend Pages (50+ routes)

### Public Pages (21)
- `/` — Homepage
- `/welcome` — Welcome/landing
- `/discover` — Discovery hub
- `/academies` — Academy listing
- `/academies/[slug]` — Academy detail
- `/coaches` — Coach listing
- `/coaches/[slug]` — Coach detail
- `/sports` — Sports listing
- `/sports/[slug]` — Sport detail
- `/search` — Search results
- `/compare` — Side-by-side comparison
- `/shortlist` — Saved items
- `/enquiry/[type]/[id]` — Enquiry form
- `/enquiry/success` — Enquiry success
- `/about`, `/trust`, `/contact`, `/privacy`, `/terms`, `/cookies` — Static pages
- `/design` — Design system showcase

### Auth Pages (9)
- `/login`, `/register`, `/forgot-password`
- `/verify/method`, `/verify/email`, `/verify/phone`, `/verify/signup`
- `/onboarding/role`, `/onboarding/wizard`

### Private Pages (14)
- `/profile`, `/profile/personal`, `/profile/children`, `/profile/preferences`, `/profile/saved`, `/profile/enquiries`, `/profile/settings`
- `/settings`, `/settings/profile`, `/settings/session`, `/settings/theme`, `/settings/motion`, `/settings/location`, `/settings/privacy`, `/settings/notifications`

### Admin Pages (11)
- `/admin`, `/admin/academies`, `/admin/coaches`, `/admin/sports`, `/admin/users`, `/admin/enquiries`, `/admin/leads`, `/admin/leads/[id]`, `/admin/verification`, `/admin/analytics`, `/admin/settings`

---

## 5. Backend Service Methods (Not Exposed as Routes)

These methods exist in sports-os-backend services but have no corresponding controller/route:

| Service | Method | Description |
|---------|--------|-------------|
| searchService | searchSuggest | Autocomplete |
| searchService | searchAll | Cross-entity search |
| searchService | searchAcademies | Filtered academy search |
| searchService | searchCoaches | Filtered coach search |
| searchService | searchSports | Sports search |
| enquiryService | createEnquiry | Create + CRM lead |
| enquiryService | getEnquiriesByUser | User's enquiries |
| enquiryService | getEnquiriesByAcademy | Academy's enquiries |
| leadService | getLeadById | Full lead + activity |
| leadService | getLeadsByOwner | Owner's leads |
| leadService | getAllLeads | Admin lead view |
| leadService | updateLeadStatus | Pipeline progression |
| reviewService | addReview | Submit review |
| reviewService | getApprovedReviews | Public reviews |
| reviewService | moderateReview | Admin moderation |
| adminService | dashboardStats | Platform metrics |
| adminService | getVerificationCases | Verification queue |
| analyticsService | trackBatch | Event ingestion |
| analyticsService | getDashboardAnalytics | Analytics dashboard |
| compareService | compareAcademies | Side-by-side |
| compareService | compareCoaches | Side-by-side |
| locationService | getNearbyAcademies | Geospatial query |
| locationService | getNearbyCoaches | Geospatial query |
| parentChildService | addChild | Create child |
| parentChildService | getChildrenByParent | List children |
| sportsService | getAllSports | List all sports |
| sportsService | getSportBySlug | Sport detail |
| slugService | generateSlug | URL slug generation |
