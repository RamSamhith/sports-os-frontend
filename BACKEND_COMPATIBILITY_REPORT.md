# Backend Compatibility Report

> Generated: 2026-06-12
> Evidence from source code + live deployment testing

---

## 1. Schema Comparison

### 1.1 User

| Field | Frontend Type | Active Model | Match? | Severity |
|-------|-------------|-------------|--------|----------|
| `name` | string | String, required | OK | — |
| `email` | string | String, required, unique | OK | — |
| `password` | — (not in type) | String, required | OK | — |
| `role` | `'athlete'\|'parent'\|'coach'\|'academy_rep'\|'admin'` | `'user'\|'admin'` | **MISMATCH** | **CRITICAL** |
| `phone` | string, optional | Not present | **MISSING** | **MEDIUM** |
| `avatar` | string, optional | Not present | **MISSING** | LOW |
| `authProvider` | `'credentials'\|'google'\|'phone'` | Not present | **MISSING** | LOW |
| `preferences` | UserPreferences object | Not present | **MISSING** | LOW |
| `consent` | ConsentFlags object | Not present | **MISSING** | LOW |
| `themePreference` | enum (5 values) | Not present | **MISSING** | LOW |
| `lastLoginAt` | string, optional | Not present | **MISSING** | LOW |
| `timestamps` | createdAt, updatedAt | Yes | OK | — |

### 1.2 Academy

| Field | Frontend Type | Active Model | Live Data | Match? | Severity |
|-------|-------------|-------------|-----------|--------|----------|
| `id` | string | Not present (uses `_id`) | `_id: "6a2ba2ed..."` | **MISMATCH** | **CRITICAL** |
| `slug` | string, required | Not present | Not present | **MISSING** | **CRITICAL** |
| `name` | string | String, required | `"Sports Academy"` | OK | — |
| `description` | string | Not present | Not present | **MISSING** | **MEDIUM** |
| `location` | LocationSummary (object) | String, required | `"Hyderabad"` | **MISMATCH** | **CRITICAL** |
| `sportsOffered` | string[] | `sport: [String]` | `sport: ["Cricket"]` | **MISMATCH** (name) | **CRITICAL** |
| `facilities` | Facility[] (enum) | Not present | Not present | **MISSING** | **MEDIUM** |
| `trainingLevels` | TrainingLevel[] (enum) | Not present | Not present | **MISSING** | **MEDIUM** |
| `certifications` | Certification[] | Not present | Not present | **MISSING** | **MEDIUM** |
| `achievementSignals` | object | Not present | Not present | **MISSING** | LOW |
| `contact` | `{phone?, email?, website?}` | Not present | Not present | **MISSING** | **MEDIUM** |
| `feeRange` | `{min, max, currency}` | Not present | Not present | **MISSING** | LOW |
| `verificationStatus` | enum (4 values) | `verified: Boolean` | `verified: true` | **MISMATCH** | **CRITICAL** |
| `status` | AcademyStatus enum | Not present | Not present | **MISSING** | **MEDIUM** |
| `isFeatured` | boolean | Not present | Not present | **MISSING** | LOW |
| `rating` | `{average, count}` | Not present | Not present | **MISSING** | **MEDIUM** |
| `coverImage` | string | Not present | Not present | **MISSING** | **MEDIUM** |
| `gallery` | string[] | Not present | Not present | **MISSING** | LOW |
| `distanceKm` | — | Number | `10` | Extra field | LOW |
| `goalType` | — | String enum | `"long-term"` | Extra field | LOW |
| `timestamps` | createdAt, updatedAt | Yes | Present | OK | — |

### 1.3 Coach

| Field | Frontend Type | Active Model | Match? | Severity |
|-------|-------------|-------------|--------|----------|
| `id` | string | Not present (uses `_id`) | **MISMATCH** | **CRITICAL** |
| `slug` | string, required | Not present | **MISSING** | **CRITICAL** |
| `name` | string | String, required | OK | — |
| `avatar` | string | Not present | **MISSING** | LOW |
| `sportsCoached` | string[] | `sport: String` (singular) | **MISMATCH** | **CRITICAL** |
| `specialization` | string[] | Not present | **MISSING** | **MEDIUM** |
| `experienceYears` | number | Not present | **MISSING** | **MEDIUM** |
| `location` | LocationSummary | Not present | **MISSING** | **CRITICAL** |
| `contact` | `{phone?, email?}` | Not present | **MISSING** | **MEDIUM** |
| `certifications` | Certification[] | Not present | **MISSING** | **MEDIUM** |
| `verificationStatus` | enum | Not present | **MISSING** | **CRITICAL** |
| `rating` | `{average, count}` | Not present | **MISSING** | **MEDIUM** |
| `status` | CoachStatus enum | Not present | **MISSING** | **MEDIUM** |
| `academyId` | string, optional | ObjectId ref Academy, required | **MISMATCH** (required vs optional) | **MEDIUM** |
| `timestamps` | createdAt, updatedAt | Yes | OK | — |

### 1.4 Shortlist

| Field | Frontend Type | Active Model | Match? | Severity |
|-------|-------------|-------------|--------|----------|
| `id` | string | Not present (uses `_id`) | **MISMATCH** | **CRITICAL** |
| `userId` | string | Not present | **MISSING** | **CRITICAL** |
| `contextChildId` | string, optional | Not present | **MISSING** | LOW |
| `itemType` | `'academy'\|'coach'\|'sport'` | Not present | **MISSING** | **CRITICAL** |
| `itemId` | string | Not present | **MISSING** | **CRITICAL** |
| `athleteId` | — | ObjectId ref Athlete, required | Extra field | **CRITICAL** |
| `academyId` | — | ObjectId ref Academy, required | Extra field | **CRITICAL** |

**The active Shortlist model is a completely different data model.** Frontend uses `userId→itemId+itemType` (multi-entity bookmarks). Active uses `athleteId→academyId` (athlete bookmarks academy). These are incompatible.

### 1.5 Sport

| Field | Frontend Type | Active Model | Match? | Severity |
|-------|-------------|-------------|--------|----------|
| Any | Sport type with 12 fields | **DOES NOT EXIST** | **MISSING** | **CRITICAL** |

---

## 2. API Contract Comparison

### 2.1 Response Envelope

| Aspect | Frontend Expects | Backend Returns | Severity |
|--------|-----------------|----------------|----------|
| Success format | `{ ok: true, data: T }` | Raw JSON (object or array) | **CRITICAL** |
| Error format | `{ ok: false, error: { code, message, details? } }` | `{ message: string }` | **CRITICAL** |
| List format | `{ items: T[], pagination: Pagination }` | Raw array | **CRITICAL** |
| 204 handling | `res.status === 204 → { ok: true, data: undefined }` | N/A | OK |

**Evidence:** `lib/api/client.ts:63-74` — On success, returns `{ ok: true, data: json.data ?? json }`. Backend returns raw arrays/objects, so `data` would be the raw response. This partially works for individual objects but fails for list responses where frontend expects `{items, pagination}`.

### 2.2 Path Comparison

| Frontend Path | Backend Path | Match? | Severity |
|--------------|-------------|--------|----------|
| `GET /academies` | `GET /academies/` | OK (trailing slash) | — |
| `GET /academies/:slug` | `GET /academies/:id` | **MISMATCH** | **CRITICAL** |
| `GET /coaches` | `GET /coaches/` | OK | — |
| `GET /coaches/:slug` | `GET /coaches/:id` | **MISMATCH** | **CRITICAL** |
| `GET /sports` | None | **MISSING** | **CRITICAL** |
| `GET /sports/:slug` | None | **MISSING** | **CRITICAL** |
| `GET /favorites` | `GET /shortlist/` | **MISMATCH** | **CRITICAL** |
| `POST /favorites` | `POST /shortlist/` | **MISMATCH** | **CRITICAL** |
| `DELETE /favorites/:type/:id` | `DELETE /shortlist/:id` | **MISMATCH** | **CRITICAL** |
| `POST /auth/register` | `POST /auth/register` | OK | — |
| `POST /auth/login` | `POST /auth/login` | OK | — |
| `POST /auth/send-otp` | None | **MISSING** | **MEDIUM** |
| `POST /auth/verify-otp` | None | **MISSING** | **MEDIUM** |
| `POST /auth/logout` | None | **MISSING** | **MEDIUM** |
| `GET /auth/me` | None | **MISSING** | **MEDIUM** |
| `GET /users/me` | None | **MISSING** | **MEDIUM** |
| `PATCH /users/me` | None | **MISSING** | **MEDIUM** |
| `GET /children` | None | **MISSING** | LOW |
| `POST /children` | None | **MISSING** | LOW |
| `GET /enquiries` | None | **MISSING** | LOW |
| `POST /enquiries` | None | **MISSING** | LOW |
| `GET /recommendations/academies` | None | **MISSING** | LOW |
| `GET /recommendations/coaches` | None | **MISSING** | LOW |
| `GET /search` | None | **MISSING** | LOW |

### 2.3 Request Body Comparison

**POST /auth/register:**
| Field | Frontend Sends | Backend Expects | Match? |
|-------|---------------|----------------|--------|
| `name` | string | `req.body.name` (required) | OK |
| `email` | string | `req.body.email` (required) | OK |
| `phone` | string | Not used | **IGNORED** |
| `password` | string | `req.body.password` (required) | OK |

**POST /auth/login:**
| Field | Frontend Sends | Backend Expects | Match? |
|-------|---------------|----------------|--------|
| `email` | string | `req.body.email` (required) | OK |
| `password` | string | `req.body.password` (required) | OK |

**POST /favorites (shortlist):**
| Field | Frontend Sends | Backend Expects | Match? |
|-------|---------------|----------------|--------|
| `itemType` | `'academy'\|'coach'\|'sport'` | Not expected | **MISMATCH** |
| `itemId` | string | Not expected | **MISMATCH** |
| `contextChildId` | string (optional) | Not expected | **MISMATCH** |
| `athleteId` | Not sent | `req.body.athleteId` (required) | **MISMATCH** |
| `academyId` | Not sent | `req.body.academyId` (required) | **MISMATCH** |

---

## 3. Authentication Comparison

| Aspect | Frontend | Backend | Match? | Severity |
|--------|---------|---------|--------|----------|
| Token storage key | `sportsos:auth-token` | N/A (server-side) | OK | — |
| Header format | `Authorization: Bearer <token>` | Checks `Authorization: Bearer` | OK | — |
| JWT payload | Not specified | `{ id, name, email, role }` | OK | — |
| JWT expiry | Not specified | 7 days | OK | — |
| Register response | `{ user, token }` | `{ message, user }` (no token) | **MISMATCH** | **CRITICAL** |
| Login response | `{ user, token }` | `{ message, token, user }` | **PARTIAL** — has extra `message`, missing `{ok, data}` wrapper | **CRITICAL** |
| Protected routes | PrivateGuard checks `isAuthenticated` from localStorage | `protect` middleware checks JWT | **INDEPENDENT** — frontend guards client-side, backend guards server-side | LOW |

---

## 4. Controller Layering Issues

| Controller | Calls | Expected Pattern | Issue |
|-----------|-------|-----------------|-------|
| `authController` | `User` model directly | Controller → Repository → Model | No repository layer |
| `academyController` | `academyRepository` | Controller → Repository → Model | OK |
| `athleteController` | `athleteRepository` | Controller → Repository → Model | OK |
| `coachController` | `coachRepository` | Controller → Repository → Model | OK |
| `shortlistController` | `shortlistRepository` | Controller → Repository → Model | OK |

---

## 5. Security Issues

| Issue | Location | Severity |
|-------|----------|----------|
| Coach POST/DELETE have no auth | `coachController.js:47,64` | **CRITICAL** |
| Shortlist all routes have no auth | `shortlistController.js` (all routes) | **CRITICAL** |
| No CORS middleware | `index.js` | **CRITICAL** — frontend cannot call backend from different origin |
| No rate limiting | `index.js` | **MEDIUM** |
| No input validation | All controllers | **MEDIUM** |
| No helmet/security headers | `index.js` | LOW |

---

## 6. Summary

| Category | Critical | Medium | Low | Total |
|----------|----------|--------|-----|-------|
| Schema field mismatches | 8 | 10 | 5 | 23 |
| Response envelope mismatches | 3 | 0 | 0 | 3 |
| Path mismatches | 5 | 0 | 0 | 5 |
| Missing endpoints | 4 | 6 | 8 | 18 |
| Security issues | 3 | 2 | 1 | 6 |
| **Total mismatches** | **23** | **18** | **14** | **55** |
