# Database Team Handoff

## Overview

This document details the complete database schema, migration strategy, and operational requirements for the SportsOS platform. The schema is derived from frontend domain models in `types/domain/*.ts`, mock datasets in `data/*.ts`, and the integration API layer at `lib/api/*.ts`.

## Schema Summary

**22 tables** across 7 domains:

| Domain | Tables |
|--------|--------|
| Users & Auth | `users`, `children`, `user_settings`, `sessions`, `otp_codes` |
| Academies | `academies`, `academy_certifications`, `academy_achievement_signals` |
| Coaches | `coaches`, `coach_certifications` |
| Sports | `sports`, `competitions` |
| Enquiries & Leads | `enquiries`, `leads` |
| Favorites | `favorites`, `recently_viewed` |
| Admin | `admin_audit_log`, `verification_queue`, `content_moderation` |

## Full DDL

### 1. Users & Auth

```sql
CREATE TYPE user_role AS ENUM ('athlete', 'parent', 'coach', 'academy_rep', 'admin');
CREATE TYPE auth_provider AS ENUM ('credentials', 'google', 'phone');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  phone_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  avatar TEXT,
  auth_provider auth_provider DEFAULT 'credentials',
  password_hash VARCHAR(255),
  theme_preference VARCHAR(50) DEFAULT 'midnight-ice',
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_role user_role,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE TYPE otp_method AS ENUM ('email', 'sms', 'whatsapp');

CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  method otp_method NOT NULL,
  destination VARCHAR(255) NOT NULL,
  code_hash VARCHAR(255) NOT NULL,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_otp_destination ON otp_codes(destination);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255),
  device_info TEXT,
  ip_hash VARCHAR(64),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

### 2. Children

```sql
CREATE TYPE child_gender AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 3 AND age <= 18),
  gender child_gender,
  sport_interests TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_children_parent ON children(parent_id);
```

### 3. Academies

```sql
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE academy_status AS ENUM ('draft', 'published', 'suspended');

CREATE TABLE academies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location_city VARCHAR(255) NOT NULL,
  location_state VARCHAR(255) NOT NULL,
  location_country VARCHAR(255) DEFAULT 'India',
  location_address TEXT,
  location_district VARCHAR(255),
  location_lat DOUBLE PRECISION NOT NULL,
  location_lng DOUBLE PRECISION NOT NULL,
  location_pincode VARCHAR(20),
  location_geohash VARCHAR(20),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  contact_website TEXT,
  sports_offered TEXT[],
  facilities TEXT[],
  training_levels TEXT[],
  age_range_min INTEGER,
  age_range_max INTEGER,
  batch_information TEXT,
  verification_status verification_status DEFAULT 'unverified',
  status academy_status DEFAULT 'published',
  rating_average DOUBLE PRECISION DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  cover_image TEXT,
  gallery TEXT[],
  last_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  indexed_at TIMESTAMPTZ
);

CREATE INDEX idx_academies_slug ON academies(slug);
CREATE INDEX idx_academies_city ON academies(location_city);
CREATE INDEX idx_academies_sport ON academies USING GIN(sports_offered);
CREATE INDEX idx_academies_rating ON academies(rating_average DESC);
CREATE INDEX idx_academies_status ON academies(status);

CREATE TABLE academy_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_academy_certs_academy ON academy_certifications(academy_id);

CREATE TABLE academy_achievement_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id UUID UNIQUE NOT NULL REFERENCES academies(id) ON DELETE CASCADE,
  state_athletes_produced INTEGER DEFAULT 0,
  national_athletes_produced INTEGER DEFAULT 0,
  competition_participations TEXT[],
  milestones TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Coaches

```sql
CREATE TYPE coach_status AS ENUM ('draft', 'published', 'suspended');

CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  experience_years INTEGER NOT NULL,
  sports_coached TEXT[],
  specialization TEXT[],
  academy_id UUID REFERENCES academies(id) ON DELETE SET NULL,
  location_city VARCHAR(255) NOT NULL,
  location_state VARCHAR(255) NOT NULL,
  location_country VARCHAR(255) DEFAULT 'India',
  location_lat DOUBLE PRECISION NOT NULL,
  location_lng DOUBLE PRECISION NOT NULL,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  verification_status verification_status DEFAULT 'unverified',
  status coach_status DEFAULT 'published',
  rating_average DOUBLE PRECISION DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  last_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coaches_slug ON coaches(slug);
CREATE INDEX idx_coaches_academy ON coaches(academy_id);
CREATE INDEX idx_coaches_rating ON coaches(rating_average DESC);

CREATE TABLE coach_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  issuer VARCHAR(255) NOT NULL,
  year INTEGER NOT NULL,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coach_certs_coach ON coach_certifications(coach_id);
```

### 5. Sports & Competitions

```sql
CREATE TYPE sport_category AS ENUM ('team', 'individual', 'combat', 'racquet', 'aquatic', 'athletics', 'other');

CREATE TABLE sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon TEXT,
  cover_image TEXT,
  category sport_category NOT NULL,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sports_slug ON sports(slug);

CREATE TYPE competition_level AS ENUM ('district', 'state', 'national', 'international');

CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_slug VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  level competition_level NOT NULL,
  organiser VARCHAR(255) NOT NULL,
  what_is TEXT,
  why_important TEXT,
  progression TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (sport_slug) REFERENCES sports(slug) ON DELETE CASCADE
);

CREATE INDEX idx_competitions_sport ON competitions(sport_slug);
```

### 6. Enquiries & Leads

```sql
CREATE TYPE enquiry_target_type AS ENUM ('academy', 'coach');
CREATE TYPE enquiry_intent AS ENUM ('contact', 'callback', 'trial', 'enrollment_interest');
CREATE TYPE enquiry_status AS ENUM ('submitted', 'delivered', 'failed', 'bounced');

CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  target_type enquiry_target_type NOT NULL,
  target_id UUID NOT NULL,
  intent enquiry_intent NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  parent_email VARCHAR(255) NOT NULL,
  parent_phone VARCHAR(20) NOT NULL,
  child_name VARCHAR(255),
  child_age INTEGER,
  sport_interest VARCHAR(255) NOT NULL,
  message TEXT,
  status enquiry_status DEFAULT 'submitted',
  delivery_attempts INTEGER DEFAULT 0,
  last_delivery_at TIMESTAMPTZ,
  failure_reason TEXT,
  whatsapp_confirmation_sent BOOLEAN DEFAULT false,
  whatsapp_message_id VARCHAR(255),
  lead_id UUID,
  ip_hash VARCHAR(64),
  user_agent_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enquiries_user ON enquiries(user_id);
CREATE INDEX idx_enquiries_target ON enquiries(target_type, target_id);
CREATE INDEX idx_enquiries_status ON enquiries(status);

CREATE TYPE lead_owner AS ENUM ('academy', 'coach');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
  owner_type lead_owner NOT NULL,
  owner_id UUID NOT NULL,
  status lead_status DEFAULT 'new',
  notes TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_owner ON leads(owner_type, owner_id);
CREATE INDEX idx_leads_status ON leads(status);
```

### 7. Favorites & Recently Viewed

```sql
CREATE TYPE favorite_item_type AS ENUM ('academy', 'coach', 'sport');

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  context_child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  item_type favorite_item_type NOT NULL,
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id, context_child_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_item ON favorites(item_type, item_id);

CREATE TABLE recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  item_slug VARCHAR(255) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recently_viewed_user ON recently_viewed(user_id);
```

### 8. User Settings

```sql
CREATE TYPE motion_preference AS ENUM ('reduced', 'full');

CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  motion_preference motion_preference DEFAULT 'full',
  location_radius INTEGER DEFAULT 5,
  consent_analytics BOOLEAN DEFAULT false,
  consent_marketing BOOLEAN DEFAULT false,
  consent_whatsapp BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. Admin Tables

```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  changes JSONB,
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_admin ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_log_created ON admin_audit_log(created_at);

CREATE TABLE verification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(20) NOT NULL,
  entity_id UUID NOT NULL,
  submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  evidence JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_verification_queue_status ON verification_queue(status);
```

## Frontend → Backend Field Mapping

### Field Naming Mismatches to Resolve

| Frontend Field | Backend/Database Field | Table |
|---------------|----------------------|-------|
| `sport` (singular) | `sports_offered` (plural) | academies |
| `location.city` | `location_city` | academies, coaches |
| `skillLevel` | `skill_level` | coach_specializations |
| `phone` | `phone` | users (frontend uses `phoneNumber` in some forms) |
| `verificationStatus` | `verification_status` | academies, coaches |
| `batchInformation` | `batch_information` | academies |
| `trainingLevel` | `training_levels` | academies |
| `sportInterests` | `sport_interests` | children |
| `isActive` / `status` | `status` | academies, coaches |
| `slug` → URL param | `slug` → used as route param | academies, coaches, sports |
| `rating.average` | `rating_average` | academies, coaches |
| `rating.count` | `rating_count` | academies, coaches |

### Array → Junction Table Candidates

These are stored as arrays in frontend models but may benefit from junction tables at scale:

| Array Field | Table | Candidate Junction |
|------------|-------|-------------------|
| `sports_offered` (academies) | academies | `academy_sports` |
| `sports_coached` (coaches) | coaches | `coach_sports` |
| `sport_interests` (children) | children | `child_sport_interests` |
| `facilities` (academies) | academies | `academy_facilities` |
| `training_levels` (academies) | academies | `academy_training_levels` |
| `specialization` (coaches) | coaches | `coach_specializations` |
| `gallery` (academies) | academies | `academy_gallery_images` |

## localStorage-to-Backend Migration Map

| localStorage Key | Target Table(s) | Priority |
|-----------------|----------------|----------|
| `sportsos:auth-state` | sessions + users | P0 |
| `sportsos:profile` | users | P0 |
| `sportsos:children` | children | P0 |
| `sportsos:active-child` | user_settings | P1 |
| `sportsos:shortlist` | favorites | P1 |
| `sportsos:compare` | user_settings (JSONB) or session | P2 |
| `sportsos:recently-viewed` | recently_viewed | P1 |
| `sportsos:onboarding` | users (onboarding_completed) | P1 |
| `sportsos:selected-academy` | user_settings (JSONB) | P2 |
| `sportsos:signup-draft` | session (OTP flow) | P2 |
| `sportsos:editing-contact` | session (OTP flow) | P2 |

## Migration Strategy

### Phase 1 — Auth & Users (P0)
1. Implement `users`, `sessions`, `otp_codes` tables
2. Migrate `sportsos:auth-state` → sessions
3. Migrate `sportsos:profile` → users
4. Implement `/auth/*` endpoints
5. Deploy API for frontend integration

### Phase 2 — Children (P0)
1. Implement `children` table
2. Migrate `sportsos:children` + `sportsos:active-child`
3. Implement `/children/*` endpoints

### Phase 3 — Academy & Coach Data (P0)
1. Migrate mock data from `data/academies.ts` (10 items) → `academies`
2. Migrate mock data from `data/coaches.ts` (8 items) → `coaches`
3. Implement `/academies/*` and `/coaches/*` endpoints
4. Seed production data

### Phase 4 — Favorites & Recently Viewed (P1)
1. Implement `favorites`, `recently_viewed` tables
2. Migrate `sportsos:shortlist` → favorites
3. Migrate `sportsos:recently-viewed` → recently_viewed

### Phase 5 — Enquiries (P1)
1. Implement `enquiries`, `leads` tables
2. Implement `/enquiries/*` endpoints
3. Connect WhatsApp delivery pipeline

### Phase 6 — User Settings & Compare (P2)
1. Implement `user_settings` table
2. Migrate remaining localStorage keys
3. Implement `/users/me/settings` endpoint

### Phase 7 — Admin & Verification (P3)
1. Implement admin audit log
2. Implement verification queue
3. Implement content moderation

## Seed Data

Use existing mock data files as seed source:

- `data/academies.ts` — 10 academies with full Academy shape
- `data/coaches.ts` — 8 coaches with full Coach shape
- `data/sports.ts` — 22 sports with Sport shape
- `data/competitions.ts` — 6 competitions with Competition shape

## Operational Requirements

### Indexing Strategy
- GIN indexes on all array columns (`sports_offered`, `sports_coached`, `sport_interests`, `facilities`, `training_levels`)
- B-tree indexes on slug columns
- B-tree indexes on foreign keys
- Composite indexes on `(verification_status, status)` for admin filtering
- Partial index on `status = 'published'` for public queries
- Geospatial index on `(location_lat, location_lng)` for proximity search

### Performance Targets
- Academy search: < 200ms at 100K records
- Coach search: < 150ms at 50K records
- Auth endpoints: < 100ms
- Enquiry submission: < 500ms (including WhatsApp dispatch)
- Favorites CRUD: < 50ms

### Data Retention
- Sessions: 30 days after expiry, then purge
- OTP codes: 24 hours after creation
- Recently viewed: 90 days per user, max 100 items
- Audit log: 1 year, then archive
- Soft delete for users, academies, coaches (use `status` or `deleted_at`)

### Security Requirements
- OTP codes stored as SHA-256 hash, never plaintext
- Passwords stored as bcrypt with cost factor 12
- All PII encrypted at rest
- IP hashes use SHA-256 with application-level salt
- No raw PII in logs or error responses
- Row-Level Security (RLS) for multi-tenant data isolation
- Audit trail for all admin actions

### Realtime Requirements
- None currently — all data access is request-response
- Future: WebSocket for enquiry status updates
- Future: WebSocket for live notification delivery

## Current Implementation Status

| Component | Frontend Status | Backend Status |
|-----------|----------------|----------------|
| Auth (register, login, OTP) | Context + localStorage | NOT STARTED |
| User Profile | Context + localStorage  | NOT STARTED |
| Children CRUD | Context + localStorage | NOT STARTED |
| Academy Listing | Static mock data | NOT STARTED |
| Academy Detail | Static mock data | NOT STARTED |
| Coach Listing | Static mock data | NOT STARTED |
| Coach Detail | Static mock data | NOT STARTED |
| Favorites | Context + localStorage | NOT STARTED |
| Compare | Context + localStorage | NOT STARTED |
| Recently Viewed | Context + localStorage | NOT STARTED |
| Enquiries | In-memory + redirect | NOT STARTED |
| Search | Client-side filter | NOT STARTED |
| Recommendations | Static mock | NOT STARTED |
| Admin | Client-side only | NOT STARTED |
