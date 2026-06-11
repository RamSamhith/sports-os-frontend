# SportsOS — Backend Handoff Document

## Overview

This document maps every client-side storage key, hook, and data source to its corresponding backend table and API endpoint. The frontend currently uses localStorage + mock data; the backend must provide equivalent persistence.

---

## 1. localStorage → Database Mapping

### 1.1 `sportsos:auth-state` → `users` table

**Current shape:**
```json
{
  "isAuthenticated": false,
  "role": "parent",
  "onboardingCompleted": false,
  "verified": false
}
```

| Field | Backend Location | Notes |
|-------|-----------------|-------|
| `isAuthenticated` | Implicit — presence of valid JWT | Frontend derives this from token existence |
| `role` | `users.role` | Set during registration, updated rarely |
| `onboardingCompleted` | `users.onboarding_completed` | Boolean flag, toggled after wizard |
| `verified` | `users.verified` or `users.email_verified_at` | Set after OTP verification |

**Endpoints:** `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PATCH /users/me`

---

### 1.2 `sportsos:profile` → `users` table

**Current shape:**
```json
{ "name": "John Doe", "email": "john@example.com", "phone": "+919876543210" }
```

| Field | Backend Column | Notes |
|-------|----------------|-------|
| `name` | `users.name` | |
| `email` | `users.email` | Unique, validated |
| `phone` | `users.phone` | Unique, validated |

**Endpoints:** `GET /auth/me`, `POST /auth/register`, `PATCH /users/me`

---

### 1.3 `sportsos:children` + `sportsos:active-child` → `children` table

**Current shape (children):**
```json
[
  {
    "id": "chd_xyz789",
    "name": "Jane Doe",
    "age": 12,
    "sport": "swimming",
    "skillLevel": "beginner",
    "createdAt": "2026-01-15T08:00:00.000Z"
  }
]
```

**current shape (active-child):**
```json
"chd_xyz789"
```

| Field | Backend Column |
|-------|----------------|
| `id` | `children.id` |
| `parentId` | `children.parent_id` → `users.id` |
| `name` | `children.name` |
| `age` | `children.age` |
| `gender` | `children.gender` |
| `sportInterests` | `children.sport_interests` (jsonb array) |
| `createdAt` / `updatedAt` | `children.created_at`, `children.updated_at` |

**Note:** The frontend uses `sport` as a single string and `skillLevel`. The API contract uses `sportInterests` (array) and `gender`. The backend should use the API contract shape; the `use-children` hook will need updating to match.

**Active child** (`sportsos:active-child`) should be stored as `user_preferences.active_child_id` or derived from the most recently viewed child. It is a session-level preference, not a transactional entity.

**Endpoints:** `GET /children`, `POST /children`, `PATCH /children/:id`, `DELETE /children/:id`

---

### 1.4 `sportsos:compare` → `user_preferences` table or ephemeral session

**Current shape:** Versioned envelope with `PersistedItem[]`:
```json
{
  "version": "abc123",
  "items": [
    { "entityType": "academy", "id": "acd_001", "label": "...", "sublabel": "...", "href": "...", "addedAt": "..." }
  ]
}
```

**Recommendation:** Compare is ephemeral — store in `user_preferences` as a JSONB field, or leave as client-only state. If persisted:
```sql
CREATE TABLE user_preferences (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  compare_items JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ
);
```

**Endpoints:** No dedicated endpoints needed unless compare data must sync across devices.

---

### 1.5 `sportsos:shortlist` → `favorites` table

**Current shape:** Versioned envelope:
```json
{
  "version": "abc123",
  "items": [
    { "itemType": "academy", "itemId": "acd_001", "label": "...", "addedAt": "..." }
  ]
}
```

**Proposed table:**
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  context_child_id UUID REFERENCES children(id),
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('academy', 'coach', 'sport')),
  item_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);
```

**Endpoints:** `GET /favorites`, `POST /favorites`, `DELETE /favorites/:itemType/:itemId`

---

### 1.6 `sportsos:onboarding` → `users` table + `children` table

**Current shape:**
```json
{
  "completed": true,
  "data": {
    "athlete": {
      "age": 16, "gender": "male", "location": "Bengaluru",
      "sportInterests": ["cricket", "football"],
      "skillLevel": "intermediate", "goals": "Join competitive team"
    },
    "parent": {
      "childName": "Jane", "childAge": 12, "location": "Bengaluru",
      "sportInterests": ["swimming"], "skillLevel": "beginner"
    }
  }
}
```

**Backend mapping:**

| Data | Destination | Notes |
|------|-------------|-------|
| `completed` | `users.onboarding_completed` | Boolean flag on users table |
| `role` (athlete/parent) | `users.role` | Set during onboarding role selection |
| `athlete.age` | `users.age` or denormalized | |
| `athlete.sportInterests` | `users.preferences->>'sportInterests'` (JSONB) | |
| `athlete.skillLevel` | `users.preferences->>'skillLevel'` | |
| `athlete.goals` | `users.preferences->>'goals'` | |
| `athlete.gender` | `users.gender` | |
| `athlete.location` | `users.preferences->>'location'` | |
| `parent.childName`, `parent.childAge` | `children` table | If parent role, create initial child record |

**Endpoints:** `POST /auth/register` (first step), then `PATCH /users/me` (onboarding data), `POST /children` (if parent creates child during onboarding)

---

### 1.7 `sportsos:recently-viewed` → `recently_viewed` table

**Current shape:**
```json
[
  { "id": "acd_001", "slug": "sports-academy-delhi", "type": "academy", "name": "...", "viewedAt": "..." }
]
```

**Proposed table:**
```sql
CREATE TABLE recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('academy', 'coach')),
  entity_id VARCHAR(100) NOT NULL,
  entity_slug VARCHAR(200) NOT NULL,
  entity_name VARCHAR(300) NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recently_viewed_user ON recently_viewed(user_id, viewed_at DESC);
```

- Keep last 10-20 items per user; clean up on insert.
- Or: maintain a capped JSONB array on `user_preferences`.

**Endpoint:** `POST /recently-viewed`, `GET /recently-viewed` (not yet in client but should be added)

---

### 1.8 `sportsos:location` + `sportsos:location-radius` → `user_preferences`

**Current shapes:**
```json
// sportsos:location
{ "city": "Bengaluru", "state": "Karnataka", "country": "IN", "lat": 12.97, "lng": 77.59 }

// sportsos:location-radius
"10"
```

**Recommendation:** Store as JSONB in `user_preferences`:
```json
{
  "location": { "city": "Bengaluru", "state": "Karnataka", "country": "IN", "lat": 12.97, "lng": 77.59 },
  "defaultRadiusKm": 10
}
```

**Endpoint:** `PATCH /users/me` → update `users.preferences`

---

### 1.9 `sportsos:academy-status` → `user_academy_status` table

**Current shape:**
```json
{
  "acd_001": { "status": "interested", "updatedAt": "..." },
  "acd_002": { "status": "shortlisted", "updatedAt": "..." }
}
```

**Proposed table:**
```sql
CREATE TABLE user_academy_status (
  user_id UUID NOT NULL REFERENCES users(id),
  academy_id VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('interested', 'shortlisted', 'selected')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, academy_id)
);
```

**Endpoints needed:** `GET /user/academy-status`, `PUT /user/academy-status/:academyId`, `DELETE /user/academy-status/:academyId`

---

### 1.10 `sportsos:selected-academy` → `user_preferences`

**Current shape:**
```json
{ "selectedAcademyId": "acd_001", "selectedAt": "2026-06-11T10:00:00.000Z" }
```

**Recommendation:** Store as part of `user_preferences` JSONB:
```json
{ "selectedAcademyId": "acd_001", "selectedAt": "2026-06-11T10:00:00.000Z" }
```

**Endpoint:** `PATCH /users/me` → update `users.preferences`

---

### 1.11 `sportsos:settings`, `sportsos:preferences`, `sportsos:notifications`, `sportsos:privacy`, `sportsos:motion` → `users` table

All of these are preference/settings objects that should be merged into a single `users.preferences` JSONB column or a `user_settings` table:

| localStorage Key | Backend Location |
|-----------------|-----------------|
| `sportsos:settings` | `users.preferences->'settings'` |
| `sportsos:preferences` | `users.preferences->'searchPreferences'` |
| `sportsos:notifications` | `users.preferences->'notifications'` |
| `sportsos:privacy` | `users.preferences->'privacy'` |
| `sportsos:motion` | `users.preferences->'motion'` |

**Endpoint:** `PATCH /users/me`

---

### 1.12 `sportsos-consent` → `users.consent` or `user_consent` table

**Current shape:**
```json
{ "analytics": true, "marketing": false, "whatsapp": true }
```

**Recommendation:** Store in `users.consent` as JSONB column, or use a separate `user_consent_log` table for audit trail.

**Endpoint:** `PATCH /users/me` with consent field.

---

### 1.13 `sportsos-theme` → `users.theme_preference`

**Current shape:** `"midnight-ice"` | `"ember-orange"` | `"graphite-titanium"` | `"alpine-light"` | `"system"`

**Endpoint:** `PATCH /users/me`

---

### 1.14 `sportsos:recent-searches` → `user_search_history` table

**Current shape:**
```json
[{"query": "cricket", "at": 1718111111111}]
```

Keep max 6 entries per user. This is a convenience feature; can also stay client-only.

---

### 1.15 `sportsos:build-version` — Client-only

Not a backend concern. Used for version staleness checks (auto-refresh on deployment).

---

### 1.16 Enquiries → `enquiries` table + `leads` table

Currently stored **nowhere** (in-memory toast only). Must be fully backed.

**Proposed tables:**
```sql
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  child_id UUID REFERENCES children(id),
  target_type VARCHAR(20) NOT NULL,
  target_id VARCHAR(100) NOT NULL,
  intent VARCHAR(30) NOT NULL,
  parent_info JSONB NOT NULL,  -- {name, email, phone}
  child_info JSONB,            -- {name, age}
  sport_interest VARCHAR(100) NOT NULL,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted',
  delivery_attempts INT NOT NULL DEFAULT 0,
  last_delivery_at TIMESTAMPTZ,
  failure_reason TEXT,
  whatsapp_confirmation_sent BOOLEAN NOT NULL DEFAULT false,
  whatsapp_message_id VARCHAR(100),
  lead_id UUID REFERENCES leads(id),
  ip_hash VARCHAR(64),
  user_agent_hash VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID REFERENCES enquiries(id),
  target_type VARCHAR(20) NOT NULL,
  parent_info JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES users(id), 
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Endpoints:** `POST /enquiries`, `GET /enquiries`, `GET /admin/enquiries` (admin)

---

## 2. sessionStorage Keys — Do NOT Persist to Backend

These are ephemeral UI-state keys that should remain client-only:

| Key | Purpose | Why Not Backend |
|-----|---------|-----------------|
| `sportsos:signup-draft` | Registration form draft preservation | Only needed during registration flow (tab lifetime) |
| `sportsos:otp-method` | Selected OTP channel (email/sms/whatsapp) | Transient — OTP flow completes in minutes |
| `sportsos:otp-destination` | Email/phone for OTP delivery | Transient — only needed for verify step |
| `sportsos:editing-contact` | Flag: "Edit" back-navigation from OTP verify | Session-only UX state |
| `sportsos:auth-modal-dismissed` | Prevents auth modal re-appearance | Session-only UX state |
| `sportsos:event-queue` | Analytics event buffer | Client-side queue, flushed to analytics endpoint |

---

## 3. Entity Relationship Summary

```
users (1) ──────< children (N)           # Parent owns children
users (1) ──────< favorites (N)          # User saves shortlist items
users (1) ──────< enquiries (N)          # User submits enquiries
users (1) ──────< recently_viewed (N)    # User views academies/coaches
users (1) ──────< sessions (N)           # User auth sessions
users (1) ──────< user_academy_status (N) # User's academy interactions
users (1) ──────  user_preferences (1)   # Single-row preferences JSONB

academies (1) ──< coaches (N)            # Coaches belong to academies
academies (1) ──< enquiries (N)          # Academies receive enquiries
academies (1) ──< academy_verification (N) # Verification documents

sports (N) ────< academies (N)           # M2M via sports_offered
sports (N) ────< coaches (N)             # M2M via sports_coached
```

---

## 4. Suggested Tables DDL Summary

```sql
-- Core
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(20) NOT NULL CHECK (role IN ('athlete','parent','coach','academy_rep','admin')),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  auth_provider VARCHAR(20) DEFAULT 'credentials',
  onboarding_completed BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  theme_preference VARCHAR(30) DEFAULT 'midnight-ice',
  preferences JSONB DEFAULT '{}'::jsonb,
  consent JSONB DEFAULT '{}'::jsonb,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  refresh_token_hash VARCHAR(255) NOT NULL,
  device_info TEXT,
  ip_hash VARCHAR(64),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL CHECK (age >= 0 AND age <= 25),
  gender VARCHAR(20),
  sport_interests JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  context_child_id UUID REFERENCES children(id),
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('academy','coach','sport')),
  item_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

CREATE TABLE recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('academy','coach')),
  entity_id VARCHAR(100) NOT NULL,
  entity_slug VARCHAR(200) NOT NULL,
  entity_name VARCHAR(300) NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_academy_status (
  user_id UUID NOT NULL REFERENCES users(id),
  academy_id VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('interested','shortlisted','selected')),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, academy_id)
);

CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  child_id UUID REFERENCES children(id),
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('academy','coach')),
  target_id VARCHAR(100) NOT NULL,
  intent VARCHAR(30) NOT NULL CHECK (intent IN ('contact','callback','trial','enrollment_interest')),
  parent_info JSONB NOT NULL,
  child_info JSONB,
  sport_interest VARCHAR(100) NOT NULL,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted',
  delivery_attempts INT DEFAULT 0,
  last_delivery_at TIMESTAMPTZ,
  failure_reason TEXT,
  whatsapp_confirmation_sent BOOLEAN DEFAULT false,
  whatsapp_message_id VARCHAR(100),
  lead_id UUID,
  ip_hash VARCHAR(64),
  user_agent_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content tables
CREATE TABLE academies (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  location JSONB NOT NULL,
  contact JSONB,
  sports_offered JSONB NOT NULL DEFAULT '[]'::jsonb,
  facilities JSONB DEFAULT '[]'::jsonb,
  training_levels JSONB DEFAULT '[]'::jsonb,
  age_range JSONB,
  certifications JSONB DEFAULT '[]'::jsonb,
  verification_status VARCHAR(20) DEFAULT 'unverified',
  verification_evidence JSONB DEFAULT '[]'::jsonb,
  achievement_signals JSONB DEFAULT '{}'::jsonb,
  rating JSONB DEFAULT '{"average": 0, "count": 0}',
  cover_image TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE coaches (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(300) NOT NULL,
  avatar_url TEXT,
  certifications JSONB DEFAULT '[]'::jsonb,
  experience_years INT DEFAULT 0,
  sports_coached JSONB DEFAULT '[]'::jsonb,
  specialization JSONB DEFAULT '[]'::jsonb,
  academy_id VARCHAR(100) REFERENCES academies(id),
  location JSONB NOT NULL,
  contact JSONB,
  verification_status VARCHAR(20) DEFAULT 'unverified',
  rating JSONB DEFAULT '{"average": 0, "count": 0}',
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sports (
  id VARCHAR(100) PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(30),
  status VARCHAR(20) DEFAULT 'published'
);
```

---

## 5. API Endpoint List (25 Endpoints)

| # | Method | Path | Auth | Purpose |
|---|--------|------|------|---------|
| 1 | POST | `/auth/register` | No | Register new user |
| 2 | POST | `/auth/login` | No | Login with email + password |
| 3 | POST | `/auth/send-otp` | No | Send OTP (email/sms/whatsapp) |
| 4 | POST | `/auth/verify-otp` | No | Verify OTP code |
| 5 | POST | `/auth/logout` | Yes | Invalidate session |
| 6 | GET | `/auth/me` | Yes | Get current user |
| 7 | GET | `/users/me` | Yes | Get user profile |
| 8 | PATCH | `/users/me` | Yes | Update user profile |
| 9 | GET | `/children` | Yes | List children |
| 10 | POST | `/children` | Yes | Create child |
| 11 | PATCH | `/children/:id` | Yes | Update child |
| 12 | DELETE | `/children/:id` | Yes | Delete child |
| 13 | GET | `/academies` | No | List/search academies |
| 14 | GET | `/academies/:slug` | No | Get academy detail |
| 15 | GET | `/coaches` | No | List/search coaches |
| 16 | GET | `/coaches/:slug` | No | Get coach detail |
| 17 | GET | `/favorites` | Yes | List shortlist items |
| 18 | POST | `/favorites` | Yes | Add to shortlist |
| 19 | DELETE | `/favorites/:itemType/:itemId` | Yes | Remove from shortlist |
| 20 | GET | `/enquiries` | Yes | List user enquiries |
| 21 | POST | `/enquiries` | No | Submit enquiry |
| 22 | GET | `/recommendations/academies` | No | Academy recommendations |
| 23 | GET | `/recommendations/coaches` | No | Coach recommendations |
| 24 | POST | `/recently-viewed` | Yes | Record view |
| 25 | GET | `/search/suggest` | No | Search suggestions |

---

## 6. Implementation Priority

| Priority | Module | Reason |
|----------|--------|--------|
| P0 | Auth (1-6) | Required for any authenticated flow |
| P0 | Academies (13-14) | Core content — homepage, search depend on it |
| P0 | Coaches (15-16) | Second content pillar |
| P1 | Children (9-12) | Required for parent onboarding/wizard |
| P1 | Enquiries (20-21) | Primary conversion action |
| P1 | Favorites (17-19) | Shortlist feature |
| P2 | Recommendations (22-23) | Personalization |
| P2 | Search (25) | UX improvement |
| P2 | Recently Viewed (24) | UX improvement |
| P3 | User preferences (7-8 extended) | Settings, consent, theme sync |
