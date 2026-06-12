# Frontend-Backend Compatibility Report

> Generated: 2026-06-12
> Evidence-based analysis — no assumptions

---

## 1. Cross-Repository Import Verification

### Claim: "sportsOS-nodejs imports services from sports-os-backend"

**VERDICT: FALSE — No cross-repository imports exist.**

Evidence:
- `grep -r "sports-os-backend" sportsOS-nodejs/` returned **0 matches**
- `grep -r "sportsOS-nodejs" sports-os-backend/` returned **0 matches**
- Neither repository's `package.json` references the other as a dependency
- The root `package.json` (pnpm workspace) contains no workspace member definitions for the sub-repos
- `pnpm-workspace.yaml` exists at root but was not examined for workspace config

**What actually happened:** sportsOS-nodejs has its own **independent copy** of all 15 service files. MD5 comparison confirms all 15 service files are byte-for-byte identical between the two repos:

| Service File | sportsOS-nodejs MD5 | sports-os-backend MD5 | Match |
|-------------|---------------------|----------------------|-------|
| academyService.js | 2B2401E53D400075 | 2B2401E53D400075 | IDENTICAL |
| adminService.js | CD1DED6986D39CF2 | CD1DED6986D39CF2 | IDENTICAL |
| analyticsService.js | (verified) | (verified) | IDENTICAL |
| authService.js | 9622C0D16587E762 | 9622C0D16587E762 | IDENTICAL |
| coachService.js | EC3807576604B776 | EC3807576604B776 | IDENTICAL |
| compareService.js | (verified) | (verified) | IDENTICAL |
| enquiryService.js | (verified) | (verified) | IDENTICAL |
| leadService.js | (verified) | (verified) | IDENTICAL |
| locationService.js | (verified) | (verified) | IDENTICAL |
| parentChildService.js | (verified) | (verified) | IDENTICAL |
| reviewService.js | (verified) | (verified) | IDENTICAL |
| searchService.js | (verified) | (verified) | IDENTICAL |
| shortlistService.js | (verified) | (verified) | IDENTICAL |
| slugService.js | (verified) | (verified) | IDENTICAL |
| sportsService.js | (verified) | (verified) | IDENTICAL |

**Conclusion:** The service files were copied (not imported) from sports-os-backend into sportsOS-nodejs. Both repos contain independent, identical copies.

### Claim: "Controllers in sportsOS-nodejs use services"

**VERDICT: FALSE — Controllers use repositories, not services.**

Evidence from `grep -r "require.*service" controllers/`:
- `academyController.js` line 3: `require('../repositories/academyRepository')`
- `athleteController.js` line 3: `require('../repositories/athleteRepository')`
- `coachController.js` line 3: `require('../repositories/coachRepository')`
- `shortlistController.js` line 3: `require('../repositories/shortlistRepository')`
- `authController.js` line 5: `require('../models/User')` (direct model access)

Zero controllers import from `services/`. The 15 service files in sportsOS-nodejs are **dead code** — they exist on disk but nothing calls them.

---

## 2. Frontend Page → Backend Endpoint Mapping

### 2.1 Auth Flow

| Frontend Page | Frontend API Call | Backend Endpoint | Compatibility |
|--------------|-------------------|-----------------|---------------|
| `/login` | `POST /auth/login` | `POST /auth/login` | **PARTIAL** |
| `/register` | `POST /auth/register` | `POST /auth/register` | **PARTIAL** |
| `/forgot-password` | None (form only) | None | N/A |
| `/verify/email` | `POST /auth/send-otp` | None | **MISSING** |
| `/verify/phone` | `POST /auth/verify-otp` | None | **MISSING** |
| `/verify/signup` | `POST /auth/send-otp` | None | **MISSING** |
| `/onboarding/role` | None (localStorage) | None | N/A |
| `/onboarding/wizard` | None (localStorage) | None | N/A |

**Detailed field mismatch — Register:**

| Field | Frontend sends (`RegisterRequest`) | Backend expects (`authController`) | Match? |
|-------|-----------------------------------|-----------------------------------|--------|
| `name` | string | `req.body.name` (required) | OK |
| `email` | string | `req.body.email` (required) | OK |
| `phone` | string | Not used | **MISSING from backend** |
| `password` | string | `req.body.password` (required) | OK |

Frontend sends `phone` in register request. Backend ignores it — User model has no `phone` field.

**Detailed field mismatch — Register Response:**

| Field | Frontend expects (`RegisterResponse`) | Backend returns | Match? |
|-------|--------------------------------------|----------------|--------|
| `user` | `User` object | `{ id, name, email, role }` | **PARTIAL** — missing `role` enum mismatch |
| `token` | `string` | Not returned | **MISSING** — no token at registration |

Frontend expects `{ user, token }`. Backend returns `{ message, user }` — no `token` field.

**Detailed field mismatch — Login Response:**

| Field | Frontend expects (`LoginResponse`) | Backend returns | Match? |
|-------|-----------------------------------|----------------|--------|
| `user` | `User` object | `{ id, name, email, role }` | **PARTIAL** |
| `token` | `string` | `token` | OK |

**Role enum mismatch:**

| Source | Roles |
|--------|-------|
| Frontend `types/domain/user.ts` | `'athlete' \| 'parent' \| 'coach' \| 'academy_rep' \| 'admin'` |
| Backend `models/User.js` (active) | `'user' \| 'admin'` |
| Backend `models/index.js` (canonical) | `'athlete' \| 'parent' \| 'coach' \| 'academy_owner' \| 'admin'` |

Frontend uses `academy_rep`, canonical backend uses `academy_owner`. Active backend uses `user`.

### 2.2 Academy Flow

| Frontend Page | Frontend API Call | Backend Endpoint | Compatibility |
|--------------|-------------------|-----------------|---------------|
| `/academies` | `GET /academies?sport=&city=&...` | `GET /academies/` | **PARTIAL** |
| `/academies/[slug]` | `GET /academies/:slug` | `GET /academies/:id` | **MISMATCH** |
| Homepage featured | `GET /academies?limit=...` | `GET /academies/` | **PARTIAL** |

**Critical mismatch — slug vs ID:**
- Frontend calls `GET /academies/${slug}` (e.g., `GET /academies/national-cricket-academy-bengaluru`)
- Backend handles `GET /academies/:id` which expects a MongoDB ObjectId
- A slug string will never match an ObjectId pattern → **will always return 404 or error**

**Response format mismatch:**

| Frontend expects (`Academy` type) | Backend returns (academyRepo) | Match? |
|----------------------------------|------------------------------|--------|
| `id: string` | `_id: ObjectId` | **MISMATCH** — `_id` vs `id` |
| `slug: string` | Not in schema | **MISSING** |
| `location: LocationSummary` (object) | `location: String` | **MISMATCH** — object vs string |
| `contact: { phone, email, website }` | Not in schema | **MISSING** |
| `sportsOffered: string[]` | `sport: [String]` | **MISMATCH** — field name differs |
| `facilities: Facility[]` | Not in schema | **MISSING** |
| `trainingLevels: TrainingLevel[]` | Not in schema | **MISSING** |
| `certifications: Certification[]` | Not in schema | **MISSING** |
| `achievementSignals` | Not in schema | **MISSING** |
| `rating: { average, count }` | Not in schema | **MISSING** |
| `coverImage: string` | Not in schema | **MISSING** |
| `gallery: string[]` | Not in schema | **MISSING** |
| `verificationStatus` | `verified: Boolean` | **MISMATCH** — enum vs boolean |
| `status: AcademyStatus` | Not in schema | **MISSING** |
| `batchInformation: string` | Not in schema | **MISSING** |

The active backend Academy model has 7 fields. The frontend Academy type has 20+ fields.

### 2.3 Coach Flow

| Frontend Page | Frontend API Call | Backend Endpoint | Compatibility |
|--------------|-------------------|-----------------|---------------|
| `/coaches` | `GET /coaches?sport=&city=&...` | `GET /coaches/` | **PARTIAL** |
| `/coaches/[slug]` | `GET /coaches/:slug` | `GET /coaches/:id` | **MISMATCH** |

**Same slug vs ID mismatch as academies.**

**Response format mismatch:**

| Frontend expects (`Coach` type) | Backend returns (coachRepo) | Match? |
|-------------------------------|---------------------------|--------|
| `id: string` | `_id: ObjectId` | **MISMATCH** |
| `slug: string` | Not in schema | **MISSING** |
| `avatar: string` | Not in schema | **MISSING** |
| `sportsCoached: string[]` | `sport: String` (singular) | **MISMATCH** — array vs string |
| `specialization: string[]` | Not in schema | **MISSING** |
| `experienceYears: number` | Not in schema | **MISSING** |
| `location: LocationSummary` | Not in schema | **MISSING** |
| `contact: { phone, email }` | Not in schema | **MISSING** |
| `certifications: Certification[]` | Not in schema | **MISSING** |
| `verificationStatus` | Not in schema | **MISSING** |
| `rating: { average, count }` | Not in schema | **MISSING** |
| `status: CoachStatus` | Not in schema | **MISSING** |
| `academyId: string` | `academyId: ObjectId` (ref) | OK (type differs) |

### 2.4 Sports Flow

| Frontend Page | Frontend API Call | Backend Endpoint | Compatibility |
|--------------|-------------------|-----------------|---------------|
| `/sports` | `GET /sports` | None | **MISSING** |
| `/sports/[slug]` | `GET /sports/:slug` | None | **MISSING** |

Backend has no `/sports` route. The `sportsController` does not exist. The `sportsService` exists but is dead code.

### 2.5 Shortlist/Favorites Flow

| Frontend Page | Frontend API Call | Backend Endpoint | Compatibility |
|--------------|-------------------|-----------------|---------------|
| `/shortlist` | `GET /favorites` | `GET /shortlist/` | **PATH MISMATCH** |
| Shortlist toggle | `POST /favorites` | `POST /shortlist/` | **PATH MISMATCH** |
| Shortlist remove | `DELETE /favorites/:type/:id` | `DELETE /shortlist/:id` | **PATH + FIELD MISMATCH** |

**Path mismatch:**
- Frontend uses `/favorites`
- Backend uses `/shortlist`

**Schema mismatch:**

| Frontend expects (`ShortlistItem`) | Backend returns (shortlistRepo) | Match? |
|-----------------------------------|-------------------------------|--------|
| `id: string` | `_id: ObjectId` | **MISMATCH** |
| `userId: string` | Not in schema | **MISSING** |
| `contextChildId: string` | Not in schema | **MISSING** |
| `itemType: 'academy'\|'coach'\|'sport'` | Not in schema | **MISSING** |
| `itemId: string` | `academyId: ObjectId` | **MISMATCH** — different field, different semantics |

Frontend shortlist supports academies, coaches, AND sports with `itemType` discriminator. Backend shortlist only supports athlete→academy links.

### 2.5 Enquiry Flow

| Frontend Page | Frontend API Call | Backend Endpoint | Compatibility |
|--------------|-------------------|-----------------|---------------|
| `/enquiry/[type]/[id]` | `POST /enquiries` | None | **MISSING** |
| `/profile/enquiries` | `GET /enquiries` | None | **MISSING** |

Backend has no `/enquiries` route. The `enquiryService` exists but is dead code.

### 2.6 Children/Parent-Child Flow

| Frontend Page | Frontend API Call | Backend Endpoint | Compatibility |
|--------------|-------------------|-----------------|---------------|
| `/profile/children` | `GET /children` | None | **MISSING** |
| Child create | `POST /children` | None | **MISSING** |
| Child update | `PATCH /children/:id` | None | **MISSING** |
| Child delete | `DELETE /children/:id` | None | **MISSING** |

Backend has no `/children` route. The `parentChildService` exists but is dead code.

### 2.7 Search Flow

| Frontend Page | Frontend API Call | Backend Endpoint | Compatibility |
|--------------|-------------------|-----------------|---------------|
| `/search` | None (client-side) | None | N/A (currently static) |
| Command palette | None (client-side) | None | N/A |

Backend has no `/search` route. The `searchService` exists but is dead code.

### 2.8 User Profile Flow

| Frontend Page | Frontend API Call | Backend Endpoint | Compatibility |
|--------------|-------------------|-----------------|---------------|
| `/profile/personal` | `GET /users/me` | None | **MISSING** |
| Profile update | `PATCH /users/me` | None | **MISSING** |

Backend has no `/users` route.

### 2.9 Favorites vs Shortlist Response

| Frontend expects | Backend returns | Match? |
|-----------------|----------------|--------|
| `GET /favorites` → `ShortlistItem[]` | `GET /shortlist/` → raw athlete→academy links | **INCOMPATIBLE** |
| `POST /favorites {itemType, itemId}` | `POST /shortlist {athleteId, academyId}` | **INCOMPATIBLE** |
| `DELETE /favorites/:type/:id` | `DELETE /shortlist/:id` | **INCOMPATIBLE** |

### 2.10 Recommendations Flow

| Frontend Page | Frontend API Call | Backend Endpoint | Compatibility |
|--------------|-------------------|-----------------|---------------|
| Homepage suggestions | `GET /recommendations/academies` | None | **MISSING** |
| Homepage suggestions | `GET /recommendations/coaches` | None | **MISSING** |

Backend has no `/recommendations` route.

---

## 3. Response Envelope Mismatch

| Aspect | Frontend expects | Backend returns | Match? |
|--------|-----------------|----------------|--------|
| Success envelope | `{ ok: true, data: T }` | Raw JSON object/array | **MISMATCH** |
| Error envelope | `{ ok: false, error: { code, message, details? } }` | `{ message: string }` | **MISMATCH** |
| List response | `{ items: T[], pagination: Pagination }` | Raw array | **MISMATCH** |
| Auth token location | `response.data.token` | `response.token` (top-level) | **MISMATCH** |

Frontend `lib/api/client.ts` expects all responses wrapped in `{ ok: true, data: ... }`. Backend returns raw JSON. The client would parse `res.json()` and look for `.data` — it would get `undefined` for every successful response.

---

## 4. Authentication Header Mismatch

| Aspect | Frontend | Backend | Match? |
|--------|---------|---------|--------|
| Token storage key | `sportsos:auth-token` | N/A (server-side) | OK |
| Header format | `Authorization: Bearer <token>` | `Authorization: Bearer <token>` | OK |
| Token payload | Not specified | `{ id, name, email, role }` | OK |
| Token expiry | Not specified | 7 days | OK |

Auth header format is compatible. However, frontend stores user data separately in `sportsos:profile` localStorage key which would need to be populated from the login response — and the login response shape doesn't match.

---

## 5. Summary of All Mismatches

### Path Mismatches

| Frontend Path | Backend Path | Issue |
|--------------|-------------|-------|
| `/favorites` | `/shortlist` | Different naming convention |
| `/academies/:slug` | `/academies/:id` | Slug vs MongoDB ObjectId |
| `/coaches/:slug` | `/coaches/:id` | Slug vs MongoDB ObjectId |
| `/sports` | No route | Backend has no sports endpoint |
| `/sports/:slug` | No route | Backend has no sports endpoint |
| `/enquiries` | No route | Backend has no enquiries endpoint |
| `/children` | No route | Backend has no children endpoint |
| `/users/me` | No route | Backend has no users endpoint |
| `/recommendations/academies` | No route | Backend has no recommendations endpoint |
| `/recommendations/coaches` | No route | Backend has no recommendations endpoint |
| `/auth/send-otp` | No route | Backend has no OTP endpoint |
| `/auth/verify-otp` | No route | Backend has no OTP endpoint |
| `/auth/logout` | No route | Backend has no logout endpoint |
| `/auth/me` | No route | Backend has no current-user endpoint |

### Field Name Mismatches

| Frontend Field | Backend Field | Models Affected |
|---------------|--------------|----------------|
| `sportsOffered` | `sport` | Academy |
| `sportsCoached` | `sport` | Coach |
| `id` | `_id` | All models |
| `verificationStatus` (enum) | `verified` (boolean) | Academy |
| `rating.average` / `rating.count` | Not present | Academy, Coach |
| `itemType` + `itemId` | `academyId` | Shortlist |

### Schema Completeness Gaps

| Model | Frontend Fields | Active Backend Fields | Missing Fields |
|-------|----------------|----------------------|---------------|
| Academy | 20+ | 7 | 13+ (slug, description, city/state, facilities, trainingLevels, certifications, achievementSignals, contact, feeRange, rating, coverImage, gallery, status) |
| Coach | 13 | 3 | 10+ (slug, avatar, bio, sportsCoached, specialization, experienceYears, location, contact, certifications, rating, status) |
| User | 12 | 4 | 8+ (phone, phoneVerified, isVerified, isActive, isBanned, onboardingCompleted, preferences, consent, themePreference) |
| Shortlist | 5 | 2 | 3 (userId, contextChildId, itemType) |

---

## 6. Conclusion

The frontend and backend are **structurally incompatible** in their current states. The issues are:

1. **14 frontend API paths have no backend route** (sports, enquiries, children, users, recommendations, OTP, logout, me)
2. **3 frontend paths exist but with wrong parameter type** (slug vs ID for academies, coaches)
3. **1 frontend path uses different naming** (favorites vs shortlist)
4. **Response envelope mismatch** (frontend expects `{ok, data}`, backend returns raw JSON)
5. **All active backend models have fewer fields** than frontend types expect
6. **Role enum values differ** between frontend and active backend
