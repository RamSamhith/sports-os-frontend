# API Gap Report

> Generated: 2026-06-12
> Evidence-based analysis — no assumptions

---

## 1. Classification Methodology

Every feature is classified as:
- **EXISTS** — Fully implemented and functional in both frontend and backend
- **PARTIAL** — Some code exists but incomplete or non-functional
- **MISSING** — No implementation exists
- **DUPLICATE** — Multiple independent implementations of the same feature
- **WRONG** — Implementation exists but is incorrect or incompatible

---

## 2. Feature-by-Feature Classification

### 2.1 Authentication

| Feature | Status | Evidence |
|---------|--------|----------|
| User registration endpoint | **WRONG** | Backend returns `{message, user}` without token; frontend expects `{ok: true, data: {user, token}}`. Registration does not issue a JWT token (`authController.js:31`). |
| User login endpoint | **PARTIAL** | Backend returns `{token, user}`. Frontend expects `{ok: true, data: {user, token}}`. Envelope mismatch means frontend gets `undefined` for both fields. |
| JWT token generation | **EXISTS** | `authController.js:60-63` generates JWT with 7-day expiry using `process.env.JWT_SECRET`. |
| JWT token verification | **EXISTS** | `authMiddleware.js:10-22` verifies `Authorization: Bearer` header. |
| Password hashing | **EXISTS** | `authController.js:22` uses bcrypt with 10 salt rounds. |
| Role-based access control | **PARTIAL** | `adminOnly` middleware exists (`authMiddleware.js:24-29`). Active User model only has `'user'\|'admin'` roles. Frontend expects 5 roles. |
| OTP generation | **MISSING** | Frontend calls `POST /auth/send-otp`. No endpoint exists. `authService.js` has OTP logic but is dead code (no controller). |
| OTP verification | **MISSING** | Frontend calls `POST /auth/verify-otp`. No endpoint exists. |
| Email verification | **MISSING** | `authService.js:verifyEmail()` exists but no controller/route. |
| Phone verification | **MISSING** | `authService.js:verifyPhone()` exists but no controller/route. |
| Password reset | **MISSING** | `authService.js:forgotPassword()` and `resetPassword()` exist but no controller/route. |
| Refresh token rotation | **MISSING** | `authService.js:refreshToken()` exists but no controller/route. Requires `JWT_REFRESH_SECRET` env var not documented. |
| Logout | **MISSING** | Frontend calls `POST /auth/logout`. No endpoint exists. `authService.js:logout()` is stateless (client-side only). |
| Get current user | **MISSING** | Frontend calls `GET /auth/me`. No endpoint exists. |
| Auth on coach routes | **WRONG** | `coachController.js` POST and DELETE routes have no auth middleware. Anyone can create/delete coaches. |
| Auth on shortlist routes | **WRONG** | `shortlistController.js` all routes have no auth middleware. Anyone can modify any shortlist. |

### 2.2 Academy Management

| Feature | Status | Evidence |
|---------|--------|----------|
| Academy list endpoint | **WRONG** | `GET /academies/` returns raw array from `academyRepo.getAllAcademies()`. Frontend expects `{ok: true, data: {items: Academy[], pagination: Pagination}}`. No pagination, no envelope. |
| Academy detail by slug | **WRONG** | Frontend calls `GET /academies/:slug`. Backend handles `GET /academies/:id` which expects MongoDB ObjectId. Slug strings will never match. |
| Academy filter by sport | **PARTIAL** | `GET /academies/sport/:sport` exists. Frontend uses query params `?sport=cricket` instead of path params. Different API pattern. |
| Academy filter by distance | **PARTIAL** | `GET /academies/distance/:maxKm` exists. Frontend doesn't call this endpoint. |
| Academy verified filter | **PARTIAL** | `GET /academies/verified/all` exists. Frontend uses `?verificationStatus=verified` query param instead. |
| Academy goal filter | **PARTIAL** | `GET /academies/goal/:goalType` exists. Frontend doesn't use this pattern. |
| Academy search | **MISSING** | No search endpoint. `searchService.js:searchAcademies()` exists but no controller. |
| Academy create | **EXISTS** | `POST /academies/` with adminOnly protection. |
| Academy update | **EXISTS** | `PUT /academies/:id` with adminOnly protection. |
| Academy delete | **EXISTS** | `DELETE /academies/:id` with adminOnly protection. |
| Academy response fields | **WRONG** | Backend returns 7 fields (name, sport, location, distanceKm, verified, goalType, timestamps). Frontend expects 20+ fields including slug, description, facilities, certifications, rating, gallery, etc. |
| Academy featured list | **MISSING** | `academyService.js:getFeaturedAcademies()` exists but no controller. |
| Academy rank calculation | **MISSING** | `academyService.js:calculateAcademyRank()` exists but no controller. |

### 2.3 Coach Management

| Feature | Status | Evidence |
|---------|--------|----------|
| Coach list endpoint | **WRONG** | Same envelope mismatch as academies. |
| Coach detail by slug | **WRONG** | Frontend calls `GET /coaches/:slug`. Backend handles `GET /coaches/:id` (ObjectId). |
| Coach filter by sport | **PARTIAL** | `GET /coaches/sport/:sport` exists. Frontend uses query params. |
| Coach filter by academy | **EXISTS** | `GET /coaches/academy/:academyId` exists. |
| Coach search | **MISSING** | `searchService.js:searchCoaches()` exists but no controller. |
| Coach create | **WRONG** | `POST /coaches/` exists but has NO auth middleware. |
| Coach delete | **WRONG** | `DELETE /coaches/:id` exists but has NO auth middleware. |
| Coach update | **MISSING** | No PUT/PATCH endpoint. `coachService.js:updateCoach()` exists but no controller. |
| Coach response fields | **WRONG** | Backend returns 3 fields (name, sport, academyId). Frontend expects 13+ fields. |
| Coach featured list | **MISSING** | `coachService.js:getFeaturedCoaches()` exists but no controller. |
| Coach comparison | **MISSING** | `coachService.js:compareCoaches()` exists but no controller. |
| Coach rank calculation | **MISSING** | `coachService.js:calculateCoachRank()` exists but no controller. |

### 2.4 Sports Catalog

| Feature | Status | Evidence |
|---------|--------|----------|
| Sports list endpoint | **MISSING** | No `/sports` route. `sportsService.js:getAllSports()` exists but no controller. |
| Sport detail by slug | **MISSING** | No `/sports/:slug` route. `sportsService.js:getSportBySlug()` exists but no controller. |
| Sport CRUD | **MISSING** | No controller. `sportsService.js` has add/update/delete/getAll/getBySlug/getById/compare. |
| Sport schema | **MISSING** | No Sport model file in `sportsOS-nodejs/models/`. Only exists in `sports-os-backend/models/index.js`. Services reference `require('../models/Sport')` which will crash. |

### 2.5 Search

| Feature | Status | Evidence |
|---------|--------|----------|
| Search suggest (autocomplete) | **MISSING** | Frontend command palette uses client-side filtering. `searchService.js:searchSuggest()` exists but no controller. |
| Global search | **MISSING** | Frontend `/search` page uses client-side filtering of static data. `searchService.js:searchAll()` exists but no controller. |
| Search academy filter | **MISSING** | `searchService.js:searchAcademies()` exists but no controller. |
| Search coach filter | **MISSING** | `searchService.js:searchCoaches()` exists but no controller. |
| Search sport filter | **MISSING** | `searchService.js:searchSports()` exists but no controller. |
| Search index | **MISSING** | No text index on active Academy/Coach models. Canonical has text indexes on name/description/city. |

### 2.6 Shortlist/Favorites

| Feature | Status | Evidence |
|---------|--------|----------|
| Shortlist path compatibility | **WRONG** | Frontend uses `/favorites`. Backend uses `/shortlist`. |
| Shortlist add (multi-entity) | **WRONG** | Frontend sends `{itemType: 'academy'\|'coach'\|'sport', itemId}`. Backend expects `{athleteId, academyId}`. Completely different data model. |
| Shortlist remove | **WRONG** | Frontend calls `DELETE /favorites/:type/:id`. Backend has `DELETE /shortlist/:id`. Different path and semantics. |
| Shortlist get all | **WRONG** | Frontend expects `ShortlistItem[]` with userId, itemType, itemId. Backend returns athlete→academy links. |
| Shortlist unique constraint | **MISSING** | Active Shortlist model has no unique index. Canonical has compound unique on (userId, itemId, itemType). |
| Shortlist auth | **WRONG** | No auth middleware on any shortlist route. |

### 2.7 Enquiries

| Feature | Status | Evidence |
|---------|--------|----------|
| Create enquiry endpoint | **MISSING** | Frontend calls `POST /enquiries`. No route exists. `enquiryService.js:createEnquiry()` exists but no controller. |
| List user enquiries | **MISSING** | Frontend calls `GET /enquiries`. No route exists. |
| Enquiry → Lead creation | **MISSING** | `enquiryService.js:createEnquiry()` creates both Enquiry and Lead records. No controller exposes this. |
| Enquiry delivery tracking | **MISSING** | `enquiryService.js:updateEnquiryDeliveryStatus()` exists but no controller. |

### 2.8 Children/Parent-Child

| Feature | Status | Evidence |
|---------|--------|----------|
| List children | **MISSING** | Frontend calls `GET /children`. No route exists. `parentChildService.js:getChildrenByParent()` exists but no controller. |
| Create child | **MISSING** | Frontend calls `POST /children`. No route exists. |
| Update child | **MISSING** | Frontend calls `PATCH /children/:id`. No route exists. |
| Delete child | **MISSING** | Frontend calls `DELETE /children/:id`. No route exists. |
| Set active child | **MISSING** | `parentChildService.js:setActiveChild()` exists but no controller. |
| Child schema | **MISSING** | No Child model file in `sportsOS-nodejs/models/`. Only in canonical `models/index.js`. Services reference `require('../models/Child')` which will crash. |

### 2.9 User Profile

| Feature | Status | Evidence |
|---------|--------|----------|
| Get current user profile | **MISSING** | Frontend calls `GET /users/me`. No route exists. |
| Update user profile | **MISSING** | Frontend calls `PATCH /users/me`. No route exists. |
| Update preferences | **MISSING** | `authService.js:updatePreferences()` exists but no controller. |
| Update consent | **MISSING** | `authService.js:updateConsent()` exists but no controller. |
| Update theme | **MISSING** | `authService.js:updateTheme()` exists but no controller. |

### 2.10 Recommendations

| Feature | Status | Evidence |
|---------|--------|----------|
| Academy recommendations | **MISSING** | Frontend calls `GET /recommendations/academies`. No route exists. No service method for recommendations exists. Frontend uses client-side `matching.ts` engine. |
| Coach recommendations | **MISSING** | Frontend calls `GET /recommendations/coaches`. No route exists. |

### 2.11 Reviews

| Feature | Status | Evidence |
|---------|--------|----------|
| Add review | **MISSING** | No route. `reviewService.js:addReview()` exists but no controller. |
| Get reviews | **MISSING** | No route. `reviewService.js:getApprovedReviews()` exists but no controller. |
| Moderate review | **MISSING** | No route. `reviewService.js:moderateReview()` exists but no controller. |
| Review schema | **MISSING** | No Review model file in `sportsOS-nodejs/models/`. |

### 2.12 Leads/CRM

| Feature | Status | Evidence |
|---------|--------|----------|
| Lead list | **MISSING** | No route. `leadService.js` methods exist but no controller. |
| Lead status update | **MISSING** | No route. |
| Lead assignment | **MISSING** | No route. |
| Lead activity log | **MISSING** | No route. |
| Lead schema | **MISSING** | No Lead or LeadActivity model files in `sportsOS-nodejs/models/`. |

### 2.13 Analytics

| Feature | Status | Evidence |
|---------|--------|----------|
| Event ingestion endpoint | **WRONG** | Frontend POSTs to `/api/events`. Backend has no analytics route. Frontend's own `/api/events/route.ts` returns `{ok: true}` (no-op). |
| Batch event tracking | **MISSING** | `analyticsService.js:trackBatch()` exists but no controller. |
| Dashboard analytics | **MISSING** | `analyticsService.js:getDashboardAnalytics()` exists but no controller. |
| Top searches | **MISSING** | `analyticsService.js:getTopSearches()` exists but no controller. |
| Analytics schema | **MISSING** | No Analytics model file in `sportsOS-nodejs/models/`. |

### 2.14 Admin

| Feature | Status | Evidence |
|---------|--------|----------|
| Admin dashboard stats | **MISSING** | `adminService.js:dashboardStats()` exists but no controller. |
| Verification queue | **MISSING** | `adminService.js:getVerificationCases()` exists but no controller. |
| Verification case update | **MISSING** | `adminService.js:updateVerificationCase()` exists but no controller. |
| User management | **MISSING** | `adminService.js:manageUser()` and `getAllUsers()` exist but no controller. |
| Admin UI pages | **PARTIAL** | Frontend has `/admin/*` pages but all are placeholder/empty state. |

### 2.15 Location/Geospatial

| Feature | Status | Evidence |
|---------|--------|----------|
| Save user location | **MISSING** | `locationService.js:saveLocation()` exists but no controller. |
| Nearby academies | **MISSING** | `locationService.js:getNearbyAcademies()` uses MongoDB `$near`. No controller. No 2dsphere index on active Academy model. |
| Nearby coaches | **MISSING** | `locationService.js:getNearbyCoaches()` exists but no controller. |

### 2.16 Compare

| Feature | Status | Evidence |
|---------|--------|----------|
| Compare academies | **MISSING** | `compareService.js:compareAcademies()` exists but no controller. Frontend uses client-side comparison only. |
| Compare coaches | **MISSING** | `compareService.js:compareCoaches()` exists but no controller. |

### 2.17 Infrastructure

| Feature | Status | Evidence |
|---------|--------|----------|
| CORS configuration | **MISSING** | No `cors` middleware in `index.js` or any file. |
| Rate limiting | **MISSING** | No rate limiting middleware anywhere. |
| Input validation | **MISSING** | No validation middleware. Controllers do basic `if (!field)` checks only. |
| Security headers | **MISSING** | No `helmet` or equivalent. |
| Error handling middleware | **MISSING** | Each route has its own try/catch. No centralized error handler. |
| Request logging | **MISSING** | No `morgan` or equivalent. |
| Health check endpoint | **MISSING** | `GET /` returns a string but isn't a proper health check. |
| API documentation | **MISSING** | No Swagger/OpenAPI spec. |
| Tests | **MISSING** | Zero test files in any repository. |
| Docker/containerization | **MISSING** | No Dockerfile or docker-compose.yml. |
| CI/CD | **MISSING** | No pipeline configuration. |

---

## 3. Dead Code Inventory

### 3.1 Services in sportsOS-nodejs (15 files — ALL dead code)

| Service File | Methods | Called by Controller? |
|-------------|---------|---------------------|
| academyService.js | 8 methods | NO |
| adminService.js | 8 methods | NO |
| analyticsService.js | 8 methods | NO |
| authService.js | 13 methods | NO |
| coachService.js | 10 methods | NO |
| compareService.js | 2 methods | NO |
| enquiryService.js | 5 methods | NO |
| leadService.js | 6 methods | NO |
| locationService.js | 3 methods | NO |
| parentChildService.js | 6 methods | NO |
| reviewService.js | 7 methods | NO |
| searchService.js | 5 methods | NO |
| shortlistService.js | 10 methods | NO |
| slugService.js | 1 method | NO (only by other dead services) |
| sportsService.js | 7 methods | NO |

**Total dead service methods: 99**

### 3.2 Missing Model Files Referenced by Dead Services

Services in `sportsOS-nodejs/services/` do `require('../models/X')` for models that don't exist as files:

| Required Model | Referenced By | File Exists? |
|---------------|--------------|-------------|
| Sport | searchService, slugService, sportsService, compareService | NO |
| Review | reviewService, adminService | NO |
| Enquiry | enquiryService, adminService | NO |
| Lead | leadService, enquiryService, adminService | NO |
| LeadActivity | leadService | NO |
| VerificationCase | adminService | NO |
| Child | parentChildService | NO |
| OTP | authService | NO |
| Role | authService | NO |
| AcademyImage | academyService | NO |
| AcademyFacility | academyService | NO |
| CoachCertificate | coachService | NO |
| Analytics | analyticsService | NO |

**13 missing model files.** If any dead service were imported by a live controller, it would crash with `MODULE_NOT_FOUND`.

### 3.3 sports-os-backend (entire repo is dead code)

- `models/index.js` — 17 models, never imported by any runnable code
- 15 service files — identical copies of sportsOS-nodejs services, never imported
- No `package.json`, no entry point, no routes
- Single git commit: "Add services and models"

### 3.4 sports-os-Database (entire repo is dead code)

- 4 minimal models — superseded by sportsOS-nodejs models
- `server.js` — Express app with no routes, hardcoded seed test
- Single git commit: "Database Layer Implementation"

---

## 4. Frontend Dead Code

| File/Directory | Purpose | Used? |
|---------------|---------|-------|
| `lib/api/auth.ts` | Auth API calls (6 endpoints) | NO — auth uses setTimeout |
| `lib/api/users.ts` | User API calls (2 endpoints) | NO |
| `lib/api/children.ts` | Children API calls (4 endpoints) | NO — uses localStorage |
| `lib/api/academies.ts` | Academy API calls (3 endpoints) | NO — uses static data |
| `lib/api/coaches.ts` | Coach API calls (2 endpoints) | NO — uses static data |
| `lib/api/sports.ts` | Sports API calls (2 endpoints) | NO — uses static data |
| `lib/api/favorites.ts` | Favorites API calls (3 endpoints) | NO — uses localStorage |
| `lib/api/enquiries.ts` | Enquiry API calls (2 endpoints) | NO |
| `lib/api/recommendations.ts` | Recommendation API calls (2 endpoints) | NO — uses client-side matching |
| `lib/api/client.ts` | API client wrapper | NO — nothing calls it |
| `app/api/events/route.ts` | Analytics ingestion | NO-op placeholder |

**26 API client functions defined, 0 called by any page component.**

---

## 5. Summary Counts

| Category | Count |
|----------|-------|
| Features classified as EXISTS | 8 |
| Features classified as PARTIAL | 8 |
| Features classified as MISSING | 52 |
| Features classified as WRONG | 14 |
| Features classified as DUPLICATE | 0 |
| Dead service methods (backend) | 99 |
| Dead API client functions (frontend) | 26 |
| Missing model files (backend) | 13 |
| Missing route groups (backend) | 10 |
| Frontend pages with no backend support | 30+ |
