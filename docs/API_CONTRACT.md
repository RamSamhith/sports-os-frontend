# SportsOS API Contract

**Base URL:** `https://api.sportsos.example.com/v1`

---

## Standard Response Format

### Success
```json
{
  "ok": true,
  "data": { ... }
}
```

### Error
```json
{
  "ok": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "...",
    "details": { ... }
  }
}
```

### Paginated Response
```json
{
  "items": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 500,
    "hasMore": true
  }
}
```

---

## Entity Types

### User
| Field | Type | Required |
|-------|------|----------|
| `id` | `string` | ✓ |
| `role` | `'athlete' \| 'parent' \| 'coach' \| 'academy_rep' \| 'admin'` | ✓ |
| `name` | `string` | ✓ |
| `email` | `string` | ✓ |
| `phone` | `string?` | |
| `avatar` | `string?` | |
| `authProvider` | `'credentials' \| 'google' \| 'phone'?` | |
| `lastLoginAt` | `string?` (ISO 8601) | |
| `preferences` | `UserPreferences?` | |
| `themePreference` | `string?` | |
| `consent` | `ConsentFlags?` | |
| `createdAt` | `string` (ISO 8601) | ✓ |
| `updatedAt` | `string` (ISO 8601) | ✓ |

### Child
| Field | Type | Required |
|-------|------|----------|
| `id` | `string` | ✓ |
| `parentId` | `string` | ✓ |
| `name` | `string` | ✓ |
| `age` | `number` | ✓ |
| `gender` | `'male' \| 'female' \| 'other' \| 'prefer_not_to_say'?` | |
| `sportInterests` | `string[]` | ✓ |
| `createdAt` | `string` (ISO 8601) | ✓ |
| `updatedAt` | `string` (ISO 8601) | ✓ |

### Academy
| Field | Type | Required |
|-------|------|----------|
| `id` | `string` | ✓ |
| `slug` | `string` | ✓ |
| `name` | `string` | ✓ |
| `description` | `string` | ✓ |
| `location` | `LocationSummary` | ✓ |
| `contact` | `{ phone?, email?, website? }` | ✓ |
| `sportsOffered` | `string[]` | ✓ |
| `facilities` | `Facility[]` | ✓ |
| `trainingLevels` | `TrainingLevel[]` | ✓ |
| `ageRange` | `{ min?, max? }?` | |
| `batchInformation` | `string?` | |
| `certifications` | `Certification[]` | ✓ |
| `verificationStatus` | `'unverified' \| 'pending' \| 'verified' \| 'rejected'` | ✓ |
| `verificationEvidence` | `VerificationEvidence[]?` | |
| `achievementSignals` | `AchievementSignals` | ✓ |
| `rating` | `{ average: number, count: number }` | ✓ |
| `coverImage` | `string?` | |
| `gallery` | `string[]` | ✓ |
| `status` | `'draft' \| 'published' \| 'suspended'` | ✓ |
| `lastUpdatedAt` | `string` (ISO 8601) | ✓ |
| `createdAt` | `string` (ISO 8601) | ✓ |
| `indexedAt` | `string?` (ISO 8601) | |

#### LocationSummary
| Field | Type | Required |
|-------|------|----------|
| `city` | `string` | ✓ |
| `state` | `string` | ✓ |
| `country` | `string` | ✓ |
| `lat` | `number` | ✓ |
| `lng` | `number` | ✓ |
| `address` | `string?` | |
| `district` | `string?` | |
| `pincode` | `string?` | |
| `geohash` | `string?` | |

### Coach
| Field | Type | Required |
|-------|------|----------|
| `id` | `string` | ✓ |
| `slug` | `string` | ✓ |
| `name` | `string` | ✓ |
| `avatar` | `string?` | |
| `certifications` | `Certification[]` | ✓ |
| `experienceYears` | `number` | ✓ |
| `sportsCoached` | `string[]` | ✓ |
| `specialization` | `string[]` | ✓ |
| `academyId` | `string?` | |
| `location` | `LocationSummary` | ✓ |
| `contact` | `{ phone?, email? }` | ✓ |
| `verificationStatus` | `'unverified' \| 'pending' \| 'verified' \| 'rejected'` | ✓ |
| `rating` | `{ average: number, count: number }` | ✓ |
| `status` | `'draft' \| 'published' \| 'suspended'` | ✓ |
| `lastUpdatedAt` | `string` (ISO 8601) | ✓ |
| `createdAt` | `string` (ISO 8601) | ✓ |

### Enquiry
| Field | Type | Required |
|-------|------|----------|
| `id` | `string` | ✓ |
| `userId` | `string?` | |
| `childId` | `string?` | |
| `targetType` | `'academy' \| 'coach'` | ✓ |
| `targetId` | `string` | ✓ |
| `intent` | `'contact' \| 'callback' \| 'trial' \| 'enrollment_interest'` | ✓ |
| `parentInfo` | `{ name, email, phone }` | ✓ |
| `childInfo` | `{ name, age }?` | |
| `sportInterest` | `string` | ✓ |
| `message` | `string?` | |
| `status` | `'submitted' \| 'delivered' \| 'failed' \| 'bounced'` | ✓ |
| `deliveryAttempts` | `number` | ✓ |
| `lastDeliveryAt` | `string?` (ISO 8601) | |
| `failureReason` | `string?` | |
| `whatsappConfirmationSent` | `boolean` | ✓ |
| `whatsappMessageId` | `string?` | |
| `leadId` | `string?` | |
| `ipHash` | `string?` | |
| `userAgentHash` | `string?` | |
| `createdAt` | `string` (ISO 8601) | ✓ |

### ShortlistItem
| Field | Type | Required |
|-------|------|----------|
| `id` | `string` | ✓ |
| `userId` | `string` | ✓ |
| `contextChildId` | `string?` | |
| `itemType` | `'academy' \| 'coach' \| 'sport'` | ✓ |
| `itemId` | `string` | ✓ |
| `createdAt` | `string` (ISO 8601) | ✓ |

---

## Enquiry Request/Response DTOs

### EnquiryCreateRequest
```json
{
  "targetType": "academy",
  "targetId": "string",
  "intent": "contact",
  "parentInfo": { "name": "string", "email": "string", "phone": "string" },
  "childInfo": { "name": "string", "age": 0 },
  "sportInterest": "string",
  "message": "string"
}
```

### EnquiryCreateResponse
```json
{
  "enquiryId": "string",
  "leadId": "string",
  "whatsappConfirmationSent": false
}
```

### SearchSuggestRequest
```json
{
  "query": "string",
  "entity": "all",
  "limit": 10
}
```

### SearchSuggestResponse
```json
{
  "suggestions": [
    { "entity": "academy", "id": "string", "slug": "string", "label": "string", "sublabel": "string" }
  ]
}
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user account.

- **Auth required:** No

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "role": "parent",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "authProvider": "credentials",
      "preferences": {},
      "consent": 0,
      "themePreference": "light",
      "createdAt": "2026-06-11T10:00:00.000Z",
      "updatedAt": "2026-06-11T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `name` | Required, 1–100 chars |
| `email` | Required, valid email format |
| `phone` | Required, valid phone number (10–15 digits) |
| `password` | Required, min 8 chars, at least 1 uppercase, 1 lowercase, 1 number |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid or missing fields |
| `EMAIL_ALREADY_EXISTS` | 409 | Email is already registered |
| `PHONE_ALREADY_EXISTS` | 409 | Phone is already registered |

**Example:**
```bash
curl -X POST https://api.sportsos.example.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "password": "securePassword123"
  }'
```

---

### POST /auth/login

Authenticate with email and password.

- **Auth required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "role": "parent",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210",
      "authProvider": "credentials",
      "lastLoginAt": "2026-06-11T10:00:00.000Z",
      "preferences": {},
      "consent": 0,
      "themePreference": "light",
      "createdAt": "2026-06-11T10:00:00.000Z",
      "updatedAt": "2026-06-11T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `email` | Required, valid email |
| `password` | Required |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid or missing fields |
| `INVALID_CREDENTIALS` | 401 | Email or password is incorrect |
| `ACCOUNT_SUSPENDED` | 403 | Account has been suspended |

**Example:**
```bash
curl -X POST https://api.sportsos.example.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

---

### POST /auth/send-otp

Send a one-time password via email, SMS, or WhatsApp.

- **Auth required:** No

**Request Body:**
```json
{
  "method": "sms",
  "destination": "+919876543210"
}
```

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

**Validation Rules:**
| Field | Rule |
|-------|------|
| `method` | Required, one of `'email' \| 'sms' \| 'whatsapp'` |
| `destination` | Required, valid email or phone depending on method |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid or missing fields |
| `RATE_LIMITED` | 429 | Cooldown period not elapsed |
| `INVALID_DESTINATION` | 400 | Destination format mismatches method |

**Example:**
```bash
curl -X POST https://api.sportsos.example.com/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "method": "sms",
    "destination": "+919876543210"
  }'
```

---

### POST /auth/verify-otp

Verify a one-time password.

- **Auth required:** No

**Request Body:**
```json
{
  "method": "sms",
  "destination": "+919876543210",
  "code": "123456"
}
```

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

**Validation Rules:**
| Field | Rule |
|-------|------|
| `method` | Required, one of `'email' \| 'sms' \| 'whatsapp'` |
| `destination` | Required |
| `code` | Required, 4–8 digit string |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid or missing fields |
| `INVALID_OTP` | 401 | Code is incorrect |
| `OTP_EXPIRED` | 410 | Code has expired |

**Example:**
```bash
curl -X POST https://api.sportsos.example.com/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "method": "sms",
    "destination": "+919876543210",
    "code": "123456"
  }'
```

---

### POST /auth/logout

Invalidate the current session token.

- **Auth required:** Yes

**Request Body:** None

**Response (200):**
```json
{
  "ok": true,
  "data": null
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |

**Example:**
```bash
curl -X POST https://api.sportsos.example.com/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

### GET /auth/me

Get the currently authenticated user.

- **Auth required:** Yes

**Request Query:** None

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "id": "usr_abc123",
    "role": "parent",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "authProvider": "credentials",
    "lastLoginAt": "2026-06-11T10:00:00.000Z",
    "preferences": {},
    "consent": 0,
    "themePreference": "light",
    "createdAt": "2026-06-11T10:00:00.000Z",
    "updatedAt": "2026-06-11T10:00:00.000Z"
  }
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `USER_NOT_FOUND` | 404 | Authenticated user no longer exists |

**Example:**
```bash
curl https://api.sportsos.example.com/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## User Endpoints

### GET /users/me

Get the current user's profile.

- **Auth required:** Yes

**Request Query:** None

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "id": "usr_abc123",
    "role": "parent",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "avatar": null,
    "authProvider": "credentials",
    "lastLoginAt": "2026-06-11T10:00:00.000Z",
    "preferences": {
      "notifications": true,
      "language": "en"
    },
    "themePreference": "light",
    "consent": 7,
    "createdAt": "2026-06-11T10:00:00.000Z",
    "updatedAt": "2026-06-11T10:00:00.000Z"
  }
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |

**Example:**
```bash
curl https://api.sportsos.example.com/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

### PATCH /users/me

Update the current user's profile.

- **Auth required:** Yes

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+919876543211",
  "preferences": {
    "notifications": false
  },
  "consent": 3
}
```

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "id": "usr_abc123",
    "role": "parent",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "+919876543211",
    "avatar": null,
    "authProvider": "credentials",
    "lastLoginAt": "2026-06-11T10:00:00.000Z",
    "preferences": { "notifications": false, "language": "en" },
    "themePreference": "light",
    "consent": 3,
    "createdAt": "2026-06-11T10:00:00.000Z",
    "updatedAt": "2026-06-11T11:00:00.000Z"
  }
}
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `name` | Optional, 1–100 chars if provided |
| `email` | Optional, valid email, not already in use |
| `phone` | Optional, valid phone, not already in use |
| `avatar` | Optional, valid URL |
| `preferences` | Optional, partial `UserPreferences` object |
| `consent` | Optional, `ConsentFlags` bitmask |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid field values |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `EMAIL_ALREADY_EXISTS` | 409 | Email taken by another user |
| `PHONE_ALREADY_EXISTS` | 409 | Phone taken by another user |

**Example:**
```bash
curl -X PATCH https://api.sportsos.example.com/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "preferences": { "notifications": false }
  }'
```

---

## Children Endpoints

### GET /children

List all children for the authenticated parent.

- **Auth required:** Yes (parent role)

**Request Query:** None

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": "chd_xyz789",
      "parentId": "usr_abc123",
      "name": "Jane Doe",
      "age": 12,
      "gender": "female",
      "sportInterests": ["swimming", "tennis"],
      "createdAt": "2026-01-15T08:00:00.000Z",
      "updatedAt": "2026-06-10T12:00:00.000Z"
    }
  ]
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | User role is not `parent` |

**Example:**
```bash
curl https://api.sportsos.example.com/v1/children \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

### POST /children

Add a new child profile.

- **Auth required:** Yes (parent role)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "age": 12,
  "gender": "female",
  "sportInterests": ["swimming", "tennis"]
}
```

**Response (201):**
```json
{
  "ok": true,
  "data": {
    "id": "chd_xyz789",
    "parentId": "usr_abc123",
    "name": "Jane Doe",
    "age": 12,
    "gender": "female",
    "sportInterests": ["swimming", "tennis"],
    "createdAt": "2026-06-11T12:00:00.000Z",
    "updatedAt": "2026-06-11T12:00:00.000Z"
  }
}
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `name` | Required, 1–100 chars |
| `age` | Required, 1–25 |
| `gender` | Optional, one of `'male' \| 'female' \| 'other' \| 'prefer_not_to_say'` |
| `sportInterests` | Optional, array of strings, each 1–50 chars |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid or missing fields |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | User role is not `parent` |

**Example:**
```bash
curl -X POST https://api.sportsos.example.com/v1/children \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "age": 12,
    "gender": "female",
    "sportInterests": ["swimming", "tennis"]
  }'
```

---

### PATCH /children/:id

Update a child profile.

- **Auth required:** Yes (parent role, must own child)

**Request Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` (path) | Child ID |

**Request Body:**
```json
{
  "name": "Jane Updated",
  "age": 13,
  "sportInterests": ["swimming", "basketball"]
}
```

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "id": "chd_xyz789",
    "parentId": "usr_abc123",
    "name": "Jane Updated",
    "age": 13,
    "gender": "female",
    "sportInterests": ["swimming", "basketball"],
    "createdAt": "2026-01-15T08:00:00.000Z",
    "updatedAt": "2026-06-11T12:30:00.000Z"
  }
}
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `name` | Optional, 1–100 chars |
| `age` | Optional, 1–25 |
| `gender` | Optional, one of valid enum values |
| `sportInterests` | Optional, array of strings |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid field values |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Not the parent of this child |
| `NOT_FOUND` | 404 | Child not found |

**Example:**
```bash
curl -X PATCH https://api.sportsos.example.com/v1/children/chd_xyz789 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "age": 13,
    "sportInterests": ["swimming", "basketball"]
  }'
```

---

### DELETE /children/:id

Remove a child profile.

- **Auth required:** Yes (parent role, must own child)

**Request Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `id` | `string` (path) | Child ID |

**Response (200):**
```json
{
  "ok": true,
  "data": null
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Not the parent of this child |
| `NOT_FOUND` | 404 | Child not found |

**Example:**
```bash
curl -X DELETE https://api.sportsos.example.com/v1/children/chd_xyz789 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Academy Endpoints

### GET /academies

Search and list academies with filtering and pagination.

- **Auth required:** No

**Request Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `sport` | `string?` | — | Filter by sport offered |
| `city` | `string?` | — | Filter by city |
| `state` | `string?` | — | Filter by state |
| `facility` | `string?` | — | Filter by facility type |
| `trainingLevel` | `string?` | — | Filter by training level |
| `verificationStatus` | `string?` | — | Filter: `verified`, `pending`, etc. |
| `minRating` | `number?` | — | Minimum average rating (0–5) |
| `page` | `number?` | `1` | Page number (1-based) |
| `limit` | `number?` | `20` | Items per page (max 100) |
| `sort` | `string?` | `"rating"` | Sort field |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "id": "acd_001",
        "slug": "sports-academy-delhi",
        "name": "Sports Academy Delhi",
        "description": "Premier sports training academy...",
        "location": {
          "city": "Delhi",
          "state": "Delhi",
          "country": "India",
          "lat": 28.6139,
          "lng": 77.2090,
          "address": "123 Sports Complex, Connaught Place",
          "district": "New Delhi",
          "pincode": "110001",
          "geohash": "ttn742"
        },
        "contact": {
          "phone": "+911234567890",
          "email": "info@sportsacademy.com",
          "website": "https://sportsacademy.com"
        },
        "sportsOffered": ["cricket", "football", "swimming"],
        "facilities": [
          { "name": "Indoor Pool", "type": "swimming_pool" },
          { "name": "Turf Field", "type": "football_field" }
        ],
        "trainingLevels": ["beginner", "intermediate", "advanced"],
        "ageRange": { "min": 5, "max": 18 },
        "batchInformation": "Morning and evening batches available",
        "certifications": [
          { "name": "ISO 9001", "issuer": "ISO", "year": 2025 }
        ],
        "verificationStatus": "verified",
        "verificationEvidence": [
          { "type": "business_license", "url": "https://...", "verifiedAt": "2026-01-01T00:00:00.000Z" }
        ],
        "achievementSignals": { "totalStudents": 500, "yearsActive": 10 },
        "rating": { "average": 4.5, "count": 120 },
        "coverImage": "https://.../cover.jpg",
        "gallery": ["https://.../img1.jpg"],
        "status": "published",
        "lastUpdatedAt": "2026-06-01T10:00:00.000Z",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "indexedAt": "2026-06-01T10:00:01.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 150,
      "hasMore": true
    }
  }
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid query parameter values |
| `INVALID_SORT` | 400 | Sort field not recognized |

**Example:**
```bash
curl "https://api.sportsos.example.com/v1/academies?sport=cricket&city=Delhi&minRating=4.0&page=1&limit=10"
```

---

### GET /academies/:slug

Get detailed academy profile with its coaches.

- **Auth required:** No

**Request Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `slug` | `string` (path) | Academy slug |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "academy": {
      "id": "acd_001",
      "slug": "sports-academy-delhi",
      "name": "Sports Academy Delhi",
      "description": "Premier sports training academy...",
      "location": {
        "city": "Delhi",
        "state": "Delhi",
        "country": "India",
        "lat": 28.6139,
        "lng": 77.2090,
        "address": "123 Sports Complex, Connaught Place",
        "district": "New Delhi",
        "pincode": "110001",
        "geohash": "ttn742"
      },
      "contact": { "phone": "+911234567890", "email": "info@sportsacademy.com", "website": "https://sportsacademy.com" },
      "sportsOffered": ["cricket", "football", "swimming"],
      "facilities": [],
      "trainingLevels": ["beginner", "intermediate", "advanced"],
      "ageRange": { "min": 5, "max": 18 },
      "batchInformation": "Morning and evening batches available",
      "certifications": [],
      "verificationStatus": "verified",
      "verificationEvidence": [],
      "achievementSignals": { "totalStudents": 500, "yearsActive": 10 },
      "rating": { "average": 4.5, "count": 120 },
      "coverImage": "https://.../cover.jpg",
      "gallery": [],
      "status": "published",
      "lastUpdatedAt": "2026-06-01T10:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "indexedAt": "2026-06-01T10:00:01.000Z"
    },
    "coaches": [
      {
        "id": "coh_001",
        "slug": "virat-coach",
        "name": "Virat Singh",
        "avatar": "https://.../avatar.jpg",
        "experienceYears": 12,
        "sportsCoached": ["cricket"],
        "specialization": ["fast bowling", "batting"],
        "verificationStatus": "verified",
        "rating": { "average": 4.8, "count": 45 }
      }
    ]
  }
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `NOT_FOUND` | 404 | Academy not found by slug |

**Example:**
```bash
curl https://api.sportsos.example.com/v1/academies/sports-academy-delhi
```

---

### GET /recommendations/academies

Get personalized academy recommendations.

- **Auth required:** No (optional auth for personalized results)

**Request Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `userId` | `string?` | User ID for personalized results |
| `childId` | `string?` | Child ID to tailor recommendations |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "suggestions": [ ... ]
  }
}
```

(Response shape mirrors `AcademySuggestions` — an array or structured set of recommended academies.)

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `NOT_FOUND` | 404 | User or child not found |

**Example:**
```bash
curl "https://api.sportsos.example.com/v1/recommendations/academies?childId=chd_xyz789"
```

---

## Coach Endpoints

### GET /coaches

Search and list coaches with filtering and pagination.

- **Auth required:** No

**Request Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `sport` | `string?` | — | Filter by sport coached |
| `city` | `string?` | — | Filter by city |
| `state` | `string?` | — | Filter by state |
| `academyId` | `string?` | — | Filter by affiliated academy |
| `minRating` | `number?` | — | Minimum average rating (0–5) |
| `page` | `number?` | `1` | Page number (1-based) |
| `limit` | `number?` | `20` | Items per page (max 100) |
| `sort` | `string?` | `"rating"` | Sort field |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "id": "coh_001",
        "slug": "virat-coach",
        "name": "Virat Singh",
        "avatar": "https://.../avatar.jpg",
        "certifications": [
          { "name": "NIS Certified", "issuer": "National Institute of Sports", "year": 2020 }
        ],
        "experienceYears": 12,
        "sportsCoached": ["cricket"],
        "specialization": ["fast bowling", "batting"],
        "academyId": "acd_001",
        "location": {
          "city": "Delhi",
          "state": "Delhi",
          "country": "India",
          "lat": 28.6139,
          "lng": 77.2090
        },
        "contact": { "phone": "+911234567891", "email": "virat@example.com" },
        "verificationStatus": "verified",
        "rating": { "average": 4.8, "count": 45 },
        "status": "published",
        "lastUpdatedAt": "2026-06-01T10:00:00.000Z",
        "createdAt": "2025-03-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 80,
      "hasMore": true
    }
  }
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid query parameter values |
| `INVALID_SORT` | 400 | Sort field not recognized |

**Example:**
```bash
curl "https://api.sportsos.example.com/v1/coaches?sport=cricket&city=Delhi&minRating=4.0&page=1&limit=10"
```

---

### GET /coaches/:slug

Get detailed coach profile.

- **Auth required:** No

**Request Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `slug` | `string` (path) | Coach slug |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "id": "coh_001",
    "slug": "virat-coach",
    "name": "Virat Singh",
    "avatar": "https://.../avatar.jpg",
    "certifications": [
      { "name": "NIS Certified", "issuer": "National Institute of Sports", "year": 2020 }
    ],
    "experienceYears": 12,
    "sportsCoached": ["cricket"],
    "specialization": ["fast bowling", "batting"],
    "academyId": "acd_001",
    "location": {
      "city": "Delhi",
      "state": "Delhi",
      "country": "India",
      "lat": 28.6139,
      "lng": 77.2090,
      "address": "456 Coach Lane",
      "district": "New Delhi",
      "pincode": "110001"
    },
    "contact": { "phone": "+911234567891", "email": "virat@example.com" },
    "verificationStatus": "verified",
    "rating": { "average": 4.8, "count": 45 },
    "status": "published",
    "lastUpdatedAt": "2026-06-01T10:00:00.000Z",
    "createdAt": "2025-03-01T00:00:00.000Z"
  }
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `NOT_FOUND` | 404 | Coach not found by slug |

**Example:**
```bash
curl https://api.sportsos.example.com/v1/coaches/virat-coach
```

---

### GET /recommendations/coaches

Get personalized coach recommendations.

- **Auth required:** No (optional auth for personalized results)

**Request Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `userId` | `string?` | User ID for personalized results |
| `childId` | `string?` | Child ID to tailor recommendations |
| `sport` | `string?` | Sport filter |
| `city` | `string?` | City filter |
| `skillLevel` | `string?` | Desired skill level |
| `age` | `number?` | Athlete age |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "suggestions": [ ... ]
  }
}
```

(Response shape mirrors `CoachSuggestions` — an array or structured set of recommended coaches.)

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `NOT_FOUND` | 404 | User or child not found |

**Example:**
```bash
curl "https://api.sportsos.example.com/v1/recommendations/coaches?sport=cricket&city=Delhi&skillLevel=beginner&age=12"
```

---

## Favorites / Shortlist Endpoints

### GET /favorites

List all shortlisted items for the authenticated user.

- **Auth required:** Yes

**Request Query:** None

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

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |

**Example:**
```bash
curl https://api.sportsos.example.com/v1/favorites \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

### POST /favorites

Add an item to the user's shortlist.

- **Auth required:** Yes

**Request Body:**
```json
{
  "itemType": "academy",
  "itemId": "acd_001",
  "contextChildId": "chd_xyz789"
}
```

**Response (201):**
```json
{
  "ok": true,
  "data": {
    "id": "fav_001",
    "userId": "usr_abc123",
    "contextChildId": "chd_xyz789",
    "itemType": "academy",
    "itemId": "acd_001",
    "createdAt": "2026-06-11T13:00:00.000Z"
  }
}
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `itemType` | Required, one of `'academy' \| 'coach' \| 'sport'` |
| `itemId` | Required, non-empty string |
| `contextChildId` | Optional, must reference an existing child owned by user |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid or missing fields |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `ALREADY_EXISTS` | 409 | Item already in shortlist |
| `NOT_FOUND` | 404 | Referenced entity or child not found |

**Example:**
```bash
curl -X POST https://api.sportsos.example.com/v1/favorites \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "itemType": "academy",
    "itemId": "acd_001",
    "contextChildId": "chd_xyz789"
  }'
```

---

### DELETE /favorites/:itemType/:itemId

Remove an item from the user's shortlist.

- **Auth required:** Yes

**Request Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `itemType` | `string` (path) | One of `'academy' \| 'coach' \| 'sport'` |
| `itemId` | `string` (path) | ID of the favorited entity |

**Response (200):**
```json
{
  "ok": true,
  "data": null
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid itemType |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `NOT_FOUND` | 404 | Favorite entry not found |

**Example:**
```bash
curl -X DELETE https://api.sportsos.example.com/v1/favorites/academy/acd_001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## Enquiry Endpoints

### GET /enquiries

List all enquiries made by the authenticated user.

- **Auth required:** Yes

**Request Query:** None

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": "enq_001",
      "userId": "usr_abc123",
      "childId": "chd_xyz789",
      "targetType": "academy",
      "targetId": "acd_001",
      "intent": "trial",
      "parentInfo": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+919876543210"
      },
      "childInfo": {
        "name": "Jane Doe",
        "age": 12
      },
      "sportInterest": "swimming",
      "message": "Interested in weekend trial sessions",
      "status": "delivered",
      "deliveryAttempts": 1,
      "lastDeliveryAt": "2026-06-11T14:00:00.000Z",
      "failureReason": null,
      "whatsappConfirmationSent": true,
      "whatsappMessageId": "wamid_abc123",
      "leadId": "lead_001",
      "ipHash": "a1b2c3...",
      "userAgentHash": "d4e5f6...",
      "createdAt": "2026-06-11T14:00:00.000Z"
    }
  ]
}
```

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |

**Example:**
```bash
curl https://api.sportsos.example.com/v1/enquiries \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

### POST /enquiries

Submit a new enquiry.

- **Auth required:** No (enquiries can be made without login)

**Request Body:**
```json
{
  "targetType": "academy",
  "targetId": "acd_001",
  "intent": "trial",
  "parentInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210"
  },
  "childInfo": {
    "name": "Jane Doe",
    "age": 12
  },
  "sportInterest": "swimming",
  "message": "Interested in weekend trial sessions"
}
```

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

**Validation Rules:**
| Field | Rule |
|-------|------|
| `targetType` | Required, `'academy' \| 'coach'` |
| `targetId` | Required, must reference an existing entity |
| `intent` | Required, `'contact' \| 'callback' \| 'trial' \| 'enrollment_interest'` |
| `parentInfo.name` | Required, 1–100 chars |
| `parentInfo.email` | Required, valid email |
| `parentInfo.phone` | Required, valid phone |
| `childInfo.name` | Optional, required if `childInfo` present |
| `childInfo.age` | Optional, 1–25 |
| `sportInterest` | Required, 1–100 chars |
| `message` | Optional, max 2000 chars |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid or missing fields |
| `NOT_FOUND` | 404 | Target entity not found |
| `RATE_LIMITED` | 429 | Too many enquiries from this IP |

**Example:**
```bash
curl -X POST https://api.sportsos.example.com/v1/enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "targetType": "academy",
    "targetId": "acd_001",
    "intent": "trial",
    "parentInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+919876543210"
    },
    "childInfo": {
      "name": "Jane Doe",
      "age": 12
    },
    "sportInterest": "swimming",
    "message": "Interested in weekend trial sessions"
  }'
```

---

## Recently Viewed Endpoints

### POST /recently-viewed

Record a recently viewed item.

- **Auth required:** Yes

**Request Body:**
```json
{
  "id": "acd_001",
  "slug": "sports-academy-delhi",
  "type": "academy",
  "name": "Sports Academy Delhi"
}
```

**Response (200):**
```json
{
  "ok": true,
  "data": null
}
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `id` | Required, non-empty |
| `slug` | Required, non-empty |
| `type` | Required |
| `name` | Required, non-empty |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid or missing fields |
| `UNAUTHORIZED` | 401 | Missing or invalid token |

**Example:**
```bash
curl -X POST https://api.sportsos.example.com/v1/recently-viewed \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "id": "acd_001",
    "slug": "sports-academy-delhi",
    "type": "academy",
    "name": "Sports Academy Delhi"
  }'
```

---

## Sports Endpoints

### GET /sports

List all sports with optional filtering.

- **Auth required:** No

**Request Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | `string?` | — | Filter by category |
| `status` | `string?` | `"published"` | Filter by status |
| `page` | `number?` | `1` | Page number (1-based) |
| `limit` | `number?` | `20` | Items per page (1–50) |

**Response (200):**
```json
{
  "ok": true,
  "data": [
    {
      "id": "sport_cricket",
      "slug": "cricket",
      "name": "Cricket",
      "description": "A bat-and-ball game played between two teams...",
      "icon": "/images/sports/cricket.svg",
      "coverImage": "/images/sports/cricket-cover.jpg",
      "category": "team",
      "competitionPathway": {
        "levels": [
          { "key": "district", "label": "District Level", "description": "Local tournaments" },
          { "key": "state", "label": "State Level" },
          { "key": "national", "label": "National Level" },
          { "key": "international", "label": "International Level" }
        ]
      },
      "explorationGuidance": {
        "ageSuitability": { "min": 5, "max": 40 },
        "physicalRequirements": ["hand-eye coordination", "running", "throwing"],
        "notes": "Low barrier to entry"
      },
      "status": "published"
    }
  ]
}
```

**Error Codes:** `VALIDATION_ERROR` (400)

**Example:**
```bash
curl "https://api.sportsos.example.com/v1/sports?category=team&limit=10"
```

---

### GET /sports/:slug

Get a single sport with full details.

- **Auth required:** No

**Request Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `slug` | `string` (path) | Sport slug |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "id": "sport_cricket",
    "slug": "cricket",
    "name": "Cricket",
    "description": "A bat-and-ball game played between two teams...",
    "icon": "/images/sports/cricket.svg",
    "coverImage": "/images/sports/cricket-cover.jpg",
    "category": "team",
    "competitionPathway": {
      "levels": [
        { "key": "district", "label": "District Level" },
        { "key": "state", "label": "State Level" },
        { "key": "national", "label": "National Level" },
        { "key": "international", "label": "International Level" }
      ]
    },
    "explorationGuidance": null,
    "status": "published"
  }
}
```

**Error Codes:** `NOT_FOUND` (404)

**Example:**
```bash
curl https://api.sportsos.example.com/v1/sports/cricket
```

---

## Search Endpoints

### GET /search/suggest

Get search suggestions.

- **Auth required:** No

**Request Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `query` | `string` | — | Search query text (required) |
| `entity` | `string?` | `"all"` | Scope: `'academy' \| 'coach' \| 'sport' \| 'all'` |
| `limit` | `number?` | `10` | Max suggestions (1–50) |

**Response (200):**
```json
{
  "ok": true,
  "data": {
    "suggestions": [
      {
        "entity": "academy",
        "id": "acd_001",
        "slug": "sports-academy-delhi",
        "label": "Sports Academy Delhi",
        "sublabel": "Delhi, India"
      },
      {
        "entity": "coach",
        "id": "coh_001",
        "slug": "virat-coach",
        "label": "Virat Singh",
        "sublabel": "Cricket Coach · Delhi"
      },
      {
        "entity": "sport",
        "id": "sport_cricket",
        "slug": null,
        "label": "Cricket",
        "sublabel": null
      }
    ]
  }
}
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `query` | Required, min 2 chars |
| `entity` | Optional, one of `'academy' \| 'coach' \| 'sport' \| 'all'` |
| `limit` | Optional, 1–50 |

**Error Codes:**
| Code | HTTP | Reason |
|------|------|--------|
| `VALIDATION_ERROR` | 400 | Invalid query parameters |

**Example:**
```bash
curl "https://api.sportsos.example.com/v1/search/suggest?query=cric&entity=all&limit=5"
```

---

## Common Error Codes

| HTTP | Code | Description |
|------|------|-------------|
| 400 | `VALIDATION_ERROR` | Request body or query parameters failed validation |
| 401 | `UNAUTHORIZED` | Missing, expired, or invalid authentication token |
| 403 | `FORBIDDEN` | Authenticated user lacks permission for this action |
| 404 | `NOT_FOUND` | Requested resource does not exist |
| 409 | `ALREADY_EXISTS` | Resource conflict (e.g., duplicate) |
| 410 | `OTP_EXPIRED` | One-time password has expired |
| 429 | `RATE_LIMITED` | Too many requests; respect `Retry-After` header |
| 500 | `INTERNAL_ERROR` | Unexpected server error |

---

## Authentication

All endpoints marked **Auth required: Yes** expect a Bearer token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Tokens are returned by `POST /auth/register`, `POST /auth/login`, and `POST /auth/verify-otp`.

---

## Pagination

Endpoints returning lists support pagination via `page` and `limit` query parameters. Paginated responses use the following structure:

```json
{
  "items": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 500,
    "hasMore": true
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `page` | `number` | Current page (1-based) |
| `pageSize` | `number` | Items per page |
| `total` | `number` | Total number of items matching query |
| `hasMore` | `boolean` | Whether additional pages exist |

Default `pageSize` is 20. Maximum `pageSize` is 100.
