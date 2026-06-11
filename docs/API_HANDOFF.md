# SportsOS — API Handoff Document

**Base URL:** `https://api.sportsos.example.com/v1` (configurable via `NEXT_PUBLIC_API_URL`)

---

## 1. Standard Conventions

### 1.1 Response Wrapper

All endpoints use a standard response envelope:

```typescript
// Success
{ "ok": true, "data": T }

// Error
{ "ok": false, "error": { "code": string, "message": string, "details"?: Record<string, unknown> } }
```

### 1.2 Paginated Response

List endpoints returning multiple items use:

```typescript
{
  "ok": true,
  "data": {
    "items": T[],
    "pagination": {
      "page": number,      // 1-based
      "pageSize": number,  // items per page
      "total": number,     // total matching items
      "hasMore": boolean   // more pages available
    }
  }
}
```

Default `pageSize`: 20. Maximum `pageSize`: 100.

### 1.3 Authentication

Endpoints marked **Auth required: Yes** expect:

```
Authorization: Bearer <jwt_token>
```

Tokens are issued by `POST /auth/register`, `POST /auth/login`, and `POST /auth/verify-otp`.

### 1.4 Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `NETWORK_ERROR` | — | Client-side fetch failure (frontend-only, never returned by server) |
| `VALIDATION_ERROR` | 400 | Request body or query params failed validation; `details` contains field-level errors |
| `UNAUTHORIZED` | 401 | Missing, expired, or invalid JWT token |
| `FORBIDDEN` | 403 | Authenticated but insufficient permissions |
| `NOT_FOUND` | 404 | Resource does not exist |
| `RATE_LIMITED` | 429 | Too many requests; include `Retry-After` header |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### 1.5 CORS Requirements

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

The frontend runs at `http://localhost:3000` in development and may run on any domain in production. Accept all origins or use a dynamic allowlist including the site URL from `NEXT_PUBLIC_SITE_URL`.

### 1.6 Rate Limiting

| Scope | Limit | Window |
|-------|-------|--------|
| Auth endpoints (`/auth/*`) | 10 requests | 1 minute per IP |
| Enquiry creation (`POST /enquiries`) | 5 requests | 1 hour per IP |
| All other endpoints | 100 requests | 1 minute per IP |

On rate limit, return `429 RATE_LIMITED` with `Retry-After` header (seconds).

### 1.7 WebSocket / Realtime

**None required currently.** All data fetching is request-response. No SSE, no WebSocket, no real-time push needed for MVP.

---

## 2. Authentication Endpoints

### 2.1 POST /auth/register

Register a new user account.

- **Auth:** No
- **Content-Type:** `application/json`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "securePassword123"
}
```

**Validation:**
| Field | Rule |
|-------|------|
| `name` | Required, 1–100 chars |
| `email` | Required, valid email, unique |
| `phone` | Required, valid Indian phone (10-15 digits with country code), unique |
| `password` | Required, min 8 chars, ≥1 uppercase, ≥1 lowercase, ≥1 number |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "user": { /* User object */ },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Codes:** `VALIDATION_ERROR` (400), `EMAIL_ALREADY_EXISTS` (409), `PHONE_ALREADY_EXISTS` (409)

---

### 2.2 POST /auth/login

Authenticate with email and password.

- **Auth:** No

**Request:**
```json
{ "email": "john@example.com", "password": "securePassword123" }
```

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "user": { /* User object with lastLoginAt */ },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Codes:** `VALIDATION_ERROR` (400), `INVALID_CREDENTIALS` (401), `ACCOUNT_SUSPENDED` (403)

---

### 2.3 POST /auth/send-otp

Send a one-time password via the specified channel.

- **Auth:** No

**Request:**
```json
{ "method": "sms", "destination": "+919876543210" }
```

| Field | Rule |
|-------|------|
| `method` | Required: `'email'` \| `'sms'` \| `'whatsapp'` |
| `destination` | Required: email if method=email, phone if sms/whatsapp |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "expiresAt": "2026-06-11T10:05:00.000Z",
    "cooldownSeconds": 30
  }
}
```

**Error Codes:** `VALIDATION_ERROR` (400), `RATE_LIMITED` (429), `INVALID_DESTINATION` (400)

---

### 2.4 POST /auth/verify-otp

Verify a one-time password.

- **Auth:** No

**Request:**
```json
{ "method": "sms", "destination": "+919876543210", "code": "123456" }
```

| Field | Rule |
|-------|------|
| `code` | Required, 4–8 digit string |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "verified": true,
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Note:** `token` is only returned during signup OTP verification (to auto-authenticate after signup). For login OTP flows, the token may be returned here or a separate login step may be required. The frontend expects the token from verify-otp for the signup flow.

**Error Codes:** `VALIDATION_ERROR` (400), `INVALID_OTP` (401), `OTP_EXPIRED` (410)

---

### 2.5 POST /auth/logout

Invalidate the current session.

- **Auth:** Yes
- **Body:** None

**Response (200):** `{ "ok": true, "data": null }`

**Error Codes:** `UNAUTHORIZED` (401)

---

### 2.6 GET /auth/me

Get the current authenticated user.

- **Auth:** Yes
- **Query:** None

**Response (200):**
```json
{
  "ok": true,
  "data": { /* User object */ }
}
```

**Error Codes:** `UNAUTHORIZED` (401), `USER_NOT_FOUND` (404)

### User Object Shape

```typescript
{
  id: string;
  role: 'athlete' | 'parent' | 'coach' | 'academy_rep' | 'admin';
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  authProvider?: 'credentials' | 'google' | 'phone';
  lastLoginAt?: string;  // ISO 8601
  preferences?: {
    location?: LocationSummary;
    defaultRadiusKm?: number;
    defaultSportInterests?: string[];
    searchPreferences?: { city?: string; radius?: number; sports?: string[]; skillLevel?: string; goals?: string };
    settings?: { analytics?: boolean; marketing?: boolean; whatsapp?: boolean };
    notifications?: { emailNotifications?: boolean; marketingUpdates?: boolean; whatsappNotifications?: boolean };
    privacy?: { profileVisibility?: boolean; analyticsConsent?: boolean; personalizedRecommendations?: boolean };
    motion?: { reducedMotion?: boolean };
    selectedAcademyId?: string;
  };
  themePreference?: string;
  consent?: { analytics: boolean; marketing: boolean; whatsapp: boolean };
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

---

## 3. User Endpoints

### 3.1 GET /users/me

Alias for `GET /auth/me`. Returns the same User object.

- **Auth:** Yes

### 3.2 PATCH /users/me

Update the current user's profile.

- **Auth:** Yes

**Request (all fields optional):**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "phone": "+919876543211",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": { /* partial UserPreferences */ },
  "consent": { "analytics": true, "marketing": false, "whatsapp": true },
  "themePreference": "ember-orange"
}
```

**Response (200):** Updated User object.

**Error Codes:** `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `EMAIL_ALREADY_EXISTS` (409), `PHONE_ALREADY_EXISTS` (409)

---

## 4. Children Endpoints

### 4.1 GET /children

List children for the authenticated parent.

- **Auth:** Yes (parent role)

**Response (200):**
```json
{
  "ok": true,
  "data": [ /* Child[] */ ]
}
```

**Error Codes:** `UNAUTHORIZED` (401), `FORBIDDEN` (403)

### 4.2 POST /children

Add a new child.

- **Auth:** Yes (parent role)

**Request:**
```json
{
  "name": "Jane Doe",
  "age": 12,
  "gender": "female",
  "sportInterests": ["swimming", "tennis"]
}
```

**Validation:**
| Field | Rule |
|-------|------|
| `name` | Required, 1–100 chars |
| `age` | Required, 1–25 |
| `gender` | Optional: `'male'` \| `'female'` \| `'other'` \| `'prefer_not_to_say'` |
| `sportInterests` | Optional, array of sport slugs |

**Response (201):** Child object.

**Error Codes:** `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403)

### 4.3 PATCH /children/:id

Update a child.

- **Auth:** Yes (parent role, must own child)

**Request (all fields optional):** Same shape as POST /children.

### 4.4 DELETE /children/:id

Delete a child.

- **Auth:** Yes (parent role, must own child)

**Response (200):** `{ "ok": true, "data": null }`

**Error Codes:** `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404)

### Child Object Shape

```typescript
{
  id: string;
  parentId: string;
  name: string;
  age: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  sportInterests: string[];  // sport slugs
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

---

## 5. Academy Endpoints

### 5.1 GET /academies

Search and list academies.

- **Auth:** No

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `sport` | string? | — | Filter by sport slug |
| `city` | string? | — | Filter by city |
| `state` | string? | — | Filter by state |
| `facility` | string? | — | Filter by facility type |
| `trainingLevel` | string? | — | Filter by training level |
| `verificationStatus` | string? | — | `'verified'` \| `'pending'` \| `'unverified'` |
| `minRating` | number? | — | Minimum average rating (0–5) |
| `page` | number? | 1 | Page number (1-based) |
| `limit` | number? | 20 | Items per page (max 100) |
| `sort` | string? | `'rating'` | Sort field |

**Response (200):** Paginated `ListResponse<Academy>`

**Error Codes:** `VALIDATION_ERROR` (400), `INVALID_SORT` (400)

### 5.2 GET /academies/:slug

Get academy detail with coaches.

- **Auth:** No

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "academy": { /* Academy object */ },
    "coaches": [
      { "id": "coh_001", "slug": "...", "name": "...", "rating": { "average": 4.8, "count": 45 } }
    ]
  }
}
```

**Note:** The API client expects `AcademyDetailResponse` which extends `Academy` with optional `coaches` array. The current frontend code in `lib/api/academies.ts` returns `ApiResponse<AcademyDetailResponse>` — it does NOT wrap in `{ academy, coaches }`; it expects the top-level `data` to be the combined object. Aligning the response wrapper is needed: the frontend either calls `get<AcademyDetailResponse>` and expects flattening, or the backend wraps as shown above.

**Error Codes:** `NOT_FOUND` (404)

### Academy Object Shape

```typescript
{
  id: string;
  slug: string;
  name: string;
  description: string;
  location: LocationSummary;  // { city, state, country, lat, lng, address?, district?, pincode?, geohash? }
  contact: { phone?: string; email?: string; website?: string };
  sportsOffered: string[];  // sport slugs
  facilities: Facility[];  // 'indoor' | 'outdoor' | 'ground' | 'court' | ...
  trainingLevels: TrainingLevel[];  // 'beginner' | 'intermediate' | 'advanced' | 'elite'
  ageRange?: { min?: number; max?: number };
  batchInformation?: string;
  certifications: Certification[];
  verificationStatus: VerificationStatus;  // 'unverified' | 'pending' | 'verified' | 'rejected'
  verificationEvidence?: VerificationEvidence[];
  achievementSignals: { stateAthletesProduced: number; nationalAthletesProduced: number; ... };
  rating: { average: number; count: number };
  coverImage?: string;
  gallery: string[];
  status: 'draft' | 'published' | 'suspended';
  lastUpdatedAt: string;
  createdAt: string;
  indexedAt?: string;
}
```

---

## 6. Coach Endpoints

### 6.1 GET /coaches

Search and list coaches.

- **Auth:** No

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `sport` | string? | — | Filter by sport slug |
| `city` | string? | — | Filter by city |
| `state` | string? | — | Filter by state |
| `academyId` | string? | — | Filter by affiliated academy |
| `minRating` | number? | — | Minimum average rating |
| `page` | number? | 1 | Page number |
| `limit` | number? | 20 | Items per page (max 100) |
| `sort` | string? | `'rating'` | Sort field |

**Response (200):** Paginated `ListResponse<Coach>`

### 6.2 GET /coaches/:slug

Get coach detail.

- **Auth:** No

**Response (200):** `{ "ok": true, "data": { /* Coach object */ } }`

**Error Codes:** `NOT_FOUND` (404)

### Coach Object Shape

```typescript
{
  id: string;
  slug: string;
  name: string;
  avatar?: string;
  certifications: Certification[];
  experienceYears: number;
  sportsCoached: string[];  // sport slugs
  specialization: string[];
  academyId?: string;
  location: LocationSummary;
  contact: { phone?: string; email?: string };
  verificationStatus: VerificationStatus;
  rating: { average: number; count: number };
  status: 'draft' | 'published' | 'suspended';
  lastUpdatedAt: string;
  createdAt: string;
}
```

---

## 7. Favorites / Shortlist Endpoints

### 7.1 GET /favorites

List all shortlisted items.

- **Auth:** Yes

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": "fav_001",
      "userId": "usr_abc123",
      "contextChildId": "chd_xyz789",
      "itemType": "academy",
      "itemId": "acd_001",
      "createdAt": "2026-06-10T08:00:00.000Z"
    }
  ]
}
```

### 7.2 POST /favorites

Add item to shortlist.

- **Auth:** Yes

**Request:**
```json
{ "itemType": "academy", "itemId": "acd_001", "contextChildId": "chd_xyz789" }
```

**Validation:**
- `itemType`: Required, one of `'academy'` \| `'coach'` \| `'sport'`
- `itemId`: Required, must reference an existing entity
- `contextChildId`: Optional, must reference a child owned by the user

**Response (201):** ShortlistItem object.

**Error Codes:** `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `ALREADY_EXISTS` (409), `NOT_FOUND` (404)

### 7.3 DELETE /favorites/:itemType/:itemId

Remove from shortlist.

- **Auth:** Yes

**Response (200):** `{ "ok": true, "data": null }`

**Error Codes:** `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `NOT_FOUND` (404)

---

## 8. Enquiry Endpoints

### 8.1 GET /enquiries

List user enquiries.

- **Auth:** Yes

**Response (200):** `{ "ok": true, "data": Enquiry[] }`

### 8.2 POST /enquiries

Submit a new enquiry. This is the primary conversion action.

- **Auth:** No (enquiries accepted without login for lead generation)

**Request:**
```json
{
  "targetType": "academy",
  "targetId": "acd_001",
  "intent": "trial",
  "parentInfo": { "name": "John Doe", "email": "john@example.com", "phone": "+919876543210" },
  "childInfo": { "name": "Jane Doe", "age": 12 },
  "sportInterest": "swimming",
  "message": "Interested in weekend trial sessions"
}
```

**Validation:**
| Field | Rule |
|-------|------|
| `targetType` | Required: `'academy'` \| `'coach'` |
| `targetId` | Required, must reference existing entity |
| `intent` | Required: `'contact'` \| `'callback'` \| `'trial'` \| `'enrollment_interest'` |
| `parentInfo.name` | Required, 1–100 chars |
| `parentInfo.email` | Required, valid email |
| `parentInfo.phone` | Required, valid phone |
| `sportInterest` | Required, 1–100 chars |
| `message` | Optional, max 2000 chars |

**Response (201):**
```json
{
  "ok": true,
  "data": {
    "enquiryId": "enq_001",
    "leadId": "lead_001",
    "whatsappConfirmationSent": true
  }
}
```

**Error Codes:** `VALIDATION_ERROR` (400), `NOT_FOUND` (404), `RATE_LIMITED` (429)

### Enquiry Object Shape

```typescript
{
  id: string;
  userId?: string;
  childId?: string;
  targetType: 'academy' | 'coach';
  targetId: string;
  intent: 'contact' | 'callback' | 'trial' | 'enrollment_interest';
  parentInfo: { name: string; email: string; phone: string };
  childInfo?: { name: string; age: number };
  sportInterest: string;
  message?: string;
  status: 'submitted' | 'delivered' | 'failed' | 'bounced';
  deliveryAttempts: number;
  lastDeliveryAt?: string;
  failureReason?: string;
  whatsappConfirmationSent: boolean;
  whatsappMessageId?: string;
  leadId?: string;
  ipHash?: string;
  userAgentHash?: string;
  createdAt: string;
}
```

---

## 9. Recommendations Endpoints

### 9.1 GET /recommendations/academies

Get personalized academy recommendations.

- **Auth:** No (optional auth for personalization)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `userId` | string? | User ID for personalized results |
| `childId` | string? | Child ID to tailor by child's interests |
| `sport` | string? | Sport filter |
| `city` | string? | City filter |
| `skillLevel` | string? | Desired skill level |
| `age` | number? | Athlete's age |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "primary": [ /* SuggestedAcademy[] */ ],
    "fallback": [ /* SuggestedAcademy[] */ ],
    "hasExactMatch": true
  }
}
```

The frontend matching engine scores by: sport match (10pts), location hierarchy (2-8pts), skill level (5pts), age range (3pts), proximity via Haversine (2-6pts), rating (1× avg). The backend should implement equivalent logic or accept these as query parameters and return scored results.

### 9.2 GET /recommendations/coaches

Same pattern as academies.

- **Auth:** No (optional auth)

**Query Parameters:** Same as academies recommendations.

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "primary": [ /* SuggestedCoach[] */ ],
    "fallback": [ /* SuggestedCoach[] */ ],
    "hasExactMatch": true
  }
}
```

**Error Codes:** `NOT_FOUND` (404) — user or child not found

---

## 10. Recently Viewed Endpoint

### 10.1 POST /recently-viewed

Record a view.

- **Auth:** Yes

**Request:**
```json
{ "id": "acd_001", "slug": "sports-academy-delhi", "type": "academy", "name": "Sports Academy Delhi" }
```

**Response (200):** `{ "ok": true, "data": null }`

**Error Codes:** `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401)

---

## 11. Search Endpoint

### 11.1 GET /search/suggest

Get search suggestions across entities.

- **Auth:** No

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `query` | string | — | Search text (required, min 2 chars) |
| `entity` | string? | `'all'` | Scope: `'academy'` \| `'coach'` \| `'sport'` \| `'all'` |
| `limit` | number? | 10 | Max suggestions (1–50) |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "suggestions": [
      { "entity": "academy", "id": "acd_001", "slug": "sports-academy-delhi", "label": "Sports Academy Delhi", "sublabel": "Delhi, India" },
      { "entity": "coach", "id": "coh_001", "slug": "virat-coach", "label": "Virat Singh", "sublabel": "Cricket Coach · Delhi" },
      { "entity": "sport", "id": "sport_cricket", "slug": "cricket", "label": "Cricket", "sublabel": "Team Sport" }
    ]
  }
}
```

**Error Codes:** `VALIDATION_ERROR` (400) — query too short or invalid entity parameter

---

## 12. File Upload Expectations

### VerificationEvidence Documents

Academies and coaches have `verificationEvidence` arrays that may contain document/image URLs. The frontend currently uses static fixture data. For backend integration:

- **Upload endpoint needed:** `POST /upload` (not yet defined in API modules)
- **Accepted types:** JPEG, PNG, PDF (max 10MB per file)
- **Storage:** Cloud storage (S3/GCS), return signed URL
- **Expected response:**
  ```json
  { "ok": true, "data": { "url": "https://cdn.sportsos.example.com/uploads/doc_abc123.pdf" } }
  ```

### Avatar Upload

- **Upload endpoint:** Use same `POST /upload` or dedicated `POST /upload/avatar`
- **Accepted types:** JPEG, PNG, WebP (max 5MB)
- **Crop/optimize:** Accept images up to 1024×1024, return optimized 256×256 thumbnail

---

## 13. Summary — Complete Endpoint Index

| # | Method | Path | Auth | Request/Query | Response Shape |
|---|--------|------|------|---------------|----------------|
| 1 | POST | `/auth/register` | No | `RegisterRequest` | `{ user, token }` |
| 2 | POST | `/auth/login` | No | `LoginRequest` | `{ user, token }` |
| 3 | POST | `/auth/send-otp` | No | `SendOtpRequest` | `{ expiresAt, cooldownSeconds }` |
| 4 | POST | `/auth/verify-otp` | No | `VerifyOtpRequest` | `{ verified, token? }` |
| 5 | POST | `/auth/logout` | Yes | None | `null` |
| 6 | GET | `/auth/me` | Yes | None | `User` |
| 7 | GET | `/users/me` | Yes | None | `User` |
| 8 | PATCH | `/users/me` | Yes | `UpdateUserRequest` | `User` |
| 9 | GET | `/children` | Yes | None | `Child[]` |
| 10 | POST | `/children` | Yes | `CreateChildRequest` | `Child` |
| 11 | PATCH | `/children/:id` | Yes | `UpdateChildRequest` | `Child` |
| 12 | DELETE | `/children/:id` | Yes | None | `null` |
| 13 | GET | `/academies` | No | Query filters | `ListResponse<Academy>` |
| 14 | GET | `/academies/:slug` | No | Path param | `AcademyDetailResponse` |
| 15 | GET | `/coaches` | No | Query filters | `ListResponse<Coach>` |
| 16 | GET | `/coaches/:slug` | No | Path param | `Coach` |
| 17 | GET | `/favorites` | Yes | None | `ShortlistItem[]` |
| 18 | POST | `/favorites` | Yes | `AddFavoriteRequest` | `ShortlistItem` |
| 19 | DELETE | `/favorites/:itemType/:itemId` | Yes | Path params | `null` |
| 20 | GET | `/enquiries` | Yes | None | `Enquiry[]` |
| 21 | POST | `/enquiries` | No | `EnquiryCreateRequest` | `{ enquiryId, leadId, whatsappConfirmationSent }` |
| 22 | GET | `/recommendations/academies` | No | Query params | `AcademySuggestions` |
| 23 | GET | `/recommendations/coaches` | No | Query params | `CoachSuggestions` |
| 24 | POST | `/recently-viewed` | Yes | `{ id, slug, type, name }` | `null` |
| 25 | GET | `/search/suggest` | No | Query params | `SearchSuggestResponse` |

---

## 14. Frontend API Module Reference

| File | Imports | Endpoints Used |
|------|---------|----------------|
| `lib/api/auth.ts` | `User`, `ApiResponse` | `/auth/register`, `/auth/login`, `/auth/send-otp`, `/auth/verify-otp`, `/auth/logout`, `/auth/me` |
| `lib/api/users.ts` | `User`, `UserPreferences`, `ConsentFlags`, `ApiResponse` | `/users/me` (GET + PATCH) |
| `lib/api/children.ts` | `Child`, `ApiResponse` | `/children` (GET + POST), `/children/:id` (PATCH + DELETE) |
| `lib/api/academies.ts` | `Academy`, `AcademySuggestions`, `ApiResponse`, `ListResponse` | `/academies` (GET), `/academies/:slug` (GET), `/recommendations/academies` (GET) |
| `lib/api/coaches.ts` | `Coach`, `ApiResponse`, `ListResponse` | `/coaches` (GET), `/coaches/:slug` (GET) |
| `lib/api/favorites.ts` | `ShortlistItem`, `ApiResponse` | `/favorites` (GET + POST), `/favorites/:itemType/:itemId` (DELETE) |
| `lib/api/enquiries.ts` | `Enquiry`, `EnquiryCreateRequest`, `EnquiryCreateResponse`, `ApiResponse` | `/enquiries` (GET + POST) |
| `lib/api/recommendations.ts` | `AcademySuggestions`, `CoachSuggestions`, `ApiResponse` | `/recommendations/academies`, `/recommendations/coaches` |

---

## 15. Implementation Notes

### 15.1 Token Expiry

- JWT access tokens: 15-minute expiry
- Refresh tokens: 7-day expiry (stored in `sessions` table)
- The frontend does NOT currently implement token refresh — this must be added in `lib/api/client.ts`

### 15.2 Pagination Consistency

All list endpoints must return the same `{ items, pagination }` structure inside `data`:

```json
{
  "ok": true,
  "data": {
    "items": [...],
    "pagination": { "page": 1, "pageSize": 20, "total": 150, "hasMore": true }
  }
}
```

### 15.3 Soft Deletes

For `DELETE /children/:id` and `DELETE /favorites/...`, use hard deletes. No soft-delete requirement for MVP.

### 15.4 Audit Fields

- All entities: `created_at`, `updated_at` (ISO 8601, managed by DB triggers or application layer)
- Enquiries: `delivery_attempts`, `last_delivery_at`, `failure_reason` for delivery tracking
- Sessions: `created_at`, `expires_at`, `revoked_at` for session lifecycle

### 15.5 Search Indexing

The frontend previously used client-side filtering. For `GET /academies`, `GET /coaches`, and `GET /search/suggest`, implement:

- **Full-text search** using PostgreSQL `tsvector` or dedicated search (Meilisearch/Elasticsearch)
- **Fuzzy matching** for sport names, academy names, coach names
- **City/state autocomplete** from indexed location data
- **Geo-spatial queries** for proximity-based sorting (PostGIS or coords with Haversine in SQL)
